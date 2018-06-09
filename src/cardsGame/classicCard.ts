import { BaseCard, IBaseCardOptions } from './baseCard'

export interface IClassicCardOptions extends IBaseCardOptions {
  suit: string
  rank: string|number
}

export class ClassicCard extends BaseCard {

  suit: string
  rank: string|number

  constructor(options: IClassicCardOptions) {
    super(options)
    this.suit = options.suit
    this.rank = options.rank
    this.name = this.rank + this.suit
  }

}

module.exports = ClassicCard
