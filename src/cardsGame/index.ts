
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

import { Game } from './game'
import { Base } from './base'
import { BaseCard } from './baseCard'
import { ClassicCard } from './classicCard'
import { Container } from './container'
import Command from './commands/command'
import Conditions from './conditions/index'
import Reducers from './reducers/index'
import { Deck } from './containers/deck'
import { Hand } from './containers/hand'
import { Pile } from './containers/pile'
import { Row } from './containers/row'
import { Spread } from './containers/spread'
import { Player } from './player'
import { Presets } from './presets'
import { Table } from './table'

export default {
  Game,
  Base, BaseCard, ClassicCard, Container,
  Command, Conditions, Reducers,
  Deck, Hand, Pile, Row, Spread,
  Player, Presets, Table,
}
