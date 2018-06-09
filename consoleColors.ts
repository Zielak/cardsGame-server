/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/

const colors = {
  info: '\x1b[46m\x1b[37m',
  warn: '\x1b[43m\x1b[30m',
  error: '\x1b[41m\x1b[37m',
}
const text = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
}
const suffix = {
  info: '\x1b[0m',
  warn: '\x1b[0m',
  error: '\x1b[0m',
}

const getPrefix = (method) => {
  return [
    colors[method],
    text[method],
    suffix[method],
  ]
}

function intercept(method) {
  const original = console[method]
  console[method] = function (...args) {
    args = [
      ...getPrefix(method),
      ...args,
      '\x1b[0m',
    ]
    original.apply(console, args)
  }
}
['info', 'warn', 'error'].forEach(intercept)

// console.log('Console Colors testing:')
// console.warn('Warning please.')
// console.info('Information comming!')
// console.error('THE WORLD IS GOING TO END')
