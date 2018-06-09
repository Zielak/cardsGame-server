export class PlayerEvent {
  player
  reporter
  element
  eventType

  constructor({ player, reporter, element, eventType }) {
    this.player = player
    this.reporter = reporter
    this.element = element
    this.eventType = eventType
  }
}
