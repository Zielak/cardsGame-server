import { Command, BaseCard, GameState, Container } from '../../../src/cardsGame'
import isPlayersTurn from '../../../src/cardsGame/conditions/isPlayersTurn'

export default class PlayCardCommand extends Command {

  context: {
    card: BaseCard
    target: Container
  }

  constructor() {
    super({ card: null, target: null }, [isPlayersTurn])
  }

  // TODO: finish and test me
  execute(invoker: string, state: GameState) {
    return new Promise(resolve => {
      this.context.card.moveTo(this.context.target)
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {

      resolve()
    })
  }

}
