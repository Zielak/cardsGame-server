import { Command, GameState, Player, BaseCard, Base } from '../../../src'

export default class PlayCardCommand extends Command {

  context: {
    cardPlayed: BaseCard,
    player: Player
  }

  execute(invoker: string, state: GameState, cardId: string) {
    return new Promise(resolve => {
      const player = state.getPlayerByClientId(invoker)
      this.context.player = player
      const card = this.context.cardPlayed = Base.get(cardId)

      // TODO: getByName()
      const pile = state.elements.getByName('pile')[0]
      card.moveTo(pile)
      state.nextPlayer()
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {
      state.previousPlayer()
      const playersHand = this.context.player.children.find(el => el.name === 'hand')
      this.context.cardPlayed.moveTo(playersHand)
    })
  }

}
