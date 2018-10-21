import { Condition, ClassicCard, Pile } from '../../..'

const matchesSuit: Condition = (invoker, state, event) => new Promise((resolve, reject) => {
  const chosenCard = event.target as ClassicCard
  const pileTop = (state.containers.getByName('pile') as Pile).top as ClassicCard

  if (chosenCard.suit === pileTop.suit) {
    resolve()
  } else {
    reject(`pile.top "${pileTop.suit}" !== cards suit "${chosenCard.suit}"`)
  }
})

export default matchesSuit
