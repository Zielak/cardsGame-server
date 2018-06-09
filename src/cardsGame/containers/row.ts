import { Container, IContainerOptions } from '../container'

export class Row extends Container {

  constructor(options: IContainerOptions) {
    super(options)
    this.type = options.type || 'row'
  }

}
