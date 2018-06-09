import * as EventEmitter from 'eventemitter3'
import CommandManager from './commandManager'
import { toArray } from './utils'

const eventTypeMatches = (playerEvent, actionContext) => {
  // does eventType match?
  if (actionContext.eventType) {
    const eventTypes = toArray(actionContext.eventType)
    return eventTypes.some(type =>
      type === playerEvent.eventType
    )
  }
  // Action context doesn't care about eventType
  return true
}

const reporterMatches = (playerEvent, actionContext) => {
  // does reporter props match?
  if (actionContext.reporter) {
    // There can only be one reporter!
    // All provided props MUST match
    const keys = Object.keys(actionContext.reporter)
    return keys.every(prop =>
      actionContext.reporter[prop] === playerEvent.reporter[prop]
    )
  }
  // Action context doesn't care about reporter
  return true
}

const elementMatches = (playerEvent, actionContext) => {
  if (actionContext.element) {
    // Many elements might get selected
    const playerElements = toArray(playerEvent.element)
    const contextProps = Object.keys(actionContext.element)
    // Every required element MUST have the same props as described in context
    return playerElements.every(element =>
      contextProps.every(prop =>
        element[prop] === actionContext.element[prop]
      )
    )
  }
  return true
}

const doesContextMatch = (playerEvent, actionContext) => {
  return eventTypeMatches(playerEvent, actionContext) &&
    reporterMatches(playerEvent, actionContext) &&
    elementMatches(playerEvent, actionContext)
}

export interface IGameOptions {
  actions
  reducer
}

export class Game extends EventEmitter {

  actions
  reducer
  commandManager

  constructor(options: IGameOptions) {
    super()

    this.actions = options.actions
    this.reducer = options.reducer

    this.commandManager = new CommandManager()
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
   * @memberof Game
   */
  performAction(client, data, state) {
    if (client === null || typeof client !== 'object') {
      client = Game.id
    }

    // Get action object, if its simple action or user interaction?
    const action = data.action ?
      this.actions[data.action] :
      this.mapEventToIntention(data)

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
          action.command, context, client, state, this.reducer
        )
          .then(this.actionCompleted(resolve, actionName))
          .catch(this.actionFailed(reject, actionName))
      } else {
        // Run conditions if it's possible to do it now
        action.condition(state, client)
          .then(() => this.commandManager.execute(
            action.command, context, client, state, this.reducer
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

  /**
   * 
   * 
   * @memberof Game
   */
  mapEventToIntention(playerEvent) {
    const actions = this.actions
    const actionKeys = Object.keys(actions)

    const matchedContext = actionKeys.filter(actionName => {
      console.log('actionName: ', actionName)
      if (typeof actions[actionName].context === 'undefined' || typeof actions[actionName].context !== 'object') {
        return false
      }
      return doesContextMatch(playerEvent, actions[actionName].context)
    })
    return matchedContext
  }

  static id = Symbol('gameid')

  static events = {
    ACTION_COMPLETED: 'actionCompleted',
    ACTION_FAILED: 'actionFailed',
  }

  static baseState = () => {
    return {
      clients: [],

      // Has the game started?
      started: false,

      // Clients that are actually playing the game plus some turn order variables
      players: {
        list: [],
        reversed: false,
        currentPlayerIdx: 0,
        currentPlayer: null,
        currentPlayerPhase: 0,
      },

      // Table
      table: null,
    }
  }

}

/* eslint-disable no-extend-native */
Object.defineProperties(Array.prototype, {
  'first': {
    get: function () {
      return this[0]
    }
  },
  'last': {
    get: function () {
      return this[this.length - 1]
    }
  }
})
/* eslint-enable no-extend-native */
