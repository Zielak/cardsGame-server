import { Base } from '../base'
import { TextDecoder } from 'util'

export default class StateManager<T extends Base> {
  // state: { [key: string]: T } = {}
  state: T[]

  add(element: T) {
    if (Object.isExtensible(element)) {
      element.onUpdate = (me => this.update(me))
    }
    this.state[element.id] = element
  }
  remove(element) {
    delete this.state[element.id]
  }
  update(element) {
    // TODO: maybe for each prop do the thing?
    this.state[element.id] = element
  }

  map(predicate: (value: T, index?: number/*, array?: T[]*/) => T): T[] {
    let i = 0
    const arr: T[] = []
    for (let key in this.state) {
      predicate(this.state[key], i)
      arr.push(this.state[key])
      i++
    }
    return arr
  }
  forEach(predicate: (value: T, index?: number, array?: T[]) => T): void {
    let i = 0
    for (let key in this.state) {
      predicate(this.state[key], i)
      i++
    }
  }
  find(predicate: (value: T, index?: number/*, arr?: T[]*/) => boolean): T {
    let i = 0
    for (let key in this.state) {
      if (predicate(this.state[key], i)) {
        return this.state[key]
      }
      i++
    }
  }
  filter(predicate: (value: T, index?: number/*, array?: T[]*/) => boolean): T[] {
    let i = 0
    const arr: T[] = []
    for (let key in this.state) {
      if (predicate(this.state[key], i)) {
        arr.push(this.state[key])
      }
      i++
    }
    return arr
  }
  includes(element: T/*, fromIndex?: number*/): boolean {
    for (let key in this.state) {
      if (this.state.key === element) {
        return true
      }
    }
    return false
  }

  get length(): number { return Object.keys(this.state).length }
}
