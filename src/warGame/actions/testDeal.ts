const {
  Command,
  Deck,
} = require('../../cardsGame/index')

const command = class TestDealCommand extends Command {

  execute(invoker, state/*, reducer*/) {
    return new Promise((resolve, reject) => {
      const contsCards = state.containers.filter(container => {
        return container.children.length > 0 && container.type === 'deck'
      })
      console.log(`found ${contsCards.length} potential FROM candidates`)
      let idx = Math.floor(Math.random() * (contsCards.length - 1))
      /** @type {Deck} */
      const cont = contsCards[idx]
      // console.log(`  choosing ${idx}: ${JSON.stringify(cont)}`)

      idx = Math.floor(Math.random() * (state.containers.length - 1))
      const targetCont = state.containers[idx]

      if (cont) {
        cont.deal(targetCont, Math.floor(Math.random() * 3))
        cont.on(Deck.events.DEALT, () => resolve())
      } else {
        reject(`couldn't find cont :(`)
      }
    })
  }

}

module.exports = { command }
