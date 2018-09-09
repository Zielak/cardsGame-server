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
   * @param {Container | Container[]} containers
   * @param {[number]} count how many cards should I deal for each player?
   */
  deal(containers: Container | Container[], count: number = Infinity): Deck {
    let i = 0
    containers = Array.isArray(containers) ? containers : [containers]
    const targetContainers = containers.map(Container.toObject)
    const maxDeals = count * targetContainers.length

    const dealOne = () => {
      const card = this.top() as BaseCard
      if (!card) {
        this.onCardsDealt()
        return
      }
      card.moveTo(targetContainers[i % targetContainers.length])
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

  private onCardsDealt() {
    this.emit(Deck.events.DEALT)
    console.log('Deck: Done dealing cards.')
  }

  static events = {
    ...Container.events,
    DEALT: 'dealt'
  }

}
