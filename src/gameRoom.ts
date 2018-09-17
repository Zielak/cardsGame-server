import * as colyseus from 'colyseus'
import { GameState } from './gameState'
import { PlayerEvent } from './events/playerEvent'
import { Game, CommandsSet } from './game'

export interface IGameRoom {
  game: Game
  possibleActions: CommandsSet
  setupGame(): void
  getGameState(): typeof GameState
}

export class GameRoom<T extends GameState> extends colyseus.Room<T> implements IGameRoom {

  name = 'Example Game'
  game: Game

  /**
   * List of all possible commands to execute by players
   */
  possibleActions: CommandsSet

  setupGame() { }
  getGameState(): typeof GameState {
    return GameState
  }


  onInit(options) {
    this.setState(new (this.getGameState())({
      minClients: options.minClients || 1,
      maxClients: options.maxClients || 2,
      host: options.host,
    }))

    this.setupGame()
    this.game = new Game({
      actions: this.possibleActions
    })

    console.log('WarGame room created!', options)
  }

  requestJoin(options, isNew) {
    const res = this.clients.length < this.state.maxClients
    if (!res) {
      console.log('rejected new client!')
    }
    return this.clients.length < this.state.maxClients
  }

  onJoin(client: colyseus.Client, options, auth) {
    console.log('JOINED: ', client.id)
    this.state.addClient(client.id)
    if (!this.state.host) {
      this.state.host = client.id
    }
  }

  onLeave(client: colyseus.Client) {
    this.state.removeClient(client.id)
    // TODO: Handle leave when the game is running
    // Timeout => end game? Make player able to go back in?
  }

  onMessage(client: colyseus.Client, event: PlayerEvent) {
    console.log('MSG: ', JSON.stringify(event))

    if (!this.state.clients || this.state.clients.length <= 0) {
      console.warn(`There are no clients.`)
      return
    }

    // TODO: Handle "StartGame" as - let all agree to start the game
    // if(data.action)

    this.game.performAction(client, this.state, event)
      .then(status => {
        console.log(`action resolved! ${status ? status : ''}`)
      })
      .catch(status => {
        this.broadcast({
          event: 'game.error',
          data: `Client "${client.id}" failed to perform action.
          Details: ${status}`
        })
        console.warn(`Client "${client.id}" failed to perform action.
        Details: ${status}`)
      })
  }

  onDispose() {
    console.log('Dispose game')
    console.log('===========================')
  }
}
