// TODO: whats that even?

import { Command } from '../command'
import { Container } from '../container'
import { GameState } from '../state'
import Condition from '../conditions/condition';
const containerClasses = {
  'container': require('../container'),
  'deck': require('../containers/deck'),
  'hand': require('../containers/hand'),
  'pile': require('../containers/pile'),
  'row': require('../containers/row'),
  'spread': require('../containers/spread'),
}

export default class CreateContainer extends Command {

  /**
  * @typedef {object} CreateContainerContext
  * @property {Container} [newContainer] container already creater (OR type&options)
  * @property {string} [type] kind of container to create (lowercase name)
  * @property {object} [options] for containers constructor
  */
  /** @type {CreateContainerContext} */
  context: {
    newContainer?: Container
    type?: string
    options?: string
  }

  execute(invoker: string, state: GameState) {
    return new Promise(resolve => {
      if (!this.context.newContainer) {
        this.context.newContainer = new containerClasses[this.context.type](this.context.options)
      }
      state.containers.add(this.context.newContainer)
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {
      if (!this.context.newContainer) {
        return
      }
      // TODO: undo plz
      state.containers.remove(this.context.newContainer)
      resolve()
    })
  }
}
