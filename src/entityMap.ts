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
  getByType(type: string): T[] {
    return this.list.filter(el => el.type === type)
  }
  /**
   * Name ought to be uniqe. This will return only one element
   * @param name
   */
  @nosync
  getByName(name: string): T {
    return this.list.find(el => el.name === name)
  }
  @nosync
  get length(): number {
    return Object.getOwnPropertyNames(this).length
  }
  /**
   * List must be in order
   * TODO: memoize, update on add/remove
   */
  @nosync
  get list(): T[] {
    return Object.getOwnPropertyNames(this)
      .map(key => this[key])
      .sort((a: T, b: T) => a.order - b.order)
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
   * Order doesn't matter here. Its a list of primitives...
   */
  @nosync
  get list(): T[] {
    return Object.getOwnPropertyNames(this).map(key => this[key])
  }
}
