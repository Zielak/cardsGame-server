
/**
 * Gets you random number in provided range
 */
const float = (min = 0, max = 1) => Math.floor(
  Math.random() * (max - min + 1) + min
)

const limit = (val, min = 0, max = 1) => val < min ? min : val > max ? max : val

/**
 * Returns `def` if the `value` really is undefined
 */
const def = (value, def) => typeof value !== 'undefined' ? value : def

/**
 * Check if the value exists
 */
const exists = (value) => typeof value !== 'undefined'

const noop = () => { }

const getElementById = (everything, id) => everything.find(el => el.id === id)

const getParent = (child, everything) => everything.filter(el => {
  return el && el.id === child.parent
})[0]

const arrayWithoutElement = (element, everything) => everything.filter(el => el.id !== element.id)

const findAllChildren = (parent, everything) => {
  return everything.filter(el => el.parent === parent.id)
}

const findAllParents = (child, everything) => {
  const result = []
  if (child.parent) {
    const newParent = getParent(child, everything)
    if (!newParent) {
      return result
    }
    result.unshift(newParent)
    if (newParent.parent) {
      result.unshift(...findAllParents(newParent, arrayWithoutElement(newParent, everything)))
    }
  }
  return result
}

const rad2deg = (angle) => {
  //  discuss at: http://locutus.io/php/rad2deg/
  // original by: Enrique Gonzalez
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: rad2deg(3.141592653589793)
  //   returns 1: 180
  return angle * 57.29577951308232 // angle / Math.PI * 180
}

const deg2rad = (angle) => {
  //  discuss at: http://locutus.io/php/deg2rad/
  // original by: Enrique Gonzalez
  // improved by: Thomas Grainger (http://graingert.co.uk)
  //   example 1: deg2rad(45)
  //   returns 1: 0.7853981633974483
  return angle * 0.017453292519943295 // (angle / 180) * Math.PI;
}

const string2bytes = (str) => {
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    // You can combine both these calls into one,
    // bytes.push(char >>> 8, char & 0xff);
    bytes.push(char >>> 8)
    bytes.push(char & 0xFF)
  }
  return bytes
}

const procNumberFromString = (str, min = 0, max = 1) => {
  const bytes = string2bytes(str).filter(value => value !== 0)
  const bMin = bytes.reduce((prev, curr) => {
    return curr < prev ? curr : prev
  }, bytes[0])
  const bMax = bytes.reduce((prev, curr) => {
    return curr > prev ? curr : prev
  }, bytes[0])

  const result = bytes.reduce((prev, curr, idx) => {
    const even = idx % 2 === 0 ? -1 : 1
    const change = curr / 5 * even
    let output = prev + change
    if (output < bMin) {
      output = bMin + (prev - Math.abs(change))
    } else if (output > bMax) {
      output = bMax - (prev - Math.abs(change))
    }
    return limit(output, bMin, bMax)
  }, Math.abs(bMax - bMin) / 2 + bMin)

  const percent = (result - bMin) / Math.abs(bMax - bMin) * Math.abs(min - max) - Math.abs(min)
  return percent
}

const appendIdx = (object, idx) => ({ ...object, idx })

module.exports = {
  float,
  limit,
  def,
  exists,
  noop,
  getElementById,
  getParent,
  arrayWithoutElement,
  findAllParents,
  findAllChildren,
  rad2deg,
  deg2rad,
  string2bytes,
  procNumberFromString,
  appendIdx,
}
