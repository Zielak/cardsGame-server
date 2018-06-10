export { Base } from './base'
export { BaseCard } from './baseCard'
export { ClassicCard } from './classicCard'
export { Command } from './command'

import * as _DefaultCommands from './commands/index'
export { _DefaultCommands as DefaultCommands }

// import CreateContainer from './commands/createContainer'
// import DrawUpToXCommand from './commands/drawUpToX'
// import MoveCardToContainer from './commands/moveCardToContainer'
// import NextPlayer from './commands/nextPlayer'
// import PreviousPlayer from './commands/prevPlayer'
// export const DefaultCommands = {
//   CreateContainer,
//   DrawUpToXCommand,
//   MoveCardToContainer,
//   NextPlayer,
//   PreviousPlayer
// }

import isClientPlaying from './conditions/isClientPlaying'
import isPlayersTurn from './conditions/isPlayersTurn'
export const Conditions = {
  isClientPlaying, isPlayersTurn
}

export { Container } from './container'
export { Deck } from './containers/deck'
export { Hand } from './containers/hand'
export { Pile } from './containers/pile'
export { Row } from './containers/row'
export { Spread } from './containers/spread'

export { Game } from './game'
export { Player } from './player'
import * as Presets from './presets'
export { Presets }
export { Table } from './table'

// import * as Reducers
export { Reducers } from './reducers/index'