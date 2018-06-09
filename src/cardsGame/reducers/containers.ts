const containersReducer = {
  add: (state, container) => {
    container.onUpdate = me => containersReducer.update(state, me)
    state.containers.push(container)
  },
  remove: (state, container) => {
    state.containers = state.containers.filter(el => el !== container)
  },
  update: (state, container) => {
    state.containers.forEach((element, idx) => {
      if (element.id === container.id) {
        for (const key in container) {
          state.containers[idx][key] = container[key]
        }
      }
    })
  },
  addElement: (state, container, element) => {
    console.log('add element ', element)
    const cont = state.containers.find(el => el.id === container.id)
    cont.addChild(element)
  }
}

module.exports = containersReducer
