// TODO: whats that even?

import { Command, IContext } from '../command'
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

interface ICreateContainerContext extends IContext {
  newContainer?: Container
  type?: string
  options?: string
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
  constructor(invoker: string, context: ICreateContainerContext, conditions?: Condition[]) {
    super(invoker, conditions)
    this.context = context
  }

  context: ICreateContainerContext

  execute(invoker: string, state: GameState) {
    if (!this.context.newContainer) {
      this.context.newContainer = new containerClasses[this.context.type](this.context.options)
    }
    state.containers.add(this.context.newContainer)
  }

  undo(state: GameState) {
    if (!this.context.newContainer) {
      return
    }
    // TODO: undo plz
    state.containers.remove(this.context.newContainer)
  }
}
