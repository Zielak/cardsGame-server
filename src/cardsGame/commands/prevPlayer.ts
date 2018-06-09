import { Command } from '../command'

export default class PreviousPlayer extends Command {

  execute(invoker, state, reducer) {
    reducer.players.prev(state)
  }

  undo(state, reducer) {
    reducer.players.next(state)
  }

}
