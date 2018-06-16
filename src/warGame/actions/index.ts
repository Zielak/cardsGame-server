import { DefaultCommands } from '../../cardsGame'
import GameStartCommand from './gameStart'
import from './playCard'
import from './drawUpToThree'
import from './testDeal'

export default {
  GameStart: GameStartCommand,

  PlayCard: require('./playCard'),
  NextPlayer: DefaultCommands.NextPlayer,
  PrevPlayer: DefaultCommands.PreviousPlayer,

  DrawUpToThree: require('./drawUpToThree'),

  TestDeal: require('./testDeal'),
}
