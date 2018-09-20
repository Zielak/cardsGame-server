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

  faceUp = false
  rotated = 0
  marked = false

  constructor(options: IBaseCardOptions) {
    super(options)
    this.name = options.name || 'card'
    this.type = options.type || 'card'

    // set of conditions used during gameplay
    // this.conditions = new Conditions(options.conditions)
  }

  show() {
    this.faceUp = true
  }
  hide() {
    this.faceUp = false
  }
  flip() {
    this.faceUp = !this.faceUp
  }

  canBeTakenBy() { }

}
