import Condition from './condition'

const isPlayersTurn: Condition = (invoker, state) => {
  return state.players.currentPlayer.clientId === invoker
}

export default isPlayersTurn
