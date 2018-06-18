import Condition from './conditions/condition'
import { GameState } from './state'

type IExecutable = Promise<string | {}> | void

export abstract class Command {

  conditions: Condition[]

  constructor(invoker: string, conditions?: Condition[], public context: any = {}) {
    this.conditions = conditions
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

