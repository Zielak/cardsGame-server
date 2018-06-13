import { Player } from '../player'

interface IPlayersState {
  list: Player[]
  reversed: boolean
  currentIdx: number
  current: Player | null
  currentPhase: number
}

export default class PlayersManager {
  private state: IPlayersState
  constructor() {
    this.state = {
      list: [],
      reversed: false,
      currentIdx: 0,
      current: null,
      currentPhase: 0
    }
  }

  add(player) {
    player.onUpdate = me => this.update(me)
    this.state.list.push(player)
  }

  update(player) {
    const idx = this.state.list.indexOf(player)
    this.state.list[idx] = player
  }

  next() {
    let currIdx = this.state.currentIdx
    if (!this.state.reversed) {
      if (++currIdx > this.state.list.length - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.state.list.length - 1
      }
    }
    this.state.currentIdx = currIdx
    this.state.current = this.state.list[currIdx]
  }

  prev() {
    let currIdx = this.state.currentIdx
    if (this.state.reversed) {
      if (++currIdx > this.state.list.length - 1) {
        currIdx = 0
      }
    } else {
      if (--currIdx < 0) {
        currIdx = this.state.list.length - 1
      }
    }
    this.state.currentIdx = currIdx
    this.state.current = this.state.list[currIdx]
  }

  shuffle() {
    let currIdx = this.state.currentIdx
    let i = this.state.list.length
    if (i === 0) {
      return
    }
    while (--i) {
      const j = Math.floor(Math.random() * (i + 1))
      const tempi = this.state.list[i]
      const tempj = this.state.list[j]
      this.state.list[i] = tempj
      this.state.list[j] = tempi
      // Keep the current player the same
      if (i === currIdx) {
        currIdx = j
      }
    }
    this.state.currentIdx = currIdx
    this.state.current = this.state.list[currIdx]
  }

  reverse() {
    this.state.reversed = this.state.reversed
  }

  get list() {
    return this.state.list
  }
}
