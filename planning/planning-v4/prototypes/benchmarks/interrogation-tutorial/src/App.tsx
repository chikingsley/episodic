import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { AnimatedSprite } from './AnimatedSprite'
import { askQuestion, cleanGameText, passesAll, type InterviewState } from './engine'
import type { Answer, Question, TutorialData } from './types'

const LOCAL = '/interrogation-local'

const gatePrompts: Record<string, string> = {
  casefile_open: 'Open the case file on the table, inspect both pages, then close it.',
  subject_brought_in: 'Bring Douglas Byrd into the interview room.',
  completed_intro: 'Ask the accusation question and listen to his answer.',
  empathy_4: 'Build empathy to at least 4. Start soft and revisit questions as his state changes.',
  fear_4: 'Build fear to at least 4. New answers unlock as the meters change.',
  recorder_off: 'Stop the recorder.',
  two_tortures: 'Use exactly two enhanced-interrogation actions.',
  recorder_on: 'Start the recorder again.',
  tutorial_won: 'Get the accusation response, then press the terrified subject hard enough to sign.',
  complete: 'Academy drill complete.',
}

function useAudioSystem(started: boolean) {
  const [muted, setMuted] = useState(false)
  const music = useRef<HTMLAudioElement | null>(null)
  const ambience = useRef<HTMLAudioElement | null>(null)
  const oneShots = useRef(new Map<string, HTMLAudioElement>())

  const safePlay = useCallback((audio: HTMLAudioElement) => {
    void audio.play().catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!started) return
    music.current = new Audio(`${LOCAL}/audio/tutorial_music.ogg`)
    ambience.current = new Audio(`${LOCAL}/audio/roomnoise.ogg`)
    music.current.loop = true
    ambience.current.loop = true
    music.current.volume = 0.33
    ambience.current.volume = 0.18
    safePlay(music.current)
    safePlay(ambience.current)
    return () => {
      music.current?.pause()
      ambience.current?.pause()
      oneShots.current.forEach((audio) => audio.pause())
    }
  }, [safePlay, started])

  useEffect(() => {
    if (music.current) music.current.muted = muted
    if (ambience.current) ambience.current.muted = muted
    oneShots.current.forEach((audio) => (audio.muted = muted))
  }, [muted])

  const play = useCallback(
    (name: string) => {
      if (!started) return
      let audio = oneShots.current.get(name)
      if (!audio) {
        audio = new Audio(`${LOCAL}/audio/${name}.ogg`)
        audio.preload = 'auto'
        oneShots.current.set(name, audio)
      }
      audio.muted = muted
      audio.currentTime = 0
      safePlay(audio)
    },
    [muted, safePlay, started],
  )

  return { muted, setMuted, play }
}

