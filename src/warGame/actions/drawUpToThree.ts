import { Conditions } from '../../cardsGame'
import { DefaultCommands } from '../../cardsGame'
import isPlayersTurn from '../../cardsGame/conditions/isPlayersTurn'
import isClientPlaying from '../../cardsGame/conditions/isClientPlaying'

export default class DrawUpToThree extends DefaultCommands.DrawUpToXCommand {

  constructor() {
    super({ maxCards: 3 }, [isPlayersTurn, isClientPlaying])
  }

}
