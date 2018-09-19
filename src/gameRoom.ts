import * as colyseus from 'colyseus'
import { GameState } from './gameState'
import { PlayerEvent } from './events/playerEvent'
import { CommandManager } from './commandManager'
import { EventParser } from './eventParser'
import { Command } from './command'

export type CommandsSet = Set<Command>

export interface IGameRoom {
  possibleActions: CommandsSet
  getGameState(): typeof GameState
  onSetupGame(): void
  onStartGame(): void
}

export class GameRoom<T extends GameState> extends colyseus.Room<T> implements IGameRoom {

  name = 'Example Game'

  commandManager: CommandManager
  eventParser: EventParser

  /**
   * List of all possible commands to execute by players
   */
  possibleActions: CommandsSet

  onSetupGame() { }
  onStartGame() { }

  startGame() {
    this.onStartGame()
    this.state.gameStart()
  }

  getGameState(): typeof GameState {
    return GameState
  }

  onInit(options) {
    this.setState(new (this.getGameState())({
      minClients: options.minClients || 1,
      maxClients: options.maxClients || 4,
      host: options.host,
    }))

    this.onSetupGame()

    this.commandManager = new CommandManager()
    this.eventParser = new EventParser(this.possibleActions)

    console.log(`${this.name} room created!`, options)
  }

  requestJoin(options, isNew) {
    const res = this.clients.length < this.state.maxClients
    if (!res) {
      console.log(`rejected new client! curr: ${this.clients.length}, max: ${this.state.maxClients}`)
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
    if (event.data === 'start' && !this.state.hasStarted) {
      this.startGame()
      return
    }

    if (!this.state.clients.list.some(el => el === client.id)) {
      console.warn(`This client doesn't exist "${client.id}".`)
      return
    }

    this.performAction(client, event)
      .then(status => {
        console.log(`action resolved! ${status ? status : ''}`)
      })
      .catch(status => {
        this.broadcast({
          event: 'game.error',
          data: `Client "${client.id}" failed to perform action.
          Details: ${status}`
        })
      })
  }

  /**
   * Check conditions and perform given action
   *
   * @param client object, with id and stuff. Otherwise will act as the "game" itself issues this command
   * @param event
   */
  performAction<T extends GameState>(client: colyseus.Client, event: PlayerEvent): Promise<any> {
    return new Promise((resolve, reject) => {
      const commands = this.eventParser.getCommandsByInteraction(event)

      this.commandManager.execute(commands[0], client.id, this.state, event)
        .then((data) => {
          console.info(`Action completed. data: ${data}`)
          resolve()
        })
        .catch((reason) => {
          console.warn(`Action failed: ${reason}`)
          reject(reason)
        })
    })
  }

  onDispose() {
    console.log('Dispose game')
    console.log('===========================')
  }
}
