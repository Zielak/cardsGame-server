import { GameRoom, GameState, Deck, Pile, Hand, CreateGameServer, Player, Presets, Conditions } from '../../'
import { IGameRoom, ActionsSet, ActionTemplate } from '../../src/gameRoom'

import { PlayNormalCard } from './commands/playNormalCard'

import matchesSuit from './conditions/matchesSuit'
import matchesRank from './conditions/matchesRank'

class ContainersTest<T extends GameState> extends GameRoom<T> implements IGameRoom {

  name = 'Makao'

  possibleActions: ActionsSet = new Set<ActionTemplate>([
    {
      command: PlayNormalCard,
      interaction: {
        type: 'card',
        rank: ['5', '6', '7', '8', '9', '10', 'Q']
      },
      conditions: [
        Conditions.isPlayersTurn,
        Conditions.OR(matchesSuit, matchesRank)
      ]
    },
  ])

  onSetupGame() {
    const deck = new Deck({
      name: 'deck',
      x: 150,
      y: 0
    })
    this.state.elements.add(deck)
    deck.addChildren(Presets.classicCards())

    const pile = new Pile({
      name: 'pile',
      x: 0,
      y: 0
    })
    this.state.elements.add(pile)
  }

  preparePlayer(player: Player) {
    new Hand({
      name: 'tmpHand',
      parent: player,
      x: 120, y: -80
    })
    new Hand({
      name: 'mainHand',
      parent: player,
      x: 0, y: 0
    })
  }

  onStartGame() {
    const hands = this.state.elements.getByName<Hand>('mainHand')
    const deck = this.state.elements.getByType('deck')[0] as Deck
    const pile = this.state.elements.getByType<Pile>('pile')

    deck.shuffle()
    deck.deal(hands, 5)
    deck.deal(pile, 1)

    console.log(`  starting game with ${this.state.players.length} players`)
  }

}

// This will init the server with one game type
CreateGameServer([ContainersTest])
