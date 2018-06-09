import Command from './command'

class NextPlayerCommand extends Command {

  execute(invoker, state, reducer) {
    reducer.players.next(state)
  }

  undo(state, reducer){
    reducer.players.prev(state)
  }

}

module.exports = NextPlayerCommand
