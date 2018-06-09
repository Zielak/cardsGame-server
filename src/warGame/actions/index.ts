import { DefaultCommands } from '../../cardsGame'

export default {
  GameStart: require('./gameStart'),

  PlayCard: require('./playCard'),
  NextPlayer: DefaultCommands.NextPlayer,
  PrevPlayer: DefaultCommands.PreviousPlayer,

  DrawUpToThree: require('./drawUpToThree'),

  TestDeal: require('./testDeal'),
}
