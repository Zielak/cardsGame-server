import { GameState } from '../gameState'

export interface Condition {
  (invoker: string, state: GameState, context: object): Promise<any>
}
