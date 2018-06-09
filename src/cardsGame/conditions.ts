import { Base } from './base'

/**
 * Each Card or Container in game should have a set of consitions
 * Conditions define how the game plays during player's round
 */

export default class Conditions extends Map {

  context

  constructor(set = [], context = null) {
    super()
    Object.keys(set).forEach(key => {
      this.set(key, set[key])
    })

    this.context = context !== null ? context.id : null
  }

  check(key, args = undefined) {
    if (this.has(key) && typeof this.get(key) === 'function') {
      return this.get(key).apply(Base.get(this.context), args)
    } else {
      throw new Error(`There's no valid condition called ${key}.`)
    }
  }

}
