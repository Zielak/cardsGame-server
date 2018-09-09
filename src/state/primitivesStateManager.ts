
export default class PrimitivesStateManager<T> {
  state: Set<T>

  add(element: T) {
    return this.state.add(element)
  }
  remove(element: T) {
    return this.state.delete(element)
  }

  get _array() {
    const arr = []
    this.state.forEach(el => arr.push(arr))
    return arr
  }

  get filter() {
    return this._array.filter
  }
  get find() {
    return this._array.find
  }
  get forEach() {
    return this._array.forEach
  }
  get map() {
    return this._array.map
  }
  get some() {
    return this._array.some
  }

  get entries() {
    return this.state.entries()
  }
  get size() {
    return this.state.size
  }
}
