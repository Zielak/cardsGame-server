import * as colyseus from 'colyseus'
import { EventEmitter } from 'eventemitter3'
import CommandManager from './commandManager'
import { GameState } from './gameState'
import { Command } from './command'
import { EventParser } from './eventParser'
import { PlayerEvent } from './events/playerEvent'

export type CommandsMap = Map<string, Command>

export interface IGameOptions {
  actions: CommandsMap
}

export class Game extends EventEmitter {

  actions: CommandsMap
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
  performAction<T extends GameState>(client: colyseus.Client, state: T, data: PlayerEvent) {
    return new Promise((resolve, reject) => {
      const command = this.eventParser.getAction(data)
      const actionName = data.action // TODO: OR????

      if (command === undefined || typeof command === 'undefined') {
        reject(`Unknown action.`)
        return
      }

      console.info(`-= performAction: client: "${client.id}", action: ${data.action}`)
      if (!actionName) {
        console.info(`   User Event:`, data)
        // console.info(`   Found intentions: ${action.length}`)
      }

      if (!state.clients || state.clients.length <= 0) {
        reject(`There are no clients.`)
        return
      }

      if (!state.clients.list.some(el => el === client.id)) {
        reject(`This client doesn't exist "${client.id}".`)
        return
      }

      this.commandManager.execute(command, client.id, state, data.data)
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
