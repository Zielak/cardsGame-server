import { DrawXCards, IDrawXCardsContext } from './drawXCards'

export default class DrawRandomXCards extends DrawXCards {

  constructor(context: IDrawXCardsContext) {
    super(context)
    this.context.method = count => Math.floor(Math.random() * count)
  }

}
