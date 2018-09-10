import { GameState } from '../gameState'

export default interface Condition {
  (invoker: string, state: GameState, context: object): Promise<any>
}
