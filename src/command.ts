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

  constructor(public context: any = {}, public conditions: Condition[] = []) {
    this.prepareContext()
  }

  /**
   * To be overriden. Fix-up your context here.
   * @protected
   */
  protected prepareContext() { }

  abstract execute(invoker: string, state: GameState): IExecutable
  abstract undo(state: GameState): IExecutable

}

