export default class StateManager {
  state: any[] = []
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

  map(predicate) {
    return this.state.map(predicate)
  }
  filter(predicate) {
    return this.state.filter(predicate)
  }
  includes(element, fromIndex?) {
    return this.state.includes(element, fromIndex)
  }
  get length(): number {
    return this.state.length
  }
}
