import { Base, IBaseOptions } from './base'

export class Container extends Base {

  constructor(options: IBaseOptions = {}) {
    super(options)
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
