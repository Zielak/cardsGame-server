import { Command } from '../command'
import { Deck } from '../containers/deck'
import { Player } from '../player'

export default class DrawUpToX extends Command {

  execute(invoker, state, reducer) {
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

}
