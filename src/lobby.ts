import colyseus from 'colyseus'

const isValidMessage = text => {
  return ('' + text).length > 0
}

class Lobby extends colyseus.Room {

  onInit(options) {
    this.setState({
      messages: [],
      clients: [],
      gameRooms: [],
    })
    console.log('Lobby created!', options)
  }

  onJoin(client) {
    this.state.messages.push({
      text: `${client.id} joined.`
    })
    this.state.clients.push(client.id)
  }

  onLeave(client) {
    this.state.messages.push({
      text: `${client.id} left.`
    })
    this.state.clients.splice(
      this.state.clients.indexOf(client.id), 1
    )
  }

  onMessage(client, data) {
    if (isValidMessage(data.message)) {
      this.state.messages.push({
        text: data.message,
        client: client.id
      })
      console.log('Lobby:', client.id, data.message)
    }
  }

  onDispose() {
    console.log('Dispose Lobby')
  }

}

module.exports = Lobby
