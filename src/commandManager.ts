import { Command, ICommand } from './command'
import { GameState } from './gameState'

export class CommandManager {

  commands: Array<Command>
  lastCommand: Command | null

  constructor() {
    this.commands = []
    this.lastCommand = null
  }

  execute(command: Command, invoker: string, state: GameState, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isExecutable(command, invoker, data, state).then(() => {
        this.commands.push(command)
        this.lastCommand = command
        command.execute(invoker, state, data).then(resolve).catch(reject)
      }).catch(reject)
    })
  }

  private isExecutable(command: Command, invoker, data: any, state: GameState): Promise<any> {
    const promises = command.conditions.map(condition => {
      return condition(invoker, state, data)
    })
    return Promise.all(promises)
  }

  get canUndo() {
    return this.lastCommand !== null
  }

}
