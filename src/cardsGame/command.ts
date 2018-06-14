
import { Player } from './player'

export interface IContext {
  initiator?: Player
}

export class Command {

  constructor(public context: IContext) {
  }

  prepare() { }

  public execute(invoker, state, reducer) { }

  public undo(state, reducer) { }

}

