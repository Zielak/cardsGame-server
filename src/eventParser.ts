import { toArray } from './utils'
import { Command, ICommand } from './command'
import { PlayerEvent } from './events/playerEvent'
import { CommandsSet } from './game'

export class EventParser {

  constructor(private actions: CommandsSet) {

  }

  getAction(data: PlayerEvent) {
    // Get action object, if its simple action or user interaction?
    // const action = data.action ?
    //   this.actions.get(data.action) :
    //   this.mapEventToIntention(data)
    const action = this.actions[data.action]
    return action
  }

  /*
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
  */
}

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

