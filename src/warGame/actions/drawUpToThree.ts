import { Conditions } from '../../cardsGame'
import { DefaultCommands } from '../../cardsGame'
import isPlayersTurn from '../../cardsGame/conditions/isPlayersTurn'
import isClientPlaying from '../../cardsGame/conditions/isClientPlaying'

export default class DrawUpToThree extends DefaultCommands.DrawUpToXCommand {

  constructor(invoker) {
    super(invoker, [isPlayersTurn, isClientPlaying])
  }

  prepareContext() {
    this.context.maxCards = 3
  }
}
