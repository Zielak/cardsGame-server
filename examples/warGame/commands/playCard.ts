import { BaseCard, Command, Conditions, Container, GameState } from '../../../'

export default class PlayCardCommand extends Command {

  context: {
    card: BaseCard
    target: Container
  }

  constructor() {
    super({ card: null, target: null }, [Conditions.isPlayersTurn])
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
