import { Command, GameState, Player } from '../../../'

export default class GameStartCommand extends Command {

  context: {
    createdPlayers: Player[]
  }

  constructor() {
    super({
      createdPlayers: []
    })
  }

  execute(_, state: GameState) {
    return new Promise(resolve => {
      state.clients.forEach(client => {
        const newPlayer = new Player({
          clientId: client,
          name: client
        })
        this.context.createdPlayers.push(newPlayer)
        state.players.add(newPlayer)
      })
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {
      this.context.createdPlayers.forEach(player => {
        state.players.remove(player)
      })
    })
  }

}
