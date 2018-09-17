import Condition from './condition'
import { Base } from '../base'

const isOwner: Condition = (invoker, state, data: Base) => new Promise((resolve, reject) => {
  const player = state.getPlayerByClientId(invoker)
  if (!player) {
    reject(`Couldn't find this client in players list`)
  }

  if (data.owner !== player) {
    reject(`Player is not owner of given element`)
  }

  resolve()
})

export default isOwner
