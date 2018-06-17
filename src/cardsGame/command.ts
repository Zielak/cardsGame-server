import Condition from './conditions/condition'
import { GameState } from './state'

export interface IContext { }

type IExecutable = Promise<string | {}> | void

export interface ICommand {
  prepareContext(): void
  execute(invoker: string, state: GameState): IExecutable
  undo(state: GameState): IExecutable
}

export class Command implements ICommand {

  conditions: Condition[]

  constructor(invoker: string, conditions?: Condition[]) {
    this.conditions = conditions
  }

  prepareContext() { }

  execute(invoker: string, state: GameState): IExecutable {
    return Promise.resolve(`empty execute()`)
  }
  undo(state: GameState): IExecutable {
    return Promise.resolve(`empty undo()`)
  }

}

