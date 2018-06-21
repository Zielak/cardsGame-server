export default class StateManager<T> {
  state: T[] = []
  add(element) {
    if (Object.isExtensible(element)) {
      element.onUpdate = (me => this.update(me))
    }
    this.state.push(element)
  }
  remove(element) {
    // TODO: first see if I found and am able to remove any element
    this.state = this.state.filter(el => el !== element)
  }
  update(element) {
    const idx = this.state.indexOf(element)
    this.state[idx] = element
  }

  map<U>(predicate: (value: T, index?: number, array?: T[]) => U): U[] {
    return this.state.map(predicate)
  }
  find(predicate: (value: T, index?: number, obj?: T[]) => boolean): T {
    return this.state.find(predicate)
  }
  filter(predicate: (value: T, index?: number, array?: T[]) => boolean): T[] {
    return this.state.filter(predicate)
  }
  includes(element: T, fromIndex?: number): boolean {
    return this.state.includes(element, fromIndex)
  }

  get length(): number { return this.state.length }
}
