import * as colyseus from 'colyseus'
import { Game, GameState, PlayerEvent } from '../cardsGame/index'

import actions from './actions/index'

export default class WarGame extends colyseus.Room<GameState> {

  game: Game

  onInit(options) {
    this.game = new Game({ actions })

    this.setState(new GameState({
      maxClients: options.maxClients || 2,
      host: options.host,
    }))

    console.log('WarGame room created!', options)
  }

  requestJoin() {
    const res = this.clients.length < this.state.maxClients
    if (!res) {
      console.log('WarGame - rejected new client!')
    }
    return this.clients.length < this.state.maxClients
  }

  onJoin(client) {
    console.log('WarGame: JOINED: ', client.id)
    this.state.clients.add(client.id)
    if (!this.state.host) {
      this.state.host = client.id
    }
  }

  onLeave(client) {
    this.state.clients.remove(client.id)
    // TODO: Handle leave when the game is running
    // Timeout => end game? Make player able to go back in?
  }

  onMessage(client, data: PlayerEvent) {
    console.log('MSG: ', JSON.stringify(data))
    this.game.performAction(client, data, this.state)
      .then(status => {
        console.log('action resolved!', status)
      })
      .catch(status => {
        console.error('action failed!', status)
        this.broadcast({
          event: 'game.error',
          data: `Client "${client.id}" failed to perform "${data.action}" action.
          Details: ${status}`
        })
      })
  }

  onDispose() {
    console.log('Dispose WarGame')
    console.log('===========================')
  }

  // attatchEvents() {
  //   const eventMap = {
  //     gameStart: this.onGameStart,
  //   }
  //   this.game.on(Game.events.ACTION_COMPLETED, (actionName, status) => {
  //     eventMap[actionName](status)
  //   })
  // }

  onGameStart() {

  }

}
