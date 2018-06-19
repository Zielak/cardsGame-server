import { Command } from '../command'
import { Deck } from '../containers/deck'
import { Player } from '../player'
import { GameState } from '../state';

export default class DrawUpToX extends Command {

  context: {
    maxCards: number
  }

  execute(invoker, state:GameState) {
    return new Promise((resolve) => {
      const player = Player.get(
        state.players.list.find(player => player.clientId === invoker).id
      )

      const myDeck = player.getByType('deck')
      const myHand = player.getByType('hand')

      const cardsToTake = this.context.maxCards - myHand.length

      myDeck.deal(myHand, cardsToTake)
        .on(Deck.events.DEALT, () => setTimeout(resolve, 250))

    })
  }

  undo(state:GameState) {
    return new Promise(resolve => {

      resolve()
    })
  }

}
