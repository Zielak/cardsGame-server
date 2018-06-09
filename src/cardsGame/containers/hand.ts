import { Container, IContainerOptions } from '../container'

/**
 * TODO: Should ensure that none of the cards in hand
 * are visible to other players
 */

export class Hand extends Container {

  constructor(options: IContainerOptions) {
    super({
      ...options,
      type: options.type || 'hand',
    })
  }

  addChild(element) {
    super.addChild(element)
    // console.log('Let me show that card!', element.type)
    if (element.type === 'card') {
      element.show && element.show()
    }
    return this
  }

  removeChild(element) {
    super.removeChild(element)

    if (element.type === 'card') {
      element.show && element.hide()
    }
    return this
  }

}

module.exports = Hand
