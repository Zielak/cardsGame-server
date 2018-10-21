import { Command, GameState, IExecutable, PlayerEvent, Base, Player, BaseCard } from '../../..'
import { rejects } from 'assert'

/**
 * Begining:
 * - user clicks any card
 * - focus on the container of that card
 * - be able to "mark" one or many cards
 *
 * End:
 * - click card of any other container OR
 * - click another container
 */

export class MoveCardsCommand extends Command {

  context: {
    fromContainer: Base,
    player: Player,
    markedCards: Set<BaseCard>
  }

  prepareContext() {
    this.context.fromContainer = null
    this.context.player = null
    this.context.markedCards = new Set<BaseCard>()
  }

  execute(invoker: string, state: GameState, event: PlayerEvent) {
    // TODO: maybe focus on invoker?
    this.context.player = state.currentPlayer

    const element = event.eventTarget

    if (!this.context.fromContainer) {
      // Is that the first interaction? Remember container
      console.log('[moveCards] > first time here, remember container')

      const container = element.parent
      if (!element.parent) {
        return this.fail(`No parent container, I don't know how to handle that`)
      }
      this.context.fromContainer = container
    } else if (element.parent !== this.context.fromContainer) {
      console.log('[moveCards] > chose different container, finish action!')
      // User selected another container, get out and finish action!

      // TODO: finally move marked cards.


      return this.finish(`Cards moved`)
    }
    // Mark/unmark selected element
    const card = (element as BaseCard)
    card.marked = !card.marked
    this.context.markedCards[card.marked ? 'delete' : 'add'](card)
    console.log(`[moveCards] > ${card.marked ? 'added' : 'removed'} card ${card.name} ${card.marked ? 'to' : 'from'} the set`)
  }

  undo(state: GameState): IExecutable {
    return new Promise(resolve => {
      resolve()
    })
  }

}
