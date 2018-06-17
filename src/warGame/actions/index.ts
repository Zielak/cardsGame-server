import { DefaultCommands } from '../../cardsGame'
import GameStartCommand from './gameStart'
import PlayCardCommand from './playCard'
import DrawUpToThree from './drawUpToThree'
import TestDeal from './testDeal'

export default {
  GameStart: GameStartCommand,

  PlayCard: PlayCardCommand,
  NextPlayer: DefaultCommands.NextPlayer,
  PrevPlayer: DefaultCommands.PreviousPlayer,

  DrawUpToThree: DrawUpToThree,

  TestDeal: TestDeal,
}
