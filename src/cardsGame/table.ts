import { def } from './utils'

/**
 * Table is where all the containers and cards are laid out.
 * Table defines the dimensions of our playground and limits.
 * It's origin point is always rendered in the middle of the screen.
 * On server we don't know anything about user's screen,
 * so we're not going to assume the dimensions.
 */

export class Table {

  width
  height
  x
  y

  constructor({ width, height }) {
    this.width = def(width, 55)
    this.height = def(height, 55)
    this.x = 0
    this.y = 0
  }

}
