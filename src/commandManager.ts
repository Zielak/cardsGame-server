import { Command, ICommand } from './command'
import { GameState } from './gameState'
import { PlayerEvent } from './events/playerEvent';

export class CommandManager {

  commands: Array<Command>
  lastCommand: Command | null

  constructor() {
    this.commands = []
    this.lastCommand = null
  }

  execute(command: Command, invoker: string, state: GameState, event: PlayerEvent): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!command) {
        reject(`didn't gave me a Command`)
      }
      this.isExecutable(command, invoker, event, state).then(() => {
        this.commands.push(command)
        this.lastCommand = command
        command.execute(invoker, state, event).then(resolve).catch(reject)
      }).catch(reject)
    })
  }

  private isExecutable(command: Command, invoker, event: PlayerEvent, state: GameState): Promise<any> {
    const promises = command.conditions.map(condition => {
      return condition(invoker, state, event)
    })
    return Promise.all(promises)
  }

  get canUndo() {
    return this.lastCommand !== null
  }

}
