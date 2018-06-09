import Command from './command'
// import Container from '../container'
import utils from '../../../shared/utils'

class MoveCardToContainerCommand extends Command {

  /**
   * Creates an instance of MoveCardToContainerCommand.
   * @param {object} invoker who tries to invoke this action
   * @param {array} conditions list of conditions to check before executing
   * @param {MoveCardToContainerContext} context
   * 
   * @typedef {object} MoveCardToContainerContext
   * @property {object} card - which card to move
   * @property {Container} container - container
   * @property {boolean} [prepend=false] - should card be moved to the bottom?
   * 
   * @memberof MoveCardToContainerCommand
   */
  constructor(context) {
    super(context)
    /** @type {MoveCardToContainerContext} */
    this.context = context
  }

  execute(invoker, state/*, reducer*/) {
    const card = utils.getElementById(state.cards, this.context.card.id)
    this.context.container.addChild(card)
  }

}

module.exports = MoveCardToContainerCommand
