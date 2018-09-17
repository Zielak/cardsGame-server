
const sourceCards = [
  { id: 1, type: 'card', name: 'jedynka' },
  { id: 2, type: 'card', name: 'dwójka' },
  { id: 3, type: 'card', name: 'trójka' },
  { id: 4, type: 'card', name: 'czwórka' }
]
const sourceContainers = [
  { id: 10, type: 'deck', name: 'mainDeck' },
  { id: 11, type: 'pile', name: 'discardPile' }
]

const clicked = function () {

  this.execute = () => memory.reduce((prevResult, currFunc) => {
    const result = currFunc(prevResult)
    return result
  })

  return this.execute()
}

const memory = []
const remember = (func) => memory.push(func)

const getCards = () => sourceCards
const getContainers = () => sourceContainers

const byID = val => data => data.filter(el => el.id === val)
const byType = val => data => data.filter(el => el.type === val)
const byName = val => data => data.filter(el => el.name === val)

Object.defineProperties(clicked, {
  card: {
    get: () => {
      remember(getCards)
      return clicked
    }
  },
  container: {
    get: () => {
      remember(getContainers)
      return clicked
    }
  },
  id: {
    get: () => {
      return (value) => {
        remember(byID(value))
        return clicked
      }
    }
  },
  type: {
    get: () => {
      return (value) => {
        remember(byType(value))
        return clicked
      }
    }
  },
  name: {
    get: () => {
      return (value) => {
        remember(byName(value))
        return clicked
      }
    }
  }
})
