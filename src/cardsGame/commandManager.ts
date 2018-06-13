import { Command } from './command'

export default class CommandManager {

  commands: Array<Command>
  lastCommand: Command | null

  constructor() {
    this.commands = []
    this.lastCommand = null
  }

  /**
   *
   * @param {Command} command
   * @param {*} invoker
   * @param {*} state
   */
  execute(command, context, invoker, state) {
    const newCommand = new command(context)
    this.commands.push(newCommand)
    this.lastCommand = newCommand
    newCommand.prepare()
    return newCommand.execute(invoker, state)
  }

  get canUndo() {
    return this.lastCommand !== null
  }

}
