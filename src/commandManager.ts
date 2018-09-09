import { Command, ICommand } from './command'
import { GameState } from './state';

export default class CommandManager {

  commands: Array<Command>
  lastCommand: Command | null

  constructor() {
    this.commands = []
    this.lastCommand = null
  }

  execute(command: Command, invoker, context: any, state: GameState): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isExecutable(command, invoker, context, state).then(() => {
        this.commands.push(command)
        this.lastCommand = command
        command.execute(invoker, state).then(resolve).catch(reject)
      }).catch(reject)
    })
  }

  private isExecutable(command: Command, invoker, context: any, state: GameState): Promise<any> {
    const promises = command.conditions.map(condition => {
      return condition(invoker, state, context)
    })
    return Promise.all(promises)
  }

  get canUndo() {
    return this.lastCommand !== null
  }

}
