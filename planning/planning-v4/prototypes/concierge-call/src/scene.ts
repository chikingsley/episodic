export type Stat = 'trust' | 'clarity' | 'pressure'
export type Mood = 'neutral' | 'guarded' | 'irritated' | 'surprised' | 'softened'

export type SceneState = {
  trust: number
  clarity: number
  pressure: number
  flags: string[]
}

export type Effect =
  | { type: 'increment'; stat: Stat; amount: number }
  | { type: 'setFlag'; flag: string }

export type Move = {
  id: string
  intent: string
  line: string
  translation: string
  targets: string[]
  effects: Effect[]
  next: string | 'outcome'
}

export type SceneNode = {
  id: string
  beat: string
  objective: string
  npcLine: string
  npcTranslation: string
  mood: Mood
  moves: Move[]
}

export type SceneDefinition = {
  id: string
  startNode: string
  teachingTargets: string[]
  nodes: Record<string, SceneNode>
}

export const REHEARSAL_TARGETS = [
  { id: 'polite_opening', line: 'Pardon, madame.', function: 'open without escalating' },
  { id: 'english_check', line: 'Parlez-vous anglais ?', function: 'check the shared language' },
  { id: 'limited_french', line: 'Je comprends un peu le français.', function: 'state your limit without surrendering' },
  { id: 'understanding_check', line: "Vous comprenez l'anglais ?", function: 'verify what the witness understood' },
] as const

export const INITIAL_STATE: SceneState = {
  trust: 2,
  clarity: 0,
  pressure: 2,
  flags: [],
}

