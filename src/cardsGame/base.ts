import uuid from 'uuid/v4'
import utils from '../../shared/utils'
import { EventEmitter } from 'eventemitter3'
import { nosync } from 'colyseus'

const objects = new Map()

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

  id: string
  type: string | undefined
  name: string | undefined
  parentId: string | null

  width: number
  height: number

  children: Array<string>

  onUpdate: Function


  constructor(options: IBaseOptions) {
    super()
    this.id = uuid()

    // Store a reference to itself by ID
    objects.set(this.id, this)

    this.type = utils.def(options.type, undefined)
    this.name = utils.def(options.name, undefined)

    // DEPRECATE: unused in client code.
    // Real-life size (in CM) and position
    // this._local = {
    //   x: utils.def(options.x, 0),
    //   y: utils.def(options.y, 0),
    //   angle: utils.def(options.angle, 0),
    // }
    this.width = utils.def(options.width, 5)
    this.height = utils.def(options.height, 5)

    // List of children ID's
    this.children = []

    this.onUpdate = utils.def(options.onUpdate || utils.noop)

    // ParentID, no object reference
    // console.info('typeof options.parentId === '+typeof options.parentId)
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
   * @memberof Base
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
   *
   * @return {object}
   */
  top() {
    return Base.get(this.children[this.children.length - 1])
  }

  /**
   * Gives you an element from the bottom
   *
   * @return {object}
   */
  bottom() {
    return Base.get(this.children[0])
  }

  /**
   * Move this element to a different `parent`.
   * addChild method ensures that both new and old parents are
   * updated with the change.
   *
   * @param {any|string} newParent
   * @returns this
   * @memberof Base
   */
  moveTo(newParent) {
    if (typeof newParent === 'string') {
      newParent = Base.get(newParent)
    }
    newParent.addChild(this)
    return this
  }

  /**
   * Adds new child to this element, ensuring that its last parent
   * knows about this change.
   *
   * @param {any|string} element reference to an object or its ID
   * @returns this
   * @memberof Base
   */
  addChild(element) {
    const child = typeof element === 'string' ? Base.get(element) : element

    // Notify element's last parent of change
    const lastParent = Base.get(child.parentId)
    if (lastParent) {
      // this.emit('child.removes', this.id)
      lastParent.removeChild(child)
    }

    // Change child's parent element
    child.parentId = this.id

    // Add to this list
    this.children.push(child.id)
    child.onUpdate(child)
    this.onUpdate(this)
    return this
  }

  /**
   * Removes one child
   *
   * @param {any|string} element reference to an object or its ID
   * @returns this
   * @memberof Base
   */
  removeChild(element) {
    const child = typeof element === 'string' ? Base.get(element) : element

    if (!child) {
      throw new ReferenceError(`couldn't find that chid: ${child}`)
    }

    // Confirm it's my child
    if (!this.children.some(id => id === child.id)) {
      return this
    }

    // Nullify its parent
    child.parentId = null

    this.children = this.children.filter(id => id !== child.id)
    this.onUpdate(this)
    child.onUpdate(child)
    return this
  }

  filterByName(/*name*/) { }

  /**
   * Get every child of a certain type
   *
   * @param {string} type what kind of elements do you want
   * @param {boolean} [deep=true] deep search?
   * @returns {Array<object>} list of found elements
   * @memberof Base
   */
  getAllByType(type, deep = true) {
    const nested: Array<object> = []
    const found = this.children
      .map(Base.toObject)
      .filter(el => {
        if (deep && el.children.length > 1) {
          nested.push(...el.getAllByType(type))
        }
        return el.type === type
      })
    return [...found, ...nested]
  }

  /**
   * Get only one child of a certain type
   * Order or lookup is not defined
   * (you should be certain that there's only one element of that type)
   *
   * @param {string} type
   * @returns {pbject}
   * @memberof Base
   */
  getByType(type) {
    return this.getAllByType(type, false)[0]
  }

  /**
   * Get a reference to the object by its ID
   *
   * @static
   * @param {string} id
   * @returns {any}
   * @memberof Base
   */
  static get(id) {
    return objects.get(id)
  }

  /**
   * Maps an ID to object reference
   *
   * @static
   * @param {any} element preferably string ID
   * @returns {object}
   * @memberof Base
   */
  static toObject(element) {
    return typeof element === 'string' ? Base.get(element) : element
  }

  /**
   * Only for testing. Do not use while playing
   *
   * @static
   * @memberof Base
   */
  static _clear() {
    objects.clear()
  }

  static events = {
    TEST: 'test'
  }
}

// Get rid of EventEmitter stuff from the client
nosync(Base.prototype, '_events')
nosync(Base.prototype, '_eventsCount')
nosync(Base.prototype, '_maxListeners')
nosync(Base.prototype, 'domain')

nosync(Base.prototype, 'onUpdate')
