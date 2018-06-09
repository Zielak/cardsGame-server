const {
  isPlayersTurn, isClientPlaying,
} = require('../../cardsGame').Conditions
const { DrawUpToX } = require('../../cardsGame/commands')

const condition = (state, client) => new Promise((resolve, reject) => {
  if (!isPlayersTurn(state, client.id)) {
    reject(`It's not your turn.`)
    return
  } else if (!isClientPlaying(state, client.id)) {
    reject(`Couldn't find this client in players list`)
    return
  }
  resolve()
})

const command = DrawUpToX

const context = {
  maxCards: 3
}

module.exports = { condition, command, context }
