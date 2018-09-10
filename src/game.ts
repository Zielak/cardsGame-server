import { EventEmitter } from 'eventemitter3'
import CommandManager from './commandManager'
import { GameState } from './state'
import { Command } from './command'
import { EventParser } from './eventParser'
import { PlayerEvent } from './events/playerEvent'

export type CommandsSet = Set<Command>

export interface IGameOptions {
  actions: CommandsSet
}

export class Game extends EventEmitter {

  actions: CommandsSet
  commandManager: CommandManager
  eventParser: EventParser

  constructor(options: IGameOptions) {
    super()
    this.actions = options.actions

    this.commandManager = new CommandManager()
    this.eventParser = new EventParser(this.actions)
  }

  actionCompleted(resolve, actionName) {
    return status => {
      console.info('Action complete:', status)
      resolve(status)
      this.emit(Game.events.ACTION_COMPLETED, actionName, status)
    }
  }

  actionFailed(reject, actionName) {
    return status => {
      console.warn('Action failed:', status)
      reject(status)
      this.emit(Game.events.ACTION_FAILED, actionName, status)
    }
  }

  /**
   * Check conditions and perform given action
   *
   * @param {object} client object, with id and stuff. Otherwise will act as the "game" itself issues this command
   * @param {string} actionName
   * @param {object} state
   * @returns {Promise}
   */
  performAction(client, data: PlayerEvent, state: GameState) {
    if (client === null || typeof client !== 'object') {
      client = Game.id
    }

    const command = this.eventParser.getAction(data)

    const actionName = data.action // TODO: OR????

    console.info(`-= performAction("${client.id}",`, data, `)`)
    if (!data.action) {
      console.info(`   User Event:`, data)
      // console.info(`   Found intentions: ${action.length}`)
    }

    return new Promise((resolve, reject) => {
      if (!state.clients || state.count.clients() <= 0) {
        reject(`There are no clients.`)
      }

      if (state.clients.some(client)) {
        reject(`This client doesn't exist "${client}".`)
      }

      if (command === undefined) {
        reject(`Unknown action.`)
      }

      this.commandManager.execute(command, client.id, data, state)
        .then(this.actionCompleted(resolve, actionName))
        .catch(this.actionFailed(reject, actionName))
    })
  }

  getAllPossibleMoves() {
    return this.actions
  }

  getCurrentPossibleMoves() {

  }



  static id = Symbol('gameid')

  static events = {
    ACTION_COMPLETED: 'actionCompleted',
    ACTION_FAILED: 'actionFailed',
  }

}
