import { Command, Deck, GameState, Container } from '../../../src/cardsGame/index'

export default class TestDealCommand extends Command {

  execute(invoker, state: GameState) {
    return new Promise((resolve, reject) => {
      const contsCards = state.containers.filter(container => {
        return container.children.length > 0 && container.type === 'deck'
      }) as Container[]
      console.log(`found ${contsCards.length} potential FROM candidates`)
      let idx = Math.floor(Math.random() * (contsCards.length - 1))

      const cont = contsCards[idx] as Deck
      // console.log(`  choosing ${idx}: ${JSON.stringify(cont)}`)

      idx = Math.floor(Math.random() * (state.containers.size - 1))
      const targetCont = state.containers[idx]

      if (cont) {
        cont.deal(targetCont, Math.floor(Math.random() * 3))
        cont.on(Deck.events.DEALT, () => resolve())
      } else {
        reject(`couldn't find cont :(`)
      }
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {

      resolve()
    })
  }

}
