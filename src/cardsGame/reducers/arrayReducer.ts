const createArrayReducer = (targetArray) => {
  const reducer = {
    add: (state, element) => {
      element.onUpdate = me => reducer.update(state, me)
      state[targetArray].push(element)
    },
    remove: (state, element) => {
      state[targetArray] = state[targetArray].filter(el => el !== element)
    },
    update: (state, element) => {
      const idx = state[targetArray].indexOf(element)
      state[targetArray][idx] = element
    },
  }
  return reducer
}

module.exports = createArrayReducer
