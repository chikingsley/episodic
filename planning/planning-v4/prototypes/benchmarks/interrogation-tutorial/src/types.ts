export type LocalizedText = { key: string; text: string }

export type Condition = {
  type: number
  value:
    | string
    | Condition[]
    | {
        stat: number
        operand?: number
      }
}

export type Effect = {
  type: number
  value:
    | string
    | {
        stat: number
        amount: number
      }
    | {
        event: string
        args: string[]
      }
}

export type Answer = {
  id: number
  text: LocalizedText
  reaction?: LocalizedText
  animation?: string
  conditions: Condition[]
  effects: Effect[]
  repeating_effects: Effect[]
}

export type Question = {
  id: number
  text: LocalizedText
  answers: number[]
  visibility_conditions: Condition[]
  effects: Effect[]
  repeating_effects: Effect[]
}

export type Subject = {
  name: string
  avatar: string
  initial_fear: number
  initial_empathy: number
  initial_health: number
  questions: Record<string, number[]>
  torture_reactions: Array<{ animation: string; reaction: LocalizedText }>
}

export type ScriptStep = {
  id: string
  lines: string[]
  gate: string
  page?: string
}

export type TutorialData = {
  benchmark: string
  slides: string[]
  script: ScriptStep[]
  tutor_lines: Record<string, string>
  feedback: Record<string, string>
  episode: {
    subjects: Subject[]
    questions: Question[]
    answers: Answer[]
  }
  torture_effects: Record<
    string,
    {
      id: number
      damage: number
      fear: number
      empathy: number
      health: number
    }
  >
}

export type AtlasManifest = {
  animations: Record<
    string,
    {
      fps: number
      playback: number
      frames: string[]
    }
  >
}
