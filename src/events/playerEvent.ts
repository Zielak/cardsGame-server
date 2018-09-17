export type PlayerEvent = {
  // invoker: string       // clientID is already in onMessage method
  eventType: string     // most likely 'click'
  eventTarget?: string  // ID of target element
  data?: any            // additional/optional data
}
