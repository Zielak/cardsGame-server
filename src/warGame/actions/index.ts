import defaultCommands from '../../cardsGame/commands/index'

export default {
  GameStart: require('./gameStart'),

  PlayCard: require('./playCard'),
  NextPlayer: defaultCommands.NextPlayer,
  PrevPlayer: defaultCommands.PrevPlayer,

  DrawUpToThree: require('./drawUpToThree'),

  TestDeal: require('./testDeal'),
}
