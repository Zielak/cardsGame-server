import Condition from './condition'

const isPlayersTurn: Condition = (invoker, state) => new Promise((resolve, reject) => {
  if (state.players.currentPlayer.clientId === invoker) {
    resolve()
  }
  reject()
})

export default isPlayersTurn
