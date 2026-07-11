import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { AnimatedSprite } from './AnimatedSprite'
import { askQuestion, cleanGameText, passesAll, type InterviewState } from './engine'
import type { Answer, Question, TutorialData } from './types'

const LOCAL = '/interrogation-local'

const gameHtml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/&lt;(\/?(?:b|i))&gt;/g, '<$1>')
    .replace(/&lt;color=#([0-9a-fA-F]{6})&gt;/g, '<span style="color:#$1">')
    .replace(/&lt;\/color&gt;/g, '</span>')
    .replace(/&lt;\/?nobr&gt;/g, '')
    .replace(/&lt;img=[^&]+\/&gt;/g, '')

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
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOpened(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const close = () => {
    setOpened(false)
    window.setTimeout(onClose, 320)
  }

  return (
    <div className={`casefile-modal ${opened ? 'opened' : ''}`} role="dialog" aria-label="Case file">
      <div className="casefile-book">
        <img className="casefile-spread" src={`${LOCAL}/casefile-ui/casefile16/000.png`} alt="Open case-file folder" />
        <img
          key={page}
          className="casefile-page"
          src={`${LOCAL}/casefile/${page}/000.png`}
          alt={page === 'brief_episode0' ? 'Case brief' : 'Subject dossier'}
        />
        <button className="casefile-close" aria-label="Close case file" onClick={close}>×</button>
        <button
          className={`casefile-arrow ${page === 'brief_episode0' ? 'next' : 'previous'}`}
          aria-label={page === 'brief_episode0' ? 'Next page' : 'Previous page'}
          onClick={() => setPage(page === 'brief_episode0' ? 'suspect_actor' : 'brief_episode0')}
        >{page === 'brief_episode0' ? '›' : '‹'}</button>
      </div>
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
  let requestedAnimation = 'tutor_idle'
  if (step.id === 'off_record' && lineIndex >= 1) requestedAnimation = 'tutor_secret'
  if (ready && ['meters', 'fear', 'wrap'].includes(step.id)) requestedAnimation = 'tutor_explain'
  const [animation, setAnimation] = useState(requestedAnimation)

  useEffect(() => setAnimation(requestedAnimation), [lineKey, ready, requestedAnimation])

  const animationComplete = useCallback(() => {
    setAnimation((current) => (current === 'tutor_idle' ? 'tutor_idle_blink' : 'tutor_idle'))
  }, [])

  return (
    <>
      <AnimatedSprite
        root={`${LOCAL}/tutor`}
        animation={animation}
        className="tutor tutor-world"
        alt="Academy instructor"
        loop={false}
        onComplete={animationComplete}
      />
      <button
        className={`tutor-bubble ${ready ? 'ready' : 'continue'}`}
        disabled={ready}
        onClick={onContinue}
      >
        <span dangerouslySetInnerHTML={{ __html: gameHtml(text) }} />
        {!ready && <i aria-hidden="true">▼</i>}
      </button>
    </>
  )
}

function Meter({ label, value, kind }: { label: string; value: number; kind: 'empathy' | 'fear' }) {
  const normalized = Math.max(0, Math.min(7, value))
  const amplitude = 3 + normalized * 2.2
  const points = Array.from({ length: 17 }, (_, index) => {
    const x = index * 10
    const y = index % 2 === 0 ? 20 : 20 + (index % 4 === 1 ? -amplitude : amplitude)
    return `${x},${y}`
  }).join(' ')
  return (
    <div className={`meter ${kind}`} aria-label={`${label}: ${value}`}>
      <span>{label}</span>
      <svg viewBox="0 0 160 40" aria-hidden="true"><polyline points={points} /></svg>
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
    audio.play('button_press')
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
      <section className="game-stage">
        <div className="room">
          <img className="room-background" src={`${LOCAL}/level/background/000.png`} alt="Interrogation room" />
          <img className="chair" src={`${LOCAL}/level/chair/000.png`} alt="" />
          <Tutor data={data} stepIndex={stepIndex} lineIndex={lineIndex} ready={ready} onContinue={continueTutor} />
          {subjectPresent && <AnimatedSprite root={`${LOCAL}/actor`} animation={animation} className="actor" alt={subject.name} />}
          <img className="lamp" src={`${LOCAL}/level/lamp/000.png`} alt="" />
          <img className="table" src={`${LOCAL}/level/table/000.png`} alt="" />
          {flash && <AnimatedSprite root={`${LOCAL}/torture-flashes`} animation={flash} className="torture-flash" alt="Impact" />}

          {subjectPresent && stepIndex >= 3 && (
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
          ><img src={`${LOCAL}/casefile-ui/casefile3/000.png`} alt="Case file" /></button>

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

          <aside className="question-panel">
            {ready && activeStep.gate === 'subject_brought_in' && !subjectPresent && (
              <button className="bring-in" onClick={() => {
                setSubjectPresent(true)
                audio.play('bring_them_in')
                window.setTimeout(advanceStep, 650)
              }}>Bring them in</button>
            )}
            <div className="questions">
              {visibleQuestions.map((question) => (
                <button
                  className={question.id >= 12 && question.id <= 14 ? 'accusation' : ''}
                  key={question.id}
                  onClick={() => handleQuestion(question)}
                >{cleanGameText(question.text.text)}</button>
              ))}
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

          {subjectPresent && (
            <div className="subject-card" title={subject.name}>
              <img src={`${LOCAL}/avatars/panel_avatar_tutored_actor/000.png`} alt={subject.name} />
            </div>
          )}

          <button className="pause-control" type="button">PAUSE</button>
          <button className="sound-control" onClick={() => audio.setMuted(!audio.muted)}>
            {audio.muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
          <span className="health">ACTOR {state.health}/7</span>
        </div>
      </section>

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
