import Condition from './conditions/condition'
import { GameState } from './gameState'

type IExecutable = Promise<string | {}>

export interface ICommand {
  context?: {}
  conditions?: Condition[]
}

export interface IComandConstructor {
  new(context: any, conditions: Condition[]): Command
}

export abstract class Command implements ICommand {

  context = {}

  constructor(public conditions: Condition[] = []) {
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

