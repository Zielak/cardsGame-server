import { DrawXCards } from './drawXCards'

export default class DrawTopXCards extends DrawXCards {

  prepareContext() {
    this.context.method = count => count - 1
  }

}
