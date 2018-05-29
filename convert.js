const fs = require('fs')
const flow = require('lodash/fp/flow')
const get = require('lodash/fp/get')
const isEqual = require('lodash/fp/isEqual')
const negate = require('lodash/fp/negate')
const attempt = require('lodash/fp/attempt')
const isError = require('lodash/fp/isError')
const map = require('lodash/fp/map').convert({'cap': false})
const join = require('lodash/fp/join')
const last = require('lodash/fp/last')

const isLengthNot3 = flow(get('length'), negate(isEqual(3)))

const getArgsOrError = (args) => {
  if (isLengthNot3(args)) {
    throw new Error('illegal number of arguments')
  } 
  return args
}

const toString = flow(
  map((value, key) => {
    return `${key}=${value}`
  }),
  join("\n")
);

const printVarsOrError = (content) => {
  if (isError(content)) {
    process.stderr.write(
      `error: ${content.message}\nusage: npm run -s convert path/to/file\n`
    )
  } else {
    process.stdout.write(`${content}\n`)
  }
}

printVarsOrError(
  attempt(
    flow(
      () => { return process.argv },
      getArgsOrError, 
      last,
      fs.readFileSync, 
      JSON.parse,
      toString
    )
  )
)
