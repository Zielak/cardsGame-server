import * as colyseus from 'colyseus'
import { GameState } from './gameState'
import { PlayerEventRaw, PlayerEvent, InteractionDefinition } from './events/playerEvent'
import { CommandManager } from './commandManager'
import { CommandConstructor } from './command'
import { Condition } from './conditions/condition'
import { Base } from './base'
import { Player } from './player'
import { ClassicCard } from './classicCard'

export type ActionsSet = Set<ActionTemplate>

export type ActionTemplate = {
  command: CommandConstructor;
  conditions?: Condition[];
  interaction: InteractionDefinition | InteractionDefinition[];
}

export interface IGameRoom {
  possibleActions: ActionsSet
  getGameState(): typeof GameState
  onSetupGame(): void
  onStartGame(): void
}

export class GameRoom<T extends GameState> extends colyseus.Room<T> implements IGameRoom {

  name = 'Example Game'

  commandManager: CommandManager

  /**
   * List of all possible commands to execute by players
   */
  possibleActions: ActionsSet

  onSetupGame() { }
  onStartGame() { }
  preparePlayer(player: Player) { }

  startGame() {
    this.clients.forEach(client => {
      const player = new Player({
        clientId: client.id
      })
      this.state.players.add(player)
      this.preparePlayer(player)
    })

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

  onMessage(client: colyseus.Client, event: PlayerEventRaw) {
    console.log('MSG: ', JSON.stringify(event))

    if (!this.state.clients || this.state.clients.length <= 0) {
      console.warn(`There are no clients.`)
      return
    }

    // TODO: Handle "StartGame" as - let all agree to start the game
    if (event.data === 'start' && !this.state.hasStarted) {
      this.startGame()
      return
    } else if (event.data === 'start' && this.state.hasStarted) {
      console.log(`Game is already started, ignoring...`)
      return
    }

    if (!this.state.clients.list.some(el => el === client.id)) {
      console.warn(`This client doesn't exist "${client.id}".`)
      return
    }

    this.performAction(client, this.parseEvent(event))
  }

  /**
   * Check conditions and perform given action
   *
   * @param client object, with id and stuff. Otherwise will act as the "game" itself issues this command
   * @param event
   */
  performAction(client: colyseus.Client, event: PlayerEvent) {

    const actions = this.getActionsByInteraction(event)

    // TODO: not the first one, but precisely decide which one!
    this.commandManager.execute(actions[0], client.id, this.state, event)
      .then((data) => {
        console.info(`Action completed. data: ${data}`)
      })
      .catch((reason) => {
        console.warn(`Action failed: ${reason}`)
        this.broadcast({
          event: 'game.error',
          data: `Client "${client.id}" failed to perform action.
          Details: ${reason}`
        })
      })
  }

  getActionsByInteraction(event: PlayerEvent): ActionTemplate[] {
    const eventTarget = event.target
    if (!eventTarget) {
      return []
    }

    const actions = Array.from(this.possibleActions.values())
      .filter(template => {
        const interaction = template.interaction

        const matches = (interaction: InteractionDefinition) => {
          const checkProp = prop => {
            if (interaction[prop]) {
              if (eventTarget[prop] !== interaction[prop]) {
                return false
              }
            }
            // Prop either matches or was not defined/desired
            return true
          }
          return ['name', 'type', 'value', 'rank', 'suit'].every(checkProp)
        }

        if (Array.isArray(interaction)) {
          return interaction.some(matches)
        } else {
          return matches(interaction)
        }
      })

    return actions
  }

  parseEvent(event: PlayerEventRaw): PlayerEvent {
    const parsed: PlayerEvent = {
      eventType: event.eventType,
      details: {},
    }
    if (event.eventTarget) {
      parsed.target = Base.get(event.eventTarget)
      parsed.details.name = parsed.target.name
      parsed.details.type = parsed.target.type
      if (parsed.target instanceof ClassicCard) {
        parsed.details.rank = parsed.target.rank
        parsed.details.suit = parsed.target.suit
      }
    }
    if (event.data) {
      parsed.data = event.data
    }

    return parsed
  }

  onDispose() {
    console.log('Dispose game')
    console.log('===========================')
  }
}
