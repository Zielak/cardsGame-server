import { Container, IContainerOptions } from '../container'
import { float } from '../utils'

const cardsDataFactory = (card, limits): CardsData => {
  return {
    id: card.id,
    rotation: float(limits.minAngle, limits.maxAngle),
    offset: {
      x: float(limits.minX, limits.maxX),
      y: float(limits.minY, limits.maxY),
    }
  }
}

interface CardsData {
  id: number
  rotation: number
  offset: object
}

interface PileVisualLimits {
  minAngle: number
  maxAngle: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface IPileOptions extends IContainerOptions {
  limits?: PileVisualLimits
}

/**
 * Cards in Pile have tendency to fall at random angle and not exactly in
 * the center of the container.
 * Should hold info of each card's position
 * and rotation when it lands in container
 */

export class Pile extends Container {

  limits: PileVisualLimits
  cardsData: Array<CardsData>

  constructor(options: IPileOptions) {
    super(options)

    this.type = options.type || 'pile'

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

  addChild(element) {
    this.cardsData.push(cardsDataFactory(element, this.limits))
    return super.addChild(element)
  }

  removeChild(element) {
    const idx = this.children.indexOf(element)
    this.cardsData.splice(idx, 1)
    return super.removeChild(element)
  }

  // TODO: Store data about each card's rotation

}
