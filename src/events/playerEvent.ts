import { Base } from '../base'

export type PlayerEventRaw = {
  // invoker: string       // clientID is already in onMessage method
  eventType: string     // most likely 'click'
  eventTarget?: string  // ID of target element
  data?: any            // additional/optional data
}

export type PlayerEvent = {
  eventType: string
  target?: Base
  details: {
    name?: string | string[]
    type?: string | string[]
    value?: number | number[]
    rank?: string | string[]
    suit?: string | string[]
  }
  data?: any
}

export type InteractionDefinition = {
  eventType?: string
  name?: string | string[]
  type?: string | string[]
  value?: number | number[]
  rank?: string | string[]
  suit?: string | string[]
}

export enum InteractionType {

}
