export type PlayerEvent = {
  invoker: string       // clientID
  eventType: string     // most likely 'click'
  eventTarget?: string  // ID of target element
  data?: any            // additional/optional data
}
