import { Command } from '../command'
import { Container } from '../container'
import { Player } from '../player'
import { Deck } from '../containers/deck'

export class DrawXCards extends Command {

  context: {
    sourceContainer: Container
    targetContainer: Container
    count: number
    method?: (count: number) => number
  }

  execute(invoker, state) {
    return new Promise((resolve) => {
      const player = Player.get(
        state.players.list.find(player => player.clientId === invoker).id
      )

      const myDeck = player.getByType('deck')
      const myHand = player.getByType('hand')

      const cardsToTake = this.context.count - myHand.length

      myDeck.deal(myHand, cardsToTake)
        .on(Deck.events.DEALT, () => setTimeout(resolve, 250))

    })
  }

  undo() {

  }

}
