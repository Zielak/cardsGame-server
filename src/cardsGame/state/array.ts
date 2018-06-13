export const arrayManager = <T>(state: Array<T>) => {
  const manager = {
    add: (element) => {
      element.onUpdate = (me => manager.update(me))
      state.push(element)
    },
    remove: (element) => {
      state = state.filter(el => el !== element)
    },
    update: (element) => {
      const idx = state.indexOf(element)
      state[idx] = element
    },
  }
  return manager
}
