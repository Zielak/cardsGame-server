import { EventEmitter } from 'eventemitter3'
import CommandManager from './commandManager'
import { GameState } from './state'
import { Command } from './command'
import { EventParser } from './eventParser'
import { PlayerEvent } from './events/playerEvent';

export type MapOfCommands = Map<string, typeof Command>

export interface IGameOptions {
  actions: MapOfCommands
}

export class Game extends EventEmitter {

  actions: MapOfCommands
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

    const action = this.eventParser.getAction(data)

    const actionName = data.action // TODO: OR????

    console.info(`-= performAction("${client.id}",`, data, `)`)
    if (!data.action) {
      console.info(`   User Event:`, data)
      console.info(`   Found intentions: ${action.length}`)
    }

    return new Promise((resolve, reject) => {
      if (!state.clients || state.clients.length <= 0) {
        reject(`There are no clients.`)
      }

      if (state.clients.includes(client)) {
        reject(`This client doesn't exist "${client}".`)
      }

      if (action === undefined) {
        reject(`Unknown action.`)
      }

      const context = {
        data: data,
        ...action.context
      }

      // Doesn't have condition, just run it
      if (action.condition === undefined) {
        console.info(`action has no conditions`)
        this.commandManager.execute(
          action.command, context, client, state
        )
          .then(this.actionCompleted(resolve, actionName))
          .catch(this.actionFailed(reject, actionName))
      } else {
        // Run conditions if it's possible to do it now
        action.condition(state, client)
          .then(() => this.commandManager.execute(
            action.command, context, client, state
          ))
          .then(this.actionCompleted(resolve, actionName))
          .catch(this.actionFailed(reject, actionName))
      }
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
