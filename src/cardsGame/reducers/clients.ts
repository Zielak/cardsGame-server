const clientsReducer = {
  add: (state, client) => {
    state.clients.push(client)
  },
  remove: (state, client) => {
    state.clients = state.clients.filter(el => el !== client)
  }
}

module.exports = clientsReducer
