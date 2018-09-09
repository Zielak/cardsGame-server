import { Conditions, DefaultCommands } from '../../../'

export default class DrawUpToThree extends DefaultCommands.DrawUpToXCommand {

  constructor() {
    super({ maxCards: 3 }, [Conditions.isPlayersTurn, Conditions.isClientPlaying])
  }

}
