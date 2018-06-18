import { DefaultCommands, Command } from '../../cardsGame'
import GameStartCommand from './gameStart'
import PlayCardCommand from './playCard'
import DrawUpToThree from './drawUpToThree'
import TestDeal from './testDeal'

const actionsMap = new Map<string, typeof Command>()

actionsMap.set('GameStart', GameStartCommand)
actionsMap.set('PlayCard', PlayCardCommand)
actionsMap.set('NextPlayer', DefaultCommands.NextPlayer)
actionsMap.set('PrevPlayer', DefaultCommands.PreviousPlayer)
actionsMap.set('DrawUpToThree', DrawUpToThree)
actionsMap.set('TestDeal', TestDeal)

export default actionsMap
