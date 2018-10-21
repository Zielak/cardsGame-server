import { Command, ICommand, PlayerEvent, GameState, Player, ClassicCard, Container, Pile, Hand } from '../../..'


export class PlayNormalCard extends Command implements ICommand {

  context: {
    player: Player
    card: ClassicCard
    sourceContainer: Hand
    targetContainer: Pile
  }

  execute(invoker: string, state: GameState, event: PlayerEvent) {
    const player = state.currentPlayer
    const pile = state.containers.getByName('pile') as Pile
    const hand = state.containers.getByType('hand').find(hand => {
      return hand.parent === player
    })
    const card = event.target as ClassicCard

    if (!hand) {
      this.fail(`Couldn't find player's hand(?!?)`)
    }

    pile.addChild(card)

    this.context.player = player
    this.context.card = card
    this.context.sourceContainer = hand
    this.context.targetContainer = pile
    this.finish()
  }

  undo(state: GameState) {
    // Maybe that could be enough
    const hand = this.context.sourceContainer
    const card = this.context.card

    hand.addChild(card)
  }

}

