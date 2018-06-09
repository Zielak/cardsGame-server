export class Command {

  context

  constructor(context = {}) {
    this.context = context
  }

  prepare() { }

  public execute(invoker, state, reducer) { }

  public undo(state, reducer) { }

}

