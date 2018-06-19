import { DefaultCommands, Command, ICommand, IComandConstructor } from '../../cardsGame'
import GameStartCommand from './gameStart'
import PlayCardCommand from './playCard'
import DrawUpToThree from './drawUpToThree'
import TestDeal from './testDeal'

const actions: {[key:string] : Command } = {}

actions.GameStart = new GameStartCommand()
actions.PlayCard = new PlayCardCommand()
actions.NextPlayer = new DefaultCommands.NextPlayer()
actions.PrevPlayer = new DefaultCommands.PreviousPlayer()
actions.DrawUpToThree = new DrawUpToThree()
actions.TestDeal = new TestDeal()

export default actions
