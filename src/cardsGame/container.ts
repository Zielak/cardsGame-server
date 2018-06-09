import Conditions from './conditions'
import { Base, IBaseOptions } from './base'

export interface IContainerOptions extends IBaseOptions {
  conditions: Conditions
}

export class Container extends Base {

  conditions: Conditions

  constructor(options: IContainerOptions) {
    super(options)

    // set of conditions used during gameplay
    this.conditions = new Conditions(options.conditions, this)
  }

  get length() {
    return this.children.length
  }

  /**
   * Shuffle all elements, Fisher yates shuffle
   * 
   * @return {Container} this for chaining
   */
  shuffle() {
    let i = this.children.length
    if (i === 0) return
    while (--i) {
      const j = Math.floor(Math.random() * (i + 1))
      const tempi = this.children[i]
      const tempj = this.children[j]
      this.children[i] = tempj
      this.children[j] = tempi
    }
    this.emit(Container.events.SHUFFLED)
    return this
  }

  static events = {
    ...Base.events,
    SHUFFLED: 'shuffled'
  }

}