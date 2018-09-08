
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

  get find() {
    return this._array.find
  }
  get map() {
    return this._array.map
  }
  get filter() {
    return this._array.filter
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
