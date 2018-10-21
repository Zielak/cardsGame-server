import { Command } from '../command'
import { Deck } from '../containers/deck'
import { Player } from '../player'
import { GameState } from '../gameState'
import { Hand } from '../containers/hand'

export default class DrawUpToX extends Command {

  context: {
    maxCards: number
  }

  execute(invoker, state: GameState) {
    return new Promise((resolve) => {
      const player = Player.get(
        state.players.find(
          player => player.clientId === invoker
        ).id
      )

      const myDeck = <Deck>player.getByType('deck')
      const myHand = <Hand>player.getByType('hand')

      const cardsToTake = this.context.maxCards - myHand.length

      myDeck.deal(myHand, cardsToTake)
        .then(() => setTimeout(resolve, 250))

    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {

      resolve()
    })
  }

}
