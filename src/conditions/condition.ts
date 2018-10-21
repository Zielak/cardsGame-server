import { GameState } from '../gameState'
import { PlayerEvent } from '../events/playerEvent'

export interface Condition {
  (invoker: string, state: GameState, event: PlayerEvent): Promise<any>
}

export const OR = (...conditions: Condition[]) => {
  return (invoker: string, state: GameState, event: PlayerEvent) => {
    return new Promise((resolve, reject) => {
      // This is mess
      const count = conditions.length
      let executed = 0
      let done = false

      conditions.map(cond =>
        cond(invoker, state, event)
          .then(() => {
            if (!done) {
              executed++
              done = true
              resolve()
            }
          })
          .catch(() => {
            executed++
            if (executed === count) {
              reject()
            }
          })
      )
    })
  }
}

