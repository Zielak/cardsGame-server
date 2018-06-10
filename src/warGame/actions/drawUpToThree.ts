import { Conditions } from '../../cardsGame'
import { DefaultCommands } from '../../cardsGame'

const condition = (state, client) => new Promise((resolve, reject) => {
  if (!Conditions.isPlayersTurn(state, client.id)) {
    reject(`It's not your turn.`)
    return
  } else if (!Conditions.isClientPlaying(state, client.id)) {
    reject(`Couldn't find this client in players list`)
    return
  }
  resolve()
})

const command = DefaultCommands.DrawUpToXCommand

const context = {
  maxCards: 3
}

export default { condition, command, context }
