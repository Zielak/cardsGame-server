import { Base, IBaseOptions } from './base'

export interface IPlayerOptions extends IBaseOptions {
  clientId:string
}

export class Player extends Base {

  clientId:string
  score:number
  timeleft:string

  constructor(options:IPlayerOptions) {
    super(options)

    this.type = 'player'

    this.name = options.name
    this.clientId = options.clientId

    // Defaults
    this.score = 0
    // Infinite time left for testing
    this.timeleft = 'Infinity'
  }

}

module.exports = Player
