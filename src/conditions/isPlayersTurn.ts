import { Condition } from './condition'

const isPlayersTurn: Condition = (invoker, state) => new Promise((resolve, reject) => {
  const currentPlayer = state.currentPlayer
  if (!currentPlayer) {
    reject(`There's no current player`)
  }
  if (currentPlayer.clientId === invoker) {
    resolve()
  }
  reject(`isPlayersTurn: unknown error`)
})

export default isPlayersTurn
