import { nosync } from 'colyseus'
import { Base, IBaseOptions } from './base'
import { def } from './utils'

export interface IPlayerOptions extends IBaseOptions {
  clientId: string
}

export class Player extends Base {

  clientId: string
  score: number
  timeleft: string
  @nosync
  markedElements: Set<Base>

  constructor(options: IPlayerOptions) {
    super(options)

    this.type = def(options.type, 'player')

    this.name = options.name
    this.clientId = options.clientId

    // Defaults
    this.score = 0
    // Infinite time left for testing
    this.timeleft = 'Infinity'
  }

  mark(element: Base) {
    this.markedElements.add(element)
  }

  unMark(element: Base): boolean {
    return this.markedElements.delete(element)
  }

}
