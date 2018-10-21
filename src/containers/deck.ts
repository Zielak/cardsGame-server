import { Container } from '../container'
import { BaseCard } from '../baseCard'
import { IBaseOptions } from '../base'
import { IExecutable } from '../command'

/**
 * Neatly stacked cards on top of eachother. Only the top card is visible.
 * Deck respects card's `faceUp` state,
 * and will show the face or back of visible card
 */
export class Deck extends Container {

  constructor(options: IBaseOptions) {
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
  deal(containers: Container | Container[], count: number = Infinity): IExecutable {
    return new Promise((resolve, reject) => {
      let i = 0
      const conts = Array.isArray(containers) ? containers : [containers]
      const targetContainers = conts.map(Container.toObject)
      const maxDeals = count * targetContainers.length
      // TODO: Would be nice if rejected dealing got continued. function* ()?
      const dealOne = () => {
        const card = this.top as BaseCard
        if (!card) {
          reject({
            msg: `I'm out of cards`,
            data: {
              dealt: i,
              remain: maxDeals - i
            }
          })
          return
        }
        card.moveTo(targetContainers[i % targetContainers.length])
        i++
        if (this.children.length > 0 && i < maxDeals) {
          setTimeout(dealOne, 50)
        } else {
          resolve(`Deck: Done dealing cards.`)
        }
      }
      dealOne()
    })
  }

  static events = {
    ...Container.events,
    DEALT: 'dealt'
  }

}
