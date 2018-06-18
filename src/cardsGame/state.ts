import PlayersManager from './state/players'
import StateManager from './state/stateManager'

export class GameState {

  host: string
  minClients: number
  maxClients: number

  clients = new StateManager()
  // Clients who are currently playing the game
  players = new PlayersManager()
  cards = new StateManager()
  elements = new StateManager()
  containers = new StateManager()

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
