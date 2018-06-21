import { Player } from '../player'
import StateManager from './stateManager';

export default class PlayersManager extends StateManager<Player> {
  private _reversed = false
  private _currentIdx = 0
  private _current: Player | null = null
  private _currentPhase = 0

  get reversed() { return this._reversed }
  get currentIdx() { return this._currentIdx }
  get current() { return this._current }
  get currentPhase() { return this._currentPhase }

  add(player) {
    player.onUpdate = me => this.update(me)
    this.state.push(player)
  }

  update(player) {
    const idx = this.state.indexOf(player)
    this.state[idx] = player
  }

  next() {
    let currIdx = this.currentIdx
    if (!this.reversed) {
      if (++currIdx > this.state.length - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.state.length - 1
      }
    }
    this._currentIdx = currIdx
    this._current = this.state[currIdx]
  }

  prev() {
    let currIdx = this.currentIdx
    if (this.reversed) {
      if (++currIdx > this.state.length - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.state.length - 1
      }
    }
    this._currentIdx = currIdx
    this._current = this.state[currIdx]
  }

  shuffle() {
    let currIdx = this.currentIdx
    let i = this.state.length
    if (i === 0) {
      return
    }
    while (--i) {
      const j = Math.floor(Math.random() * (i + 1))
      const tempi = this.state[i]
      const tempj = this.state[j]
      this.state[i] = tempj
      this.state[j] = tempi
      // Keep the current player the same
      if (i === currIdx) {
        currIdx = j
      }
    }
    this._currentIdx = currIdx
    this._current = this.state[currIdx]
  }

  reverse() {
    this._reversed = !this._reversed
  }

  get list() {
    return this.state
  }

  get currentPlayer() {
    return this.state[this._currentIdx]
  }
}
