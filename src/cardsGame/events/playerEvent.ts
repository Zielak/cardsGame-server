
class PlayerEvent {
  constructor({ player, reporter, element, eventType }) {
    this.player = player
    this.reporter = reporter
    this.element = element
    this.eventType = eventType
  }
}

module.exports = PlayerEvent
