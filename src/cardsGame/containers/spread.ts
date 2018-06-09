import { Container, IContainerOptions } from '../container'

export class Spread extends Container {

  constructor(options: IContainerOptions) {
    super(options)
    this.type = options.type || 'spread'
  }

}
