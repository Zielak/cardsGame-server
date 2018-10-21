import { Container } from '../container'
import { IBaseOptions } from '../base'

export class Row extends Container {

  constructor(options: IBaseOptions) {
    super(options)
    this.type = options.type || 'row'
  }

}
