export default class ClientsManager {
  state: Array<string> = []
  add(client) {
    this.state.push(client)
  }
  remove(client) {
    this.state = this.state.filter(el => el !== client)
  }
  update(client) {
    const idx = this.state.indexOf(client)
    this.state[idx] = client
  }
  includes(client) {
    this.state.includes(client)
  }
  get length(): number {
    return this.state.length
  }
}
