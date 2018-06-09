export const toArray = (element) => {
  return !Array.isArray(element) ? [element] : [...element]
}
