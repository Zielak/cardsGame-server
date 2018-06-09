import Command from './commands/command'

export default class CommandManager {

  commands: Array<Command>
  lastCommand: Command|null

  constructor() {
    this.commands = []
    this.lastCommand = null
  }

  /**
   * 
   * @param {Command} command 
   * @param {*} invoker 
   * @param {*} state 
   * @param {*} reducer 
   */
  execute(command, context, invoker, state, reducer) {
    const newCommand = new command(context)
    this.commands.push(newCommand)
    this.lastCommand = newCommand
    newCommand.prepare()
    return newCommand.execute(invoker, state, reducer)
  }

  get canUndo() {
    return this.lastCommand !== null
  }

}