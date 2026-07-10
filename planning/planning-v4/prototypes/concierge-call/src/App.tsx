import { useMemo, useState } from 'react'
import './App.css'
import {
  INITIAL_STATE,
  REHEARSAL_TARGETS,
  SCENE,
  applyEffects,
  determineOutcome,
  type Mood,
  type Move,
  type SceneState,
} from './scene'

type Phase = 'briefing' | 'call' | 'outcome'

type LogEntry = {
  speaker: 'concierge' | 'player'
  line: string
  translation: string
}

function Portrait({ mood }: { mood: Mood }) {
  const mouth = {
    neutral: 'M 144 164 Q 160 167 176 164',
    guarded: 'M 145 166 Q 160 161 175 166',
    irritated: 'M 146 168 L 174 165',
    surprised: 'M 150 164 Q 160 174 170 164',
    softened: 'M 145 162 Q 160 174 175 162',
  }[mood]

  const brows = {
    neutral: ['M 122 129 Q 137 124 148 129', 'M 172 129 Q 185 124 198 130'],
    guarded: ['M 122 130 Q 137 122 149 128', 'M 172 128 Q 186 122 199 130'],
    irritated: ['M 122 125 L 149 132', 'M 172 132 L 199 124'],
    surprised: ['M 122 122 Q 137 116 149 122', 'M 172 122 Q 187 116 199 123'],
    softened: ['M 123 130 Q 137 126 149 130', 'M 172 130 Q 186 126 198 131'],
  }[mood]

  return (
    <svg className="portrait" viewBox="0 0 320 420" role="img" aria-label={`Concierge, ${mood}`}>
      <defs>
        <linearGradient id="coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#51443f" />
          <stop offset="1" stopColor="#171514" />
        </linearGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d2ad94" />
          <stop offset="1" stopColor="#9c705e" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence baseFrequency="0.9" numOctaves="2" seed="9" type="fractalNoise" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .12 0" />
        </filter>
      </defs>
      <path d="M 26 420 C 36 310 91 276 160 274 C 232 276 286 312 298 420 Z" fill="url(#coat)" />
      <path d="M 125 248 L 117 301 L 160 338 L 203 301 L 194 246 Z" fill="url(#skin)" />
      <path d="M 101 105 C 102 49 135 26 168 29 C 214 32 230 78 218 130 L 205 209 C 199 251 179 274 157 273 C 130 271 111 247 105 207 Z" fill="url(#skin)" />
      <path d="M 94 132 C 84 74 117 22 165 18 C 219 14 243 66 224 145 L 211 114 C 198 97 191 72 193 51 C 170 75 135 84 105 79 Z" fill="#27211f" />
      <path d="M 98 131 C 86 142 91 181 111 188 L 109 141 Z" fill="url(#skin)" />
      <path d="M 218 129 C 233 140 229 180 208 188 L 211 139 Z" fill="url(#skin)" />
      <path d={brows[0]} fill="none" stroke="#3c2c29" strokeWidth="6" strokeLinecap="round" />
      <path d={brows[1]} fill="none" stroke="#3c2c29" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="137" cy="142" rx={mood === 'surprised' ? 8 : 10} ry={mood === 'surprised' ? 8 : 5} fill="#151312" />
      <ellipse cx="185" cy="142" rx={mood === 'surprised' ? 8 : 10} ry={mood === 'surprised' ? 8 : 5} fill="#151312" />
      <path d="M 160 139 L 154 184 L 166 188" fill="none" stroke="#835b50" strokeWidth="4" strokeLinecap="round" />
      <path d={mouth} fill="none" stroke="#512f31" strokeWidth="5" strokeLinecap="round" />
      <path d="M 119 213 Q 159 234 202 211" fill="none" stroke="#8e6559" strokeWidth="3" opacity=".5" />
      <path d="M 28 420 C 65 338 112 314 160 338 C 213 309 260 340 296 420" fill="none" stroke="#856c5e" strokeWidth="3" opacity=".5" />
      <rect width="320" height="420" filter="url(#grain)" opacity=".4" />
    </svg>
  )
}

