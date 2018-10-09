import { nosync } from 'colyseus'
import { Container } from './container'
import { Base } from './base'
import { BaseCard } from './baseCard'
import { Player } from './player'
import { EntityMap, PrimitiveMap } from './entityMap'

export class GameState {

  host: string
  minClients: number
  maxClients: number

  clients = new PrimitiveMap<string>()
  // Clients who are currently playing the game
  players = new EntityMap<Player>()

  // FIXME: What is this exactly and how am I supposed to use it?
  @nosync
  playersOrder: Array<string> = []

  cards = new EntityMap<BaseCard>()
  elements = new EntityMap<Base>()
  containers = new EntityMap<Container>()

  // Has the game started?
  private started = false

  private _playerOrderReversed = false
  private _currentPlayerIdx = 0
  private _currentPlayer: Player | null = null
  private _currentPlayerPhase = 0

  constructor({ minClients = 1, maxClients = 2, host = '' } = {}) {
    this.minClients = minClients
    this.maxClients = maxClients
    this.host = host
  }

  gameStart() {
    this.started = true
    this._currentPlayer = this.players.list[this._currentPlayerIdx]
  }

  get hasStarted() {
    return this.started
  }

  addClient(clientId: string) {
    this.clients.add(clientId)
  }

  removeClient(clientId: string) {
    this.clients.remove(clientId)
  }

  getPlayerByClientId(clientId: string): Player {
    return this.players.list.find(player => {
      return player.clientId === clientId
    })
  }

  nextPlayer(): Player {
    let currIdx = this._currentPlayerIdx
    if (!this._playerOrderReversed) {
      if (++currIdx > this.players.length - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.players.length - 1
      }
    }
    this._currentPlayerIdx = currIdx
    this._currentPlayer = this.players.list[currIdx]
    return this._currentPlayer
  }

  previousPlayer() {
    let currIdx = this._currentPlayerIdx
    if (this._playerOrderReversed) {
      if (++currIdx > this.players.length - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.players.length - 1
      }
    }
    this._currentPlayerIdx = currIdx
    this._currentPlayer = this.players.list[currIdx]
    return this._currentPlayer
  }

  shufflePlayers() {
    let currIdx = this._currentPlayerIdx
    let i = this.players.length
    if (i === 0) {
      return
    }
    while (--i) {
      const j = Math.floor(Math.random() * (i + 1))
      const tempi = this.players.list[i]
      const tempj = this.players.list[j]
      this.playersOrder[i] = tempj.id
      this.playersOrder[j] = tempi.id
      // Keep the current player the same
      if (i === currIdx) {
        currIdx = j
      }
    }
    this._currentPlayerIdx = currIdx
    this._currentPlayer = this.players.list[this.playersOrder[currIdx]]
  }

  reversePlayerOrder() {
    this._playerOrderReversed = !this._playerOrderReversed
  }

  get playerOrderReversed() { return this._playerOrderReversed }
  get currentPlayerIdx() { return this._currentPlayerIdx }
  get currentPlayer() { return this._currentPlayer }
  get currentPlayerPhase() { return this._currentPlayerPhase }

}
