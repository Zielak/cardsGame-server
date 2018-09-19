import Condition from './condition'
import { PlayerEvent } from '../events/playerEvent'
import { Base } from '../base'

const isOwner: Condition = (invoker, state, event: PlayerEvent) => new Promise((resolve, reject) => {
  const player = state.getPlayerByClientId(invoker)
  if (!player) {
    reject(`Couldn't find this client in players list`)
  }
  const target = Base.get(event.eventTarget)
  if (target.owner !== player) {
    reject(`Player is not owner of given element`)
  }

  resolve()
})

export default isOwner
