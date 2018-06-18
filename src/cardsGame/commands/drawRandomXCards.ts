import { DrawXCards } from './drawXCards'

export default class DrawRandomXCards extends DrawXCards {

  prepareContext() {
    this.context.method = count => Math.floor(Math.random() * count)
  }

}
