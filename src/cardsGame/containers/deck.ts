import { Container, IContainerOptions } from '../container'
import { BaseCard } from '../baseCard'

/**
 * Neatly stacked cards on top of eachother. Only the top card is visible.
 * Deck respects card's `faceUp` state,
 * and will show the face or back of visible card
 */
export class Deck extends Container {

  constructor(options: IContainerOptions) {
    super({
      ...options,
      type: options.type || 'deck'
    })
  }

  /**
   * Deals `count` cards from this container to other containers.
   * Eg. hands
   *
   * @param {array|Container} containers
   * @param {[number]} count how many cards should I deal for each player?
   * @returns {Deck} this for chaining
   */
  deal(containers, count = Infinity) {
    let i = 0
    containers = Array.isArray(containers) ? containers : [containers]
    containers = containers.map(Container.toObject)
    const maxDeals = count * containers.length

    const dealOne = () => {
      const card: BaseCard = this.top()
      if (!card) {
        this.onCardsDealt()
        return
      }
      card.moveTo(containers[i % containers.length])
      i++
      if (this.children.length > 0 && i < maxDeals) {
        setTimeout(dealOne, 50)
      } else {
        this.onCardsDealt()
      }
    }
    dealOne()

    return this
  }

  onCardsDealt() {
    this.emit(Deck.events.DEALT)
    console.log('Deck: Done dealing cards.')
  }

  static events = {
    ...Container.events,
    DEALT: 'dealt'
  }

}
