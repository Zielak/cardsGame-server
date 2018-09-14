import { Base } from './base'
// import { nonenumerable } from 'nonenumerable'
import { nosync } from 'colyseus'

export class EntityMap<T extends Base> {
  [entityId: string]: T | any

  @nosync
  add(el: T) {
    return this[el.id] = el
  }
  @nosync
  remove(el: T) {
    return delete this[el.id]
  }
  @nosync
  get length(): number {
    return Object.getOwnPropertyNames(this).length
  }
  /**
   * List may not be in order.
   * Remember to sort Base elements by their `order` value
   */
  @nosync
  get list(): T[] {
    return Object.getOwnPropertyNames(this).map(key => this[key])
  }
}

export class PrimitiveMap<T extends string | number> {
  [entityId: string]: T | any

  @nosync
  add(el: T) {
    return this[el] = el
  }
  @nosync
  remove(el: T) {
    return delete this[el]
  }
  @nosync
  get length(): number {
    return Object.getOwnPropertyNames(this).length
  }
  /**
   * List may not be in order.
   * Remember to sort Base elements by their `order` value
   */
  @nosync
  get list(): T[] {
    return Object.getOwnPropertyNames(this).map(key => this[key])
  }
}
