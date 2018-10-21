import { Container } from '../container'
import { IBaseOptions } from '../base'

export class Spread extends Container {

  constructor(options: IBaseOptions) {
    super(options)
    this.type = options.type || 'spread'
  }

}
