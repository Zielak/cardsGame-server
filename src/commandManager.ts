import { Command, IExecutable } from './command'
import { GameState } from './gameState'
import { PlayerEvent } from './events/playerEvent'
import { ActionTemplate } from './gameRoom'

export class CommandManager {

  commandsHistory: Array<Command>
  lastCommand: Command | null

  constructor() {
    this.commandsHistory = []
    this.lastCommand = null
  }

  execute(action: ActionTemplate, invoker: string, state: GameState, event: PlayerEvent) {
    return new Promise((resolve, reject) => {
      this.isLegal(action, invoker, state, event).then(() => {
        if (this.lastCommand && this.lastCommand.pending) {
          console.info(`last command is pending, redirecting that event there.`)
          this.lastCommand.execute(invoker, state, event)
        } else {
          const newCommand = new action.command()
          this.commandsHistory.push(newCommand)
          this.lastCommand = newCommand
          newCommand.executeFirstTime(invoker, state, event)
            .then(resolve)
            .catch(reject)
        }
      })
    })
  }


  /**
   * Checks all attatched conditions (if any) to see if this action is legal
   */
  private isLegal(action: ActionTemplate, invoker, state: GameState, event: PlayerEvent): Promise<any> {
    if (!action.conditions) {
      // Condition-leess action, just go
      return Promise.resolve()
    }

    const promises = action.conditions.map(condition => {
      return condition(invoker, state, event)
    })
    return Promise.all(promises)
  }

  get canUndo() {
    return this.lastCommand !== null
  }

}