export const SCENE: SceneDefinition = {
  id: 'case_01_concierge_call',
  startNode: 'opening',
  teachingTargets: REHEARSAL_TARGETS.map((target) => target.id),
  nodes: {
    opening: {
      id: 'opening',
      beat: 'Contact',
      objective: 'Keep her on the line.',
      npcLine: "Allô ? Qui est à l'appareil ?",
      npcTranslation: 'Hello? Who is calling?',
      mood: 'guarded',
      moves: [
        {
          id: 'polite_open',
          intent: 'Soften',
          line: 'Bonjour, madame. Pardon de vous déranger.',
          translation: 'Good evening, ma’am. Sorry to bother you.',
          targets: ['polite_opening'],
          effects: [
            { type: 'increment', stat: 'trust', amount: 2 },
            { type: 'setFlag', flag: 'opened_politely' },
          ],
          next: 'language_check',
        },
        {
          id: 'english_first',
          intent: 'Verify',
          line: 'Pardon, madame. Parlez-vous anglais ?',
          translation: 'Excuse me, ma’am. Do you speak English?',
          targets: ['polite_opening', 'english_check'],
          effects: [
            { type: 'increment', stat: 'clarity', amount: 1 },
            { type: 'increment', stat: 'pressure', amount: 1 },
            { type: 'setFlag', flag: 'asked_english_first' },
          ],
          next: 'language_check',
        },
      ],
    },
    language_check: {
      id: 'language_check',
      beat: 'Language boundary',
      objective: 'Establish what each of you can understand.',
      npcLine: "Un peu. Mais parlez lentement. Qu'est-ce que vous voulez ?",
      npcTranslation: 'A little. But speak slowly. What do you want?',
      mood: 'guarded',
      moves: [
        {
          id: 'admit_limit',
          intent: 'Disclose',
          line: 'Je comprends un peu le français.',
          translation: 'I understand a little French.',
          targets: ['limited_french'],
          effects: [
            { type: 'increment', stat: 'trust', amount: 2 },
            { type: 'increment', stat: 'clarity', amount: 1 },
            { type: 'setFlag', flag: 'declared_limit' },
          ],
          next: 'identify_tenant',
        },
        {
          id: 'verify_her_english',
          intent: 'Confirm',
          line: "Vous comprenez l'anglais ?",
          translation: 'Do you understand English?',
          targets: ['understanding_check'],
          effects: [
            { type: 'increment', stat: 'clarity', amount: 2 },
            { type: 'increment', stat: 'pressure', amount: 1 },
            { type: 'setFlag', flag: 'english_admission' },
          ],
          next: 'identify_tenant',
        },
      ],
    },
    identify_tenant: {
      id: 'identify_tenant',
      beat: 'Identification',
      objective: 'Put Daniel Reed in the lobby.',
      npcLine: 'Je suis fatiguée. Dites-moi pourquoi vous appelez.',
      npcTranslation: 'I am tired. Tell me why you are calling.',
      mood: 'irritated',
      moves: [
        {
          id: 'identify_directly',
          intent: 'Identify',
          line: "Je cherche un Américain. Il s'appelle Daniel Reed.",
          translation: 'I am looking for an American. His name is Daniel Reed.',
          targets: ['limited_french'],
          effects: [
            { type: 'increment', stat: 'clarity', amount: 2 },
            { type: 'setFlag', flag: 'tenant_named' },
          ],
          next: 'denial',
        },
        {
          id: 'ask_name',
          intent: 'Probe',
          line: 'Vous connaissez Daniel Reed ?',
          translation: 'Do you know Daniel Reed?',
          targets: ['understanding_check'],
          effects: [
            { type: 'increment', stat: 'clarity', amount: 1 },
            { type: 'increment', stat: 'pressure', amount: 1 },
            { type: 'setFlag', flag: 'tenant_named' },
          ],
          next: 'denial',
        },
      ],
    },
    denial: {
      id: 'denial',
      beat: 'The claim',
      objective: 'Make her define “did not understand.”',
      npcLine: "Oui, je l'ai vu. Mais je ne comprends pas cet homme. Il ne parle pas français.",
      npcTranslation: 'Yes, I saw him. But I do not understand that man. He does not speak French.',
      mood: 'irritated',
      moves: [
        {
          id: 'check_english_again',
          intent: 'Pin down',
          line: "Vous ne comprenez pas l'anglais ?",
          translation: 'You do not understand English?',
          targets: ['understanding_check', 'english_check'],
          effects: [
            { type: 'increment', stat: 'clarity', amount: 2 },
            { type: 'increment', stat: 'pressure', amount: 1 },
            { type: 'setFlag', flag: 'claim_pinned' },
          ],
          next: 'admission',
        },
        {
          id: 'correct_tenant_french',
          intent: 'Correct',
          line: 'Il comprend un peu le français.',
          translation: 'He understands a little French.',
          targets: ['limited_french'],
          effects: [
            { type: 'increment', stat: 'trust', amount: -1 },
            { type: 'increment', stat: 'clarity', amount: 1 },
            { type: 'setFlag', flag: 'tenant_french_known' },
          ],
          next: 'admission',
        },
      ],
    },
    admission: {
      id: 'admission',
      beat: 'Contradiction',
      objective: 'Turn partial understanding into evidence.',
      npcLine: "Je comprends un peu l'anglais, oui. Mais ce soir-là... c'était différent.",
      npcTranslation: 'I understand a little English, yes. But that night… it was different.',
      mood: 'surprised',
      moves: [
        {
          id: 'play_tape',
          intent: 'Demonstrate',
          line: 'Pardon, madame. Écoutez encore une fois.',
          translation: 'Excuse me, ma’am. Listen one more time.',
          targets: ['polite_opening'],
          effects: [
            { type: 'increment', stat: 'trust', amount: 1 },
            { type: 'increment', stat: 'clarity', amount: 1 },
            { type: 'setFlag', flag: 'tape_replayed' },
          ],
          next: 'tape_recognition',
        },
        {
          id: 'challenge_english_reply',
          intent: 'Challenge',
          line: 'Alors, pourquoi avez-vous répondu en anglais ?',
          translation: 'Then why did you answer in English?',
          targets: ['english_check'],
          effects: [
            { type: 'increment', stat: 'trust', amount: -2 },
            { type: 'increment', stat: 'clarity', amount: 3 },
            { type: 'increment', stat: 'pressure', amount: 2 },
            { type: 'setFlag', flag: 'direct_contradiction' },
          ],
          next: 'outcome',
        },
      ],
    },
    tape_recognition: {
      id: 'tape_recognition',
      beat: 'Recognition',
      objective: 'Get one fact she cannot take back.',
      npcLine: "Attendez... cette voix. Ce n'est pas Daniel.",
      npcTranslation: 'Wait… that voice. That is not Daniel.',
      mood: 'softened',
      moves: [
        {
          id: 'identify_voice',
          intent: 'Identify',
          line: "Vous connaissez cette voix ?",
          translation: 'Do you know this voice?',
          targets: ['understanding_check'],
          effects: [
            { type: 'increment', stat: 'clarity', amount: 3 },
            { type: 'increment', stat: 'trust', amount: 1 },
            { type: 'setFlag', flag: 'second_voice_found' },
          ],
          next: 'outcome',
        },
        {
          id: 'push_understanding',
          intent: 'Pressure',
          line: 'Vous comprenez maintenant ?',
          translation: 'Do you understand now?',
          targets: ['understanding_check'],
          effects: [
            { type: 'increment', stat: 'clarity', amount: 2 },
            { type: 'increment', stat: 'pressure', amount: 2 },
            { type: 'setFlag', flag: 'witness_pressured' },
          ],
          next: 'outcome',
        },
      ],
    },
  },
}

