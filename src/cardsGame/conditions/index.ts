import { Player } from '../player'

module.exports = {
  isPlayersTurn: (state, player) => {
    return state.players.currentPlayer === player
  },
  isClientPlaying: (state, client) => new Promise((resolve, reject) => {
    const player = Player.get(
      state.players.list.find(player => player.clientId === client)
    )
    if (!player) {
      reject(`Couldn't find this client in players list`)
    }

    resolve()
  })
}
