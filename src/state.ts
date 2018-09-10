import { EntityMap, nosync } from 'colyseus'
import { Container } from './container'
import { Base } from './base'
import { BaseCard } from './baseCard'
import { Player } from './player'

export class GameState {

  host: string
  minClients: number
  maxClients: number

  clients: EntityMap<string> = {}
  // Clients who are currently playing the game
  players: EntityMap<Player> = {}

  @nosync
  playersOrder: Array<string> = []

  cards: EntityMap<BaseCard> = {}
  elements: EntityMap<Base> = {}
  containers: EntityMap<Container> = {}

  // Has the game started?
  private started = false

  private _playerOrderReversed = false
  private _currentPlayerIdx = 0
  private _currentPlayer: Player | null = null
  private _currentPlayerPhase = 0

  constructor({ minClients, maxClients, host }) {
    this.minClients = minClients
    this.maxClients = maxClients
    this.host = host
  }

  // TODO: I'm loosing flexibility here. What about .some, .map etc?
  // What about states extending this one, which add more EntityMaps?
  get add() {
    return {
      client: (el: string) => this['clients'][el] = el,
      player: (el: Player) => this['players'][el.id] = el,
      card: (el: BaseCard) => this['cards'][el.id] = el,
      element: (el: Base) => this['elements'][el.id] = el,
      container: (el: Container) => this['containers'][el.id] = el,
    }
  }
  get remove() {
    return {
      client: (id: string) => delete this['clients'][id],
      player: (id: string) => delete this['players'][id],
      card: (id: string) => delete this['cards'][id],
      element: (id: string) => delete this['elements'][id],
      container: (id: string) => delete this['containers'][id],
    }
  }
  get count() {
    const _count = (what: string) => Object.getOwnPropertyNames(this[what]).length
    return {
      clients: () => _count('clients'),
      players: () => _count('players'),
      cards: () => _count('cards'),
      elements: () => _count('elements'),
      containers: () => _count('containers'),
    }
  }

  gameStart() {
    this.started = true
  }

  get hasStarted() {
    return this.started
  }

  addPlayer(player: Player) {
    this.players[player.id] = player
    this.playersOrder.push(player.id)
  }

  removePlayer(playerId: string) {
    delete this.players.playerId
    this.playersOrder = this.playersOrder.filter(id => id !== playerId)
  }

  nextPlayer(): Player {
    let currIdx = this._currentPlayerIdx
    if (!this._playerOrderReversed) {
      if (++currIdx > this.playersCount - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.playersCount - 1
      }
    }
    this._currentPlayerIdx = currIdx
    this._currentPlayer = this.players[currIdx]
    return this._currentPlayer
  }

  previousPlayer() {
    let currIdx = this._currentPlayerIdx
    if (this._playerOrderReversed) {
      if (++currIdx > this.playersCount - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.playersCount - 1
      }
    }
    this._currentPlayerIdx = currIdx
    this._currentPlayer = this.players[this.playersOrder[currIdx]]
  }

  shufflePlayers() {
    let currIdx = this._currentPlayerIdx
    let i = this.playersCount
    if (i === 0) {
      return
    }
    while (--i) {
      const j = Math.floor(Math.random() * (i + 1))
      const tempi = this.playersList[i]
      const tempj = this.playersList[j]
      this.playersOrder[i] = tempj.id
      this.playersOrder[j] = tempi.id
      // Keep the current player the same
      if (i === currIdx) {
        currIdx = j
      }
    }
    this._currentPlayerIdx = currIdx
    this._currentPlayer = this.players[this.playersOrder[currIdx]]
  }

  reversePlayerOrder() {
    this._playerOrderReversed = !this._playerOrderReversed
  }

  get playerOrderReversed() { return this._playerOrderReversed }
  get currentPlayerIdx() { return this._currentPlayerIdx }
  get currentPlayer() { return this._currentPlayer }
  get currentPlayerPhase() { return this._currentPlayerPhase }

  get playersList(): Player[] {
    return Object.getOwnPropertyNames(this.players).map(key => this.players[key])
  }
  get playersCount(): number {
    return Object.getOwnPropertyNames(this.players).length
  }

}
