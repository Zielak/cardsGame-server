import { Base, IBaseOptions } from './base'
// import Conditions from './conditions'

export interface IBaseCardOptions extends IBaseOptions {
  state?: CardState
}

export interface CardState {
  faceUp: boolean
  rotated: number
  marked: boolean
}

export class BaseCard extends Base {

  state: CardState = {
    faceUp: false,
    rotated: 0,
    marked: false
  }

  constructor(options: IBaseCardOptions) {
    super(options)
    this.name = options.name || 'card'
    this.type = options.type || 'card'

    // set of conditions used during gameplay
    // this.conditions = new Conditions(options.conditions)

    // All the states at which a single card can be.
    // faceUp: boolean, rotated: number/angle, marked: boolean
    this.state = {...this.state, ...options.state}
  }

  show() {
    this.state.faceUp = true
  }
  hide() {
    this.state.faceUp = false
  }
  flip() {
    this.state.faceUp = !this.state.faceUp
  }

  canBeTakenBy() { }

}