function CaseFile({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState<'brief_episode0' | 'suspect_actor'>('brief_episode0')
  return (
    <div className="casefile-modal" role="dialog" aria-label="Case file">
      <div className="casefile-tabs">
        <button className={page === 'brief_episode0' ? 'active' : ''} onClick={() => setPage('brief_episode0')}>
          Case brief
        </button>
        <button className={page === 'suspect_actor' ? 'active' : ''} onClick={() => setPage('suspect_actor')}>
          Subject
        </button>
        <button className="casefile-close" onClick={onClose}>Close file</button>
      </div>
      <img src={`${LOCAL}/casefile/${page}/000.png`} alt={page === 'brief_episode0' ? 'Case brief' : 'Subject dossier'} />
    </div>
  )
}

function Tutor({
  data,
  stepIndex,
  lineIndex,
  ready,
  onContinue,
}: {
  data: TutorialData
  stepIndex: number
  lineIndex: number
  ready: boolean
  onContinue: () => void
}) {
  const step = data.script[stepIndex]
  const lineKey = step.lines[Math.min(lineIndex, step.lines.length - 1)]
  const text = data.tutor_lines[lineKey]
  return (
    <aside className="tutor-panel">
      <AnimatedSprite root={`${LOCAL}/tutor`} animation={ready ? 'tutor_idle' : 'tutor_explain'} className="tutor" alt="Academy instructor" />
      <div className="tutor-copy">
        <div className="eyebrow">Academy instructor · {stepIndex + 1}/{data.script.length}</div>
        <p>{cleanGameText(text)}</p>
        {!ready ? (
          <button className="continue" onClick={onContinue}>Continue</button>
        ) : (
          <div className="gate-prompt">{gatePrompts[step.gate]}</div>
        )}
      </div>
    </aside>
  )
}

function Meter({ label, value, kind }: { label: string; value: number; kind: 'empathy' | 'fear' }) {
  const normalized = Math.max(0, Math.min(7, value))
  return (
    <div className={`meter ${kind}`} aria-label={`${label}: ${value}`}>
      <span>{label}</span>
      <div className="meter-track"><i style={{ height: `${(normalized / 7) * 100}%` }} /></div>
      <b>{value}</b>
    </div>
  )
}

function App() {
  const [data, setData] = useState<TutorialData>()
  const [loadError, setLoadError] = useState('')
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [casefileOpen, setCasefileOpen] = useState(false)
  const [subjectPresent, setSubjectPresent] = useState(false)
  const [recorderOn, setRecorderOn] = useState(true)
  const [page, setPage] = useState('root')
  const [answer, setAnswer] = useState<Answer>()
  const [lastQuestion, setLastQuestion] = useState<Question>()
  const [feedback, setFeedback] = useState('')
  const [animation, setAnimation] = useState('actor_idle')
  const [tortureCount, setTortureCount] = useState(0)
  const [flash, setFlash] = useState('')
  const [state, setState] = useState<InterviewState>({
    empathy: 0,
    fear: 0,
    health: 7,
    flags: new Set(),
    usedAnswers: new Set(),
  })
  const audio = useAudioSystem(started)

  useEffect(() => {
    fetch(`${LOCAL}/tutorial.json`)
      .then((response) => {
        if (!response.ok) throw new Error('The private tutorial payload has not been generated.')
        return response.json() as Promise<TutorialData>
      })
      .then(setData)
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : String(error)))
  }, [])

  const step = data?.script[stepIndex]
  const subject = data?.episode.subjects[0]

  const advanceStep = useCallback(() => {
    if (!data) return
    const nextIndex = Math.min(stepIndex + 1, data.script.length - 1)
    setStepIndex(nextIndex)
    setLineIndex(0)
    setReady(false)
    setFeedback('')
    setAnswer(undefined)
    if (data.script[nextIndex]?.page) setPage(data.script[nextIndex].page!)
    if (data.script[nextIndex]?.id === 'wrap') {
      setState((current) => ({ ...current, flags: new Set([...current.flags, 'accusable']) }))
    }
  }, [data, stepIndex])

  const continueTutor = () => {
    if (!step) return
    if (lineIndex < step.lines.length - 1) setLineIndex((current) => current + 1)
    else setReady(true)
  }

  const visibleQuestions = useMemo(() => {
    if (!data || !subject || !ready || !step) return []
    if (!['straight_ask', 'meters', 'fear', 'wrap'].includes(step.id)) return []
    const ids = subject.questions[page] ?? []
    return ids
      .map((id) => data.episode.questions.find((question) => question.id === id))
      .filter((question): question is Question => Boolean(question && passesAll(question.visibility_conditions, state)))
  }, [data, page, ready, state, step, subject])

  const handleQuestion = (question: Question) => {
    if (!data || !step) return
    audio.play('ask')
    const result = askQuestion(data, question, state)
    if (!result.answer) return
    setState(result.state)
    setAnswer(result.answer)
    setLastQuestion(question)
    setFeedback(result.feedbackText)
    setAnimation(result.answer.animation || 'actor_idle')

    window.setTimeout(() => setAnimation('actor_idle'), 2300)
    if (step.id === 'straight_ask' && result.state.flags.has('completed_intro')) {
      window.setTimeout(advanceStep, 700)
    } else if (step.id === 'meters' && result.state.empathy >= 4) {
      window.setTimeout(advanceStep, 700)
    } else if (step.id === 'fear' && result.state.fear >= 4) {
      window.setTimeout(advanceStep, 700)
    } else if (step.id === 'wrap') {
      if (result.state.flags.has('exit_success')) setPage('exit_fork')
      if (result.state.flags.has('tutorial_won')) window.setTimeout(advanceStep, 900)
    }
  }

  const useTorture = (name: string) => {
    if (!data || tortureCount >= 2) return
    const effect = data.torture_effects[name]
    const nextCount = tortureCount + 1
    setState((current) => ({
      ...current,
      fear: current.fear + effect.fear,
      empathy: current.empathy + effect.empathy,
      health: 7,
    }))
    setTortureCount(nextCount)
    setAnimation('actor_defence')
    setFlash(`torture_flash${Math.min(effect.id, 4)}`)
    setAnswer(undefined)
    setFeedback(subject?.torture_reactions[Math.min(effect.id - 1, 3)]?.reaction.text ?? '')
    audio.play(`torture_male_${Math.min(nextCount, 3)}`)
    window.setTimeout(() => {
      setFlash('')
      setAnimation('actor_idle_scared')
    }, 900)
    if (nextCount === 2) window.setTimeout(advanceStep, 1200)
  }

  if (loadError) {
    return <main className="fatal"><h1>Local benchmark payload missing</h1><p>{loadError}</p><code>interrogation-unfold export-tutorial public/interrogation-local/tutorial.json</code></main>
  }
  if (!data || !subject) return <main className="fatal"><p>Loading recovered tutorial…</p></main>

  if (!started) {
    return (
      <main className="start-screen">
        <div className="start-card">
          <div className="eyebrow">Private reconstruction benchmark</div>
          <h1>{data.slides[0]}</h1>
          <p>This replays the shipped academy tutorial logic and locally recovered presentation assets. Sound begins only after your click.</p>
          <button onClick={() => setStarted(true)}>Begin reconstruction</button>
        </div>
      </main>
    )
  }

  const activeStep = step!
  const complete = activeStep.id === 'complete' && ready

  return (
    <main className="game-shell">
      <header className="topbar">
        <div><span className="brand">INTERROGATION</span><small>Academy reconstruction benchmark</small></div>
        <div className="top-actions">
          <span className="health">Actor health {state.health}/7</span>
          <button onClick={() => audio.setMuted(!audio.muted)}>{audio.muted ? 'Sound off' : 'Sound on'}</button>
        </div>
      </header>

      <section className="game-stage">
        <div className="room">
          <img className="room-background" src={`${LOCAL}/level/background/000.png`} alt="Interrogation room" />
          <img className="chair" src={`${LOCAL}/level/chair/000.png`} alt="" />
          {subjectPresent && <AnimatedSprite root={`${LOCAL}/actor`} animation={animation} className="actor" alt={subject.name} />}
          <img className="lamp" src={`${LOCAL}/level/lamp/000.png`} alt="" />
          <img className="table" src={`${LOCAL}/level/table/000.png`} alt="" />
          {flash && <AnimatedSprite root={`${LOCAL}/torture-flashes`} animation={flash} className="torture-flash" alt="Impact" />}

          {subjectPresent && (
            <div className="meters">
              <Meter label="Open" value={state.empathy} kind="empathy" />
              <Meter label="Fear" value={state.fear} kind="fear" />
            </div>
          )}

          {lastQuestion && answer && (
            <div className="exchange">
              <div className="question-spoken">{cleanGameText(lastQuestion.text.text)}</div>
              <div className="answer-spoken">
                <strong>{subject.name}</strong>
                {cleanGameText(answer.text.text)}
                {answer.reaction?.text && <em>{cleanGameText(answer.reaction.text)}</em>}
              </div>
            </div>
          )}

          {feedback && <div className="feedback">{cleanGameText(feedback)}</div>}

          <button
            className={`casefile-object ${ready && activeStep.gate === 'casefile_open' ? 'highlight' : ''}`}
            onClick={() => {
              setCasefileOpen(true)
              audio.play('casefile_open')
            }}
          >CASE FILE</button>

          <button
            className={`recorder ${ready && ['recorder_off', 'recorder_on'].includes(activeStep.gate) ? 'highlight' : ''}`}
            disabled={!subjectPresent}
            onClick={() => {
              if (activeStep.gate === 'recorder_off' && recorderOn) {
                setRecorderOn(false)
                audio.play('tape_stop')
                advanceStep()
              } else if (activeStep.gate === 'recorder_on' && !recorderOn) {
                setRecorderOn(true)
                audio.play('tape_start')
                advanceStep()
              }
            }}
          >
            <img src={`${LOCAL}/level/${recorderOn ? 'recorder_play' : 'recorder_pause'}/000.png`} alt="" />
            <span>{recorderOn ? 'REC' : 'OFF RECORD'}</span>
          </button>

          {ready && activeStep.gate === 'subject_brought_in' && !subjectPresent && (
            <button className="bring-in" onClick={() => {
              setSubjectPresent(true)
              audio.play('bring_them_in')
              window.setTimeout(advanceStep, 650)
            }}>Bring in subject</button>
          )}
        </div>

        <aside className="question-panel">
          <div className="subject-card">
            <img src={`${LOCAL}/avatars/panel_avatar_tutored_actor/000.png`} alt="" />
            <div><strong>{subject.name}</strong><span>Training subject</span></div>
          </div>
          <div className="question-heading">Questioning</div>
          <div className="questions">
            {visibleQuestions.map((question) => (
              <button key={question.id} onClick={() => handleQuestion(question)}>
                <span>{question.id === 14 || question.id === 13 || question.id === 12 ? 'ACCUSATION' : `Q${question.id}`}</span>
                {cleanGameText(question.text.text)}
              </button>
            ))}
            {!visibleQuestions.length && <p className="waiting">Follow the instructor’s highlighted action.</p>}
          </div>

          {ready && activeStep.gate === 'two_tortures' && (
            <div className="torture-tools">
              <h3>Enhanced interrogation · {tortureCount}/2</h3>
              {['grab', 'wall', 'cut'].map((name) => (
                <button key={name} disabled={tortureCount >= 2} onClick={() => useTorture(name)}>{name}</button>
              ))}
            </div>
          )}
        </aside>
      </section>

      <Tutor data={data} stepIndex={stepIndex} lineIndex={lineIndex} ready={ready} onContinue={continueTutor} />
      {casefileOpen && <CaseFile onClose={() => {
        setCasefileOpen(false)
        audio.play('casefile_close')
        if (ready && activeStep.gate === 'casefile_open') advanceStep()
      }} />}
      {complete && <div className="mission"><div><span>ACADEMY DRILL</span><h2>{cleanGameText(data.tutor_lines['tutorial.tutor27'])}</h2><p>Confession obtained. The entire opening tutorial path is now represented in-browser.</p><button onClick={() => window.location.reload()}>Run it again</button></div></div>}
    </main>
  )
}

export default App
