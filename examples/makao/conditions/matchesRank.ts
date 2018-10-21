import { Condition, ClassicCard, Pile } from '../../..'

const matchesRank: Condition = (invoker, state, event) => new Promise((resolve, reject) => {
  const chosenCard = event.target as ClassicCard
  const pileTop = (state.containers.getByName('pile') as Pile).top as ClassicCard

  if (chosenCard.rank === pileTop.rank) {
    resolve()
  } else {
    reject(`pile.top "${pileTop.rank}" !== cards rank "${chosenCard.rank}"`)
  }
})

export default matchesRank
