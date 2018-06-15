import { DrawXCards, IDrawXCardsContext } from './drawXCards'

export default class DrawTopXCards extends DrawXCards {

  constructor(context: IDrawXCardsContext) {
    super(context)
    this.context.method = count => count - 1
  }

}
