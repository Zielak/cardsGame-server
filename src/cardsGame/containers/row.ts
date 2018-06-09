import Container from '../container'

class Row extends Container {

  constructor(options = {}) {
    super({
      ...options,
      type: options.type || 'row',
    })
  }

}

module.exports = Row
