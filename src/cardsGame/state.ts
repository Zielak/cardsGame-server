import { Base } from './base'
import { BaseCard } from './baseCard'

import { Container } from './container'

import PlayersManager from './state/players'
import ClientsManager from './state/clients'
import { arrayManager } from './state/array'

export class GameState {

  host: string
  minClients: number
  maxClients: number

  clients = new ClientsManager()
  // Clients who are currently playing the game
  players = new PlayersManager()

  private _cards: BaseCard[] = []
  private _elements: Base[] = []
  private _containers: Container[] = []

  // Has the game started?
  private started = false

  cards = arrayManager(this._cards)
  elements = arrayManager(this._elements)
  containers = arrayManager(this._containers)

  constructor({ minClients, maxClients, host }) {
    this.minClients = minClients
    this.maxClients = maxClients
    this.host = host
  }

  gameStart() {
    this.started = true
  }

  get hasStarted() {
    return this.started
  }

}
