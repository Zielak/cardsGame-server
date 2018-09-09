import { GameState } from '../state'

export default interface Condition {
  (invoker: string, state: GameState, context: object): Promise<any>
}
