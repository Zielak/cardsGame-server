import { Base } from './base'
// import { nonenumerable } from 'nonenumerable'
import { nosync } from 'colyseus'

export class EntityMap {
  [entityId: string]: Base | any

  @nosync
  add(el: Base) {
    return this[el.id] = el
  }
  @nosync
  remove(el: Base) {
    return delete this[el.id]
  }
  @nosync
  getByType<T extends Base>(type: string): T[] {
    return this.list<T>().filter(el => el.type === type)
  }
  @nosync
  getByName<T extends Base>(name: string): T[] {
    return this.list<T>().filter(el => el.name === name)
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
  list<T extends Base>(): T[] {
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
