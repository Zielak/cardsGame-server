// TODO: whats that even?

import { Command, IContext } from '../command'
const containerClasses = {
  'container': require('../container'),
  'deck': require('../containers/deck'),
  'hand': require('../containers/hand'),
  'pile': require('../containers/pile'),
  'row': require('../containers/row'),
  'spread': require('../containers/spread'),
}

interface ICreateContainerContext extends IContext {

}

export default class CreateContainer extends Command {

  /**
   * Creates an instance of CreateContainer.
   * @param {array} conditions list of conditions to check before executing
   * @param {CreateContainerContext} context
   *
   * @typedef {object} CreateContainerContext
   * @property {string} type kind of container to create (lowercase name)
   * @property {object} options for containers constructor
   *
   * @memberof CreateContainer
   */
  constructor(conditions, context) {
    super(context)
  }

  execute() {
    this.context.newContainer = new containerClasses[this.context.type](this.context.options)
    this.context.state.containers.push(this.context.newContainer)
  }

  undo() {
    if (!this.context.newContainer) {
      return false
    }
    // TODO: undo plz
  }
}
