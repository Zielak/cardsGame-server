import Command from './command'

class NextPlayerCommand extends Command {

  execute(invoker, state, reducer) {
    reducer.players.prev(state)
  }

  undo(state, reducer){
    reducer.players.next(state)
  }

}

module.exports = NextPlayerCommand
