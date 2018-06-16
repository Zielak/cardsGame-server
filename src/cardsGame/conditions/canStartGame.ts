import Condition from './condition'

const canStartGame: Condition = (invoker, state) => new Promise((resolve, reject) => {
  if (state.hasStarted) {
    reject(`Game already started.`)
  } else if (invoker !== state.host) {
    reject(`Client '${invoker}' is not a host: '${state.host}'`)
  } else if (state.clients.length < state.minClients) {
    reject(`Not enough clients: only '${state.clients.length}' clients in the room. Need at least '${state.minClients}'`)
  }
  resolve()
})

export default canStartGame
