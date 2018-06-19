import { Command } from '../command'
import { Container } from '../container'
import { BaseCard } from '../baseCard'
import { GameState } from '../state'

export default class MoveCardToContainer extends Command {

  /**
  * @typedef MoveCardToContainerContext
  * @property {BaseCard} card - which card to move
  * @property {Container} container - container
  * @property {boolean} [prepend=false] - should card be moved to the bottom ?
  */
  /** @type {MoveCardToContainerContext} */
  context: {
    card: BaseCard
    container: Container
    prepend: boolean
  }

  execute(invoker, state: GameState) {
    return new Promise(resolve => {
      // const card: BaseCard = getElementById(state.cards, this.context.card.id)
      // this.context.container.addChild(card)
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {

      resolve()
    })
  }

}
