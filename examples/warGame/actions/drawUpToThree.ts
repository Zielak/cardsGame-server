import { Conditions } from '../../../src/cardsGame'
import { DefaultCommands } from '../../../src/cardsGame'
import isPlayersTurn from '../../../src/cardsGame/conditions/isPlayersTurn'
import isClientPlaying from '../../../src/cardsGame/conditions/isClientPlaying'

export default class DrawUpToThree extends DefaultCommands.DrawUpToXCommand {

  constructor() {
    super({ maxCards: 3 }, [isPlayersTurn, isClientPlaying])
  }

}
