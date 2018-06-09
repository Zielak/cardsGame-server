import Container from '../container'

class Spread extends Container {

  constructor(options = {}) {
    super({
      ...options,
      type: options.type || 'spread',
    })
  }

}

module.exports = Spread
