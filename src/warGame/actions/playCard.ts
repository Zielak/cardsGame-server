const {
  isPlayersTurn,
} = require('../../cardsGame').Conditions
const {
  Command,
} = require('../../cardsGame/index')

const context = {
  eventType: 'click',
  reporter: {
    type: 'hand'
  },
  element: {
    type: 'card'
  }
}

const condition = (state, client) => new Promise((resolve, reject) => {
  if (!isPlayersTurn(state, client.id)) {
    reject(`It's not your turn.`)
    return
  }
  resolve()
})

/**
 * Context: 
 * 
 * @class PlayCardCommand
 * @extends {Command}
 */
class PlayCardCommand extends Command {

  // TODO: finish and test me
  execute(/*invoker, state/*, reducer*/) {
    return new Promise((resolve) => {
      this.context.element.moveTo(this.context.target)
      resolve()
    })
  }

}

module.exports = { context, condition, command: PlayCardCommand }
