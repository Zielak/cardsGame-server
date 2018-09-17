import Condition from './conditions/condition'
import { Command } from './command'

export type ActionDefinition = {
  command: Command
  interaction: any,
  conditions: Condition[]
}

export const defineAction = (command: Command, interaction: any, conditions: Condition[]): ActionDefinition => {
  return {
    command,
    interaction,
    conditions
  }
}
