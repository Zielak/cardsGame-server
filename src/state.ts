import PlayersManager from './state/players'
import StateManager from './state/stateManager'
import { Container } from './container'
import { Base } from './base'
import { BaseCard } from './baseCard'
import PrimitivesStateManager from './state/primitivesStateManager'

export class GameState {

  host: string
  minClients: number
  maxClients: number

  clients = new PrimitivesStateManager<string>()
  // Clients who are currently playing the game
  players = new PlayersManager()
  cards = new StateManager<BaseCard>()
  elements = new StateManager<Base>()
  containers = new StateManager<Container>()

  // Has the game started?
  private started = false


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
