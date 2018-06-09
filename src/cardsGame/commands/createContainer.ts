// TODO: whats that even?

import Command from './command'
const containerClasses = {
  'container': require('../container'),
  'deck': require('../containers/deck'),
  'hand': require('../containers/hand'),
  'pile': require('../containers/pile'),
  'row': require('../containers/row'),
  'spread': require('../containers/spread'),
}

class CreateContainer extends Command {

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
  constructor(invoker, conditions, context) {
    super(context)
  }

  execute() {
    this.context.newContainer = new containerClasses[this._type](this._options)
    this.context.state.containers.push(this._newContainer)
  }

  undo() {
    if (!this.context.newContainer) {
      return false
    }
    // TODO: undo plz
  }
}

module.exports = CreateContainer
