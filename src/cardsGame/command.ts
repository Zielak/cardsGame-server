import Condition from './conditions/condition'
import { GameState } from './state'

export interface IContext { }

export class Command {

  conditions: Condition[]

  constructor(invoker: string, conditions: Condition[]) {
    this.conditions = conditions
  }

  prepare() { }

  public execute(invoker: string, state: GameState/*, reducer*/) { }

  public undo(state: GameState/*, reducer*/) { }

}

