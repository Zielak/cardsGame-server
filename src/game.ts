import * as colyseus from 'colyseus'
import { EventEmitter } from 'eventemitter3'
import CommandManager from './commandManager'
import { GameState } from './gameState'
import { Command } from './command'
import { EventParser } from './eventParser'
import { PlayerEvent } from './events/playerEvent'
import { ActionDefinition } from './actionDefinition'

export type CommandsSet = Set<Command>

interface IGameOptions {
  actions: CommandsSet
}

export class Game extends EventEmitter {

  commandManager: CommandManager
  eventParser: EventParser

  constructor(options: IGameOptions) {
    super()

    this.commandManager = new CommandManager()
    this.eventParser = new EventParser(options.actions)
  }

  actionCompleted(resolve, actionName?) {
    return status => {
      console.info('Action complete:', status)
      resolve(status)
      this.emit(Game.events.ACTION_COMPLETED, actionName, status)
    }
  }

  actionFailed(reject, actionName?) {
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
  performAction<T extends GameState>(client: colyseus.Client, state: T, event: PlayerEvent) {
    return new Promise((resolve, reject) => {
      const commands = this.eventParser.getCommandsByInteraction(event)

      // console.info(`-= performAction: client: "${client.id}", action: ${event.action}`)

      if (!state.clients.list.some(el => el === client.id)) {
        reject(`This client doesn't exist "${client.id}".`)
        return
      }

      this.commandManager.execute(commands[0], client.id, state, event.data)
        .then(this.actionCompleted(resolve))
        .catch(this.actionFailed(reject))
    })
  }

  getCurrentPossibleMoves() {

  }



  static id = Symbol('gameid')

  static events = {
    ACTION_COMPLETED: 'actionCompleted',
    ACTION_FAILED: 'actionFailed',
  }

}
