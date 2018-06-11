const clientsReducer = {
  add: (state, client) => {
    state.clients.push(client)
  },
  remove: (state, client) => {
    state.clients = state.clients.filter(el => el !== client)
  },
  update: (state, client) => {
    const idx = state.clients.indexOf(client)
    state.clients[idx] = client
  }
}

export default clientsReducer
