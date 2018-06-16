import Condition from './condition'
import { Player } from '../player'

const isClientPlaying: Condition = (invoker, state) => new Promise((resolve, reject) => {
  const player = Player.get(
    state.players.list.find(player => player.clientId === invoker)
  )
  if (!player) {
    reject(`Couldn't find this client in players list`)
  }

  resolve()
})

export default isClientPlaying
