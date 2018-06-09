
/* eslint-disable no-extend-native */
Object.defineProperties(Array.prototype, {
  'first': {
    get: function () {
      return this[0]
    }
  },
  'last': {
    get: function () {
      return this[this.length - 1]
    }
  }
})
/* eslint-enable no-extend-native */

module.exports = {
  Game: require('./game'),

  Base: require('./base'),
  BaseCard: require('./baseCard'),
  ClassicCard: require('./classicCard'),
  Container: require('./container'),

  Command: require('./commands/command'),
  Conditions: require('./conditions/index'),
  Reducers: require('./reducers/index'),

  Deck: require('./containers/deck'),
  Hand: require('./containers/hand'),
  Pile: require('./containers/pile'),
  Row: require('./containers/row'),
  Spread: require('./containers/spread'),

  Player: require('./player'),
  Presets: require('./presets'),
  Table: require('./table'),
}