function Meter({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const bounded = Math.max(0, Math.min(max, value))
  return (
    <div className="meter">
      <div className="meter-label"><span>{label}</span><b>{bounded}</b></div>
      <div className="meter-track"><span style={{ width: `${(bounded / max) * 100}%` }} /></div>
    </div>
  )
}

function App() {
  const [phase, setPhase] = useState<Phase>('briefing')
  const [nodeId, setNodeId] = useState(SCENE.startNode)
  const [sceneState, setSceneState] = useState<SceneState>(INITIAL_STATE)
  const [log, setLog] = useState<LogEntry[]>([])
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [debugOpen, setDebugOpen] = useState(false)
  const [delivering, setDelivering] = useState(false)

  const node = SCENE.nodes[nodeId]
  const outcome = useMemo(() => determineOutcome(sceneState), [sceneState])

  const startCall = () => {
    setLog([{ speaker: 'concierge', line: node.npcLine, translation: node.npcTranslation }])
    setPhase('call')
  }

  const deliverMove = () => {
    if (!selectedMove || delivering) return
    setDelivering(true)

    window.setTimeout(() => {
      const nextState = applyEffects(sceneState, selectedMove.effects)
      const nextLog: LogEntry[] = [
        ...log,
        { speaker: 'player', line: selectedMove.line, translation: selectedMove.translation },
      ]

      setSceneState(nextState)
      setSelectedMove(null)
      setDelivering(false)

      if (selectedMove.next === 'outcome') {
        setLog(nextLog)
        setPhase('outcome')
        return
      }

      const nextNode = SCENE.nodes[selectedMove.next]
      setNodeId(selectedMove.next)
      setLog([
        ...nextLog,
        { speaker: 'concierge', line: nextNode.npcLine, translation: nextNode.npcTranslation },
      ])
    }, 850)
  }

  const reset = () => {
    setPhase('briefing')
    setNodeId(SCENE.startNode)
    setSceneState(INITIAL_STATE)
    setLog([])
    setSelectedMove(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">IU<span>01</span></div>
        <div>
          <p className="eyebrow">FIELD LANGUAGE UNIT / PARIS</p>
          <h1>The Concierge Call</h1>
        </div>
        <button className="debug-button" onClick={() => setDebugOpen((value) => !value)}>
          {debugOpen ? 'Hide' : 'Show'} scene machine
        </button>
      </header>

      {phase === 'briefing' && (
        <section className="briefing-layout">
          <article className="briefing-copy panel">
            <p className="section-number">CASE 01 / 22:17</p>
            <h2>A tenant disappeared. The witness changed her story.</h2>
            <p className="lede">
              Daniel Reed, an American renter, was last seen in the lobby at 21:40.
              The concierge says she could not understand him. The tape says otherwise.
            </p>
            <div className="evidence-strip">
              <div className="evidence-photo"><span>DR</span><small>Daniel Reed<br />Missing, 36 hrs</small></div>
              <div className="evidence-card active"><b>01</b><span>Lobby tape</span><small>00:18 / disputed</small></div>
              <div className="evidence-card"><b>02</b><span>Statement</span><small>signed 23:05</small></div>
            </div>
            <div className="audio-audition">
              <div>
                <p className="eyebrow">LOCAL TTS AUDITION</p>
                <strong>OmniVoice / concierge voice-design take</strong>
                <small>CC BY-NC prototype output · local only</small>
              </div>
              <audio controls src="/audio/generated/omnivoice-concierge-audition.wav" />
            </div>
          </article>

          <aside className="rehearsal panel">
            <p className="section-number">HANDLER PREP / 02:00</p>
            <h3>Your usable language</h3>
            <p>You do not need fluency. You need four moves at the right moment.</p>
            <ol className="target-list">
              {REHEARSAL_TARGETS.map((target, index) => (
                <li key={target.id}>
                  <span>0{index + 1}</span>
                  <div><b>{target.line}</b><small>{target.function}</small></div>
                </li>
              ))}
            </ol>
            <button className="primary-button" onClick={startCall}>Place the call</button>
            <p className="microcopy">Prototype input: select a speech intent, then deliver the French line.</p>
          </aside>
        </section>
      )}

      {phase === 'call' && (
        <section className="call-layout">
          <aside className="case-rail panel">
            <p className="section-number">LIVE STATE</p>
            <Meter label="Trust" value={sceneState.trust} />
            <Meter label="Clarity" value={sceneState.clarity} />
            <Meter label="Pressure" value={sceneState.pressure} />
            <div className="objective-card">
              <span>OBJECTIVE</span>
              <b>{node.objective}</b>
            </div>
            <div className="flag-list">
              <span>CASE FLAGS</span>
              {sceneState.flags.length ? sceneState.flags.map((flag) => <code key={flag}>{flag}</code>) : <small>None yet</small>}
            </div>
          </aside>

          <article className="scene panel">
            <div className={`portrait-stage mood-${node.mood}`}>
              <div className="signal"><i /><i /><i /><i /><i /></div>
              <Portrait mood={node.mood} />
              <div className="caller-id"><span>Mme. Vautrin</span><small>Concierge / 11e arrondissement</small></div>
            </div>

            <div className="dialogue-box">
              <div className="speaker-row"><span>VAUTRIN</span><small>{node.beat}</small></div>
              <p lang="fr">{node.npcLine}</p>
              <small>{node.npcTranslation}</small>
            </div>

            <div className="moves">
              <div className="moves-heading"><span>Choose the conversational move</span><small>Intent first. Language second.</small></div>
              <div className="move-grid">
                {node.moves.map((move) => (
                  <button
                    key={move.id}
                    className={selectedMove?.id === move.id ? 'move-card selected' : 'move-card'}
                    onClick={() => setSelectedMove(move)}
                  >
                    <span>{move.intent}</span>
                    <b lang="fr">{move.line}</b>
                    <small>{move.translation}</small>
                    <em>{move.targets.join(' · ')}</em>
                  </button>
                ))}
              </div>
              <button className="deliver-button" disabled={!selectedMove || delivering} onClick={deliverMove}>
                {delivering ? 'Delivering…' : selectedMove ? `Speak: ${selectedMove.intent}` : 'Select a move'}
              </button>
            </div>
          </article>

          <aside className="transcript panel">
            <p className="section-number">CALL TRANSCRIPT</p>
            <div className="transcript-scroll">
              {log.map((entry, index) => (
                <div className={`log-entry ${entry.speaker}`} key={`${entry.speaker}-${index}`}>
                  <span>{entry.speaker === 'player' ? 'YOU' : 'VAUTRIN'}</span>
                  <p>{entry.line}</p>
                  <small>{entry.translation}</small>
                </div>
              ))}
            </div>
          </aside>
        </section>
      )}

      {phase === 'outcome' && (
        <section className="outcome-layout panel">
          <div className={`outcome-seal outcome-${outcome.id}`}><span>{outcome.grade}</span></div>
          <p className="section-number">CALL CLOSED / CONSEQUENCE RECORDED</p>
          <h2>{outcome.title}</h2>
          <p className="lede">{outcome.description}</p>
          <div className="outcome-grid">
            <div><span>Evidence</span><b>{outcome.evidence}</b></div>
            <div><span>Next route</span><b>{outcome.route}</b></div>
            <div><span>Language recovered</span><b>{outcome.review}</b></div>
          </div>
          <button className="primary-button" onClick={reset}>Replay the scene</button>
        </section>
      )}

      {debugOpen && (
        <aside className="debug-drawer">
          <div><span>INTERROGATION MAPPING</span><button onClick={() => setDebugOpen(false)}>×</button></div>
          <dl>
            <dt>Episode page</dt><dd>{phase === 'call' ? node.id : phase}</dd>
            <dt>Visible questions</dt><dd>{phase === 'call' ? node.moves.length : 0}</dd>
            <dt>Stats</dt><dd>trust / clarity / pressure</dd>
            <dt>Flags</dt><dd>{sceneState.flags.join(', ') || '—'}</dd>
            <dt>Animation</dt><dd>{phase === 'call' ? node.mood : 'neutral'}</dd>
          </dl>
          <p>Every speech move has explicit effects and one destination. The authoring validator rejects unknown nodes, effectless choices, and unused teaching targets.</p>
        </aside>
      )}
    </main>
  )
}

export default App
