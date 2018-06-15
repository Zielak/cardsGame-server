
import { Player } from './player'

export interface IContext {
  invoker?: Player
}

export class Command {

  prepare() { }

  public execute(invoker, state, reducer) { }

  public undo(state, reducer) { }

}

