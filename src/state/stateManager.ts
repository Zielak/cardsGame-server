import { Base, BaseObjectID } from '../base'

export default class StateManager<T extends Base> {
  state: Map<BaseObjectID, T>

  add(element: T) {
    if (Object.isExtensible(element)) {
      element.onUpdate = (me => this.update(me))
    }
    return this.state.set(element.id, element)
  }
  remove(element: T) {
    return this.state.delete(element.id)
  }
  update(element) {
    return this.state.set(element.id, element)
  }

  get _array() {
    const arr = []
    this.state.forEach(el => arr.push(arr))
    return arr
  }

  get find() {
    return this._array.find
  }
  get map() {
    return this._array.map
  }
  get filter() {
    return this._array.filter
  }

  get values() {
    return this.state.values()
  }
  get size() {
    return this.state.size
  }
}
