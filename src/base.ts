import uuid from 'uuid/v4'
import { def, noop } from './utils'
import { EventEmitter } from 'eventemitter3'
import { nosync } from 'colyseus'
import { PrimitiveMap } from './entityMap'

const objects = new Map<string, Base>()

export interface IBaseOptions {
  type?: string
  name?: string
  width?: number
  height?: number
  x?: number
  y?: number
  onUpdate?: Function
  parentId?: string
}

export abstract class Base extends EventEmitter {

  id: BaseObjectID
  type: string
  name: string
  order: number = -1
  parentId: string | null

  width: number
  height: number

  // List of children's IDs
  children = new PrimitiveMap<BaseObjectID>()

  @nosync
  onUpdate: Function


  constructor(options: IBaseOptions = {}) {
    super()
    this.id = uuid()

    // Store a reference to itself by ID
    objects.set(this.id, this)

    this.type = def(options.type, Base.TYPE_NAME)
    this.name = def(options.name, 'BaseObject')

    // Real-life size (in CM) and position
    this.width = def(options.width, 5)
    this.height = def(options.height, 5)

    this.onUpdate = def(options.onUpdate, noop)

    // ParentID, no object reference
    this.parentId = typeof options.parentId === 'string' ? options.parentId : null

    // Add myself to my new parent element
    if (options.parentId !== null) {
      const parent = Base.get(options.parentId)
      parent && parent.addChild(this.id)
    }

    this.startListeningForEvents()
  }

  /**
   * Get the real owner of this container, by traversing `this.parent` chain.
   *
   * @readonly
   * @return {Player|null} `Player` or `null` if this container doesn't belong to anyone
   */
  get owner() {
    if (typeof this.parentId === 'string') {
      return Base.get(this.parentId)
    } else if (this.parentId === null) {
      return null
    } else {
      return Base.get(this.parentId).owner
    }
  }

  startListeningForEvents() {
    this.on('child.removed', child => this.removeChild(child))
    // this.on('child.added')
  }

  /**
   * Gives you the topmost element in this container
   */
  get top() {
    return Base.get(
      this.children.list.map(Base.get).reduce((prev, current) => {
        return prev.order > current.order ? prev : current
      }).id
    )
  }

  /**
   * Gives you an element from the bottom
   */
  get bottom() {
    return Base.get(
      this.children.list.map(Base.get).reduce((prev, current) => {
        return prev.order < current.order ? prev : current
      }).id
    )
  }

  /**
   * Move this element to a different `parent`.
   * addChild method ensures that both new and old parents are
   * updated with the change.
   *
   * @param {Base|string} newParent
   * @returns this
   */
  moveTo(newParent: Base | string) {
    let targetElement: Base
    if (typeof newParent === 'string') {
      targetElement = Base.get(newParent)
    } else {
      targetElement = newParent
    }
    targetElement.addChild(this)
    return this
  }

  /**
   * Adds new child to this element, ensuring that its last parent
   * knows about this change.
   *
   * @param {any|string} element reference to an object or its ID
   */
  addChild(element: Base | string, order?: number) {
    const child: Base = typeof element === 'string' ? Base.get(element) : element

    // Notify element's last parent of change
    const lastParent = Base.get(child.parentId)
    if (lastParent) {
      // this.emit('child.removes', this.id)
      lastParent.removeChild(child)
    }

    // Change child's parent element
    child.parentId = this.id

    // Make new item get on top of the stack
    child.order = typeof order === 'number' ? order : this.children.length

    // Add to this list
    this.children.add(child.id)
    this.keepChildrensOrder()
    child.onUpdate(child)
    this.onUpdate(this)
    return this
  }

  /**
   * Removes one child
   *
   * @param {any|string} element reference to an object or its ID
   * @returns this
   */
  removeChild(element) {
    const child = typeof element === 'string' ? Base.get(element) : element

    if (!child) {
      throw new ReferenceError(`couldn't find that chid: ${child}`)
    }

    // Confirm it's my child
    if (!this.children.list.some(id => id === child.id)) {
      return this
    }

    // Nullify its parent
    child.parentId = null

    this.children.remove(child.id)
    this.keepChildrensOrder()
    this.onUpdate(this)
    child.onUpdate(child)
    return this
  }

  /**
   * March through all the children and keep them in order
   * 0, 1, 2, 3 ... n
   * There should be no gaps,
   * There should be no duplicates
   */
  keepChildrensOrder() {
    const children = this.children.list.map(Base.get).sort((a, b) => a.order - b.order)
    children.forEach((el, idx) => {
      if (el.order !== idx) {
        el.order = idx
      }
    })
  }

  /**
   * Get every child of a certain type
   *
   * @param {string} type what kind of elements do you want
   * @param {boolean} [deep=true] deep search?
   * @returns {Array<Base>} list of found elements
   */
  getAllByType(type: string, deep = true): Base[] {
    const nested: Base[] = []
    const found = this.children.list
      .map(Base.toObject)
      .filter(el => {
        if (deep && el.children.length > 1) {
          nested.push(...el.getAllByType(type))
        }
        return el.type === type
      })
    const retArray = [...found, ...nested]
    return retArray
  }

  getAllByClass(expectedClass: typeof Base, deep = true) {
    const nested: Base[] = []
    const found = this.children
      .map(Base.toObject)
      .filter(el => {
        if (deep && el.children.length > 1) {
          nested.push(...el.getAllByClass(expectedClass))
        }
        return typeof el === typeof expectedClass
      })
    const retArray = [...found, ...nested]
    return retArray
  }

  /**
   * Get only one child of a certain type
   * Order or lookup is not defined
   * (you should be certain that there's only one element of that type)
   */
  getByType(type: string): Base {
    const ret = this.getAllByType(type, false)[0]
    return ret
  }

  // getByClass<T>(cls: T): T {
  //   return
  // }

  /**
   * Get a reference to the object by its ID
   */
  static get<T extends Base>(id: BaseObjectID): T {
    return <T>objects.get(id)
  }

  /**
   * Maps an ID to object reference
   */
  static toObject(element: string | Base) {
    return typeof element === 'string' ? Base.get(element) : element
  }

  /**
   * Only for unit testing. Do not use while playing.
   */
  static _clear() {
    objects.clear()
  }

  static events = {
    TEST: 'test'
  }

  static TYPE_NAME = 'base'
}

// Get rid of EventEmitter stuff from the client
nosync(Base.prototype, '_events')
nosync(Base.prototype, '_eventsCount')
nosync(Base.prototype, '_maxListeners')
nosync(Base.prototype, 'domain')

// nosync(Base.prototype, 'onUpdate')

export type BaseObjectID = string
