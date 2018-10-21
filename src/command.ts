import { GameState } from './gameState'
import { PlayerEvent } from './events/playerEvent'

export interface CommandConstructor {
  new(): Command;
}

export abstract class Command {

  context = {}

  private done = false
  private resolve: (reason: any) => void
  private reject: (reason: any) => void

  private _promise: IExecutable

  constructor() {
    this.prepareContext()
  }

  /**
   * To be overriden. Prepare your context here.
   */
  prepareContext() { }

  /**
   * Return a `Promise` to indicate that this action is async. Remember to call `this.finish()` or `this.fail()` to complete this action.
   * @param invoker client ID
   * @param state game state
   * @param event what player did on the table
   */
  abstract execute(invoker: string, state: GameState, event: PlayerEvent): void

  abstract undo(state: GameState): void | IExecutable

  executeFirstTime(invoker: string, state: GameState, event: PlayerEvent): IExecutable {
    return this._promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.execute(invoker, state, event)
    })
  }

  /**
   * Call this when you're done executing async action
   * @param data
   */
  finish(data?: any) {
    this.done = true
    this.resolve(data)
  }

  /**
   * Call this to indicate that this action failed to finish for somee `reason`
   * @param reason
   */
  fail(reason?: any) {
    this.done = true
    this.reject(reason)
  }

  get pending() {
    return !this.done
  }
}

export type IExecutable = Promise<string | {}>

export interface ICommand {
  context?: { [key: string]: any }
  prepareContext?: () => void
  execute: (invoker: string, state: GameState, event: PlayerEvent) => void
  undo: (state: GameState) => void | IExecutable
}

export interface IComandConstructor {
  new(): Command
}
