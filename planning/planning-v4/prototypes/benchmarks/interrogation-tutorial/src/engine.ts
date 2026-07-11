import type { Answer, Condition, Effect, Question, TutorialData } from './types'

export type InterviewState = {
  empathy: number
  fear: number
  health: number
  flags: Set<string>
  usedAnswers: Set<number>
}

const statValue = (state: InterviewState, stat: number) =>
  stat === 0 ? state.empathy : stat === 1 ? state.fear : state.health

export function passes(condition: Condition, state: InterviewState): boolean {
  if (condition.type === 6) return state.flags.has(condition.value as string)
  if (condition.type === 7) return !state.flags.has(condition.value as string)
  if (condition.type === 8)
    return (condition.value as Condition[]).some((item) => passes(item, state))
  if (condition.type === 11)
    return (condition.value as Condition[]).every((item) => passes(item, state))

  const value = condition.value as { stat: number; operand?: number }
  if (condition.type === 32) return statValue(state, value.stat) >= (value.operand ?? 0)
  if (condition.type === 33) return statValue(state, value.stat) <= (value.operand ?? 0)
  return true
}

export const passesAll = (conditions: Condition[], state: InterviewState) =>
  conditions.every((condition) => passes(condition, state))

export function resolveAnswer(
  question: Question,
  answers: Answer[],
  state: InterviewState,
): Answer | undefined {
  return question.answers
    .map((answerId) => answers.find((answer) => answer.id === answerId))
    .find((answer): answer is Answer => Boolean(answer && passesAll(answer.conditions, state)))
}

export function applyEffects(
  state: InterviewState,
  effects: Effect[],
  feedback: Record<string, string>,
) {
  let next = { ...state, flags: new Set(state.flags), usedAnswers: new Set(state.usedAnswers) }
  let feedbackText = ''

  for (const effect of effects) {
    if (effect.type === 3) next.flags.add(effect.value as string)
    if (effect.type === 8) next.flags.delete(effect.value as string)
    if (effect.type === 17) {
      const value = effect.value as { stat: number; amount: number }
      if (value.stat === 0) next.empathy += value.amount
      if (value.stat === 1) next.fear += value.amount
      if (value.stat === 2) next.health += value.amount
    }
    if (effect.type === 13) {
      const value = effect.value as { event: string; args: string[] }
      if (value.event === 'tutorial_feedback') {
        feedbackText = feedback[`tutorial.${value.args[0]}`] ?? value.args[0]
      }
    }
  }

  return { state: next, feedbackText }
}

export function askQuestion(
  data: TutorialData,
  question: Question,
  state: InterviewState,
) {
  const answer = resolveAnswer(question, data.episode.answers, state)
  if (!answer) return { state, answer: undefined, feedbackText: '' }

  const firstUseEffects = state.usedAnswers.has(answer.id) ? [] : answer.effects
  const result = applyEffects(
    state,
    [...question.repeating_effects, ...firstUseEffects, ...answer.repeating_effects],
    data.feedback,
  )
  result.state.usedAnswers.add(answer.id)
  return { ...result, answer }
}

export const cleanGameText = (text: string) =>
  text
    .replace(/<img=[^>]+\/>/g, '')
    .replace(/<\/?(?:nobr|b|i)>/g, '')
    .replace(/<\/?color(?:=[^>]+)?>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