export function applyEffects(state: SceneState, effects: Effect[]): SceneState {
  return effects.reduce<SceneState>((next, effect) => {
    if (effect.type === 'setFlag') {
      return next.flags.includes(effect.flag) ? next : { ...next, flags: [...next.flags, effect.flag] }
    }

    return { ...next, [effect.stat]: next[effect.stat] + effect.amount }
  }, state)
}

export function determineOutcome(state: SceneState) {
  if (state.clarity >= 8 && state.trust >= 3) {
    return {
      id: 'clean', grade: 'A', title: 'A second voice enters the case.',
      description: 'Vautrin identifies that the disputed line was not spoken by Daniel. She stays cooperative long enough to describe the other caller.',
      evidence: 'Unknown male voice', route: 'Building access unlocked', review: 'understand / a little / English',
    }
  }
  if (state.clarity >= 6) {
    return {
      id: 'costly', grade: 'B', title: 'The contradiction holds, but the witness closes.',
      description: 'You establish that Vautrin understood more than her statement admits. The pressure costs the relationship, so the next lead must come from the tape.',
      evidence: 'False language claim', route: 'Audio analysis unlocked', review: 'English check / clarification',
    }
  }
  return {
    id: 'weak', grade: 'C', title: 'A lead, not a conclusion.',
    description: 'The call confirms that Vautrin saw Daniel, but the language contradiction remains unresolved. The case advances with weaker evidence.',
    evidence: 'Last confirmed sighting', route: 'Lobby canvass unlocked', review: 'polite opening / identity',
  }
}

function validateScene(scene: SceneDefinition) {
  const targetUses = new Map(scene.teachingTargets.map((target) => [target, 0]))

  if (!scene.nodes[scene.startNode]) throw new Error(`Unknown start node: ${scene.startNode}`)

  for (const [nodeKey, node] of Object.entries(scene.nodes)) {
    if (node.id !== nodeKey) throw new Error(`Node key/id mismatch: ${nodeKey}`)
    if (node.moves.length < 2) throw new Error(`Node ${node.id} needs at least two meaningful moves`)

    for (const move of node.moves) {
      if (!move.effects.length) throw new Error(`Move ${move.id} has no consequence`)
      if (move.next !== 'outcome' && !scene.nodes[move.next]) throw new Error(`Move ${move.id} targets unknown node ${move.next}`)
      for (const target of move.targets) {
        if (!targetUses.has(target)) throw new Error(`Move ${move.id} references unknown target ${target}`)
        targetUses.set(target, (targetUses.get(target) ?? 0) + 1)
      }
    }
  }

  for (const [target, uses] of targetUses) {
    if (uses < 2) throw new Error(`Teaching target ${target} only appears ${uses} time(s)`)
  }
}

validateScene(SCENE)
