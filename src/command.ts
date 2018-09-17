import Condition from './conditions/condition'
import { GameState } from './gameState'

export abstract class Command implements ICommand {

  context = {}
  conditions: Condition[]
  interactionTarget: InteractionTarget

  constructor(options: ICommandOptions) {
    this.conditions = options.conditions
    this.interactionTarget = options.interactionTarget
    this.prepareContext()
  }

  /**
   * To be overriden. Fix-up your context here.
   * @protected
   */
  protected prepareContext() { }

  abstract execute(invoker: string, state: GameState, data: any): IExecutable
  abstract undo(state: GameState): IExecutable

}

export type IExecutable = Promise<string | {}>

export type InteractionTarget = {
  type?: string,
  name?: string,
  value?: string
}

export interface ICommand {
  context?: { [key: string]: any }
  // conditions?: Condition[]
}

export interface ICommandOptions {
  conditions: Condition[]
  interactionTarget: InteractionTarget
}

export interface IComandConstructor {
  new(options: ICommandOptions): Command
}
