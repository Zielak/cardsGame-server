import { Command, BaseCard, GameState, Container } from '../../cardsGame'
import isPlayersTurn from '../../cardsGame/conditions/isPlayersTurn'


export default class PlayCardCommand extends Command {

  context: {
    card: BaseCard
    target: Container
  }

  constructor(invoker, context) {
    super(invoker, [isPlayersTurn])
  }

  // TODO: finish and test me
  execute(invoker: string, state: GameState) {
    return new Promise(resolve => {
      this.context.card.moveTo(this.context.target)
      resolve()
    })
  }

  undo(state: GameState) {

  }

}
