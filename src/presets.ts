import { ClassicCard } from './classicCard'

export const classicCards = () => {
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const suits = ['H', 'S', 'C', 'D']

  const cards: ClassicCard[] = suits.reduce((prevS, suit) => [
    ...prevS,
    ...ranks.reduce((prevR, rank) => [
      ...prevR,
      new ClassicCard({ suit, rank })
    ], [])
  ], [])

  console.log(`  = CardAPI, presets: created a deck of ${cards.length} cards`)

  return cards
}
