import Container from '../container'
import utils from '../../../shared/utils'

const cardsDataFactory = (card, limits) => {
  return {
    id: card.id,
    rotation: utils.float(limits.minAngle, limits.maxAngle),
    offset: {
      x: utils.float(limits.minX, limits.maxX),
      y: utils.float(limits.minY, limits.maxY),
    }
  }
}

/**
 * Cards in Pile have tendency to fall at random angle and not exactly in
 * the center of the container.
 * Should hold info of each card's position
 * and rotation when it lands in container
 */

class Pile extends Container {

  constructor(options = {}) {
    super({
      ...options,
      type: options.type || 'pile',
    })

    this.limits = Object.assign({}, {
      minAngle: -20,
      maxAngle: 20,
      minX: -10,
      minY: -10,
      maxX: 10,
      maxY: 10,
    }, options.limits)

    this.cardsData = []
  }

  // FIXME: listen for self addChild events?
  push(element) {
    this.cardsData.push(cardsDataFactory(element, this.limits))
    return super.push(element)
  }

  // FIXME: listen for self removeChild events? plz
  remove(element) {
    const idx = this.elements.indexOf(element)
    return this.elements.splice(idx, 1)
  }

  // TODO: Store data about each card's rotation

}

module.exports = Pile
