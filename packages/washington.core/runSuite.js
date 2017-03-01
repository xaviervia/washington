const {id} = require('zazen')
const {set, prop} = require('partial.lenses')
const {Failure, Pending, Success} = require('./data/status')
const {deepEqual} = require('assert')

const matchesExpectation = ({expectedValue}) => result => {
  try {
    deepEqual(result, expectedValue)

    return Success()
  } catch (e) {
    return Failure(e)
  }
}

const hackToEnsureUniqueNameDespiteUglification = {
  ensureUniqueWashingtonNameDespiteUglification: example => {
    if (example.test == null) return Pending()

    try {
      return matchesExpectation(example)(example.test())
    } catch (e) {
      return Failure(e)
    }
  }
}

const getTestResult = example =>
  set(
    prop('result'),
    hackToEnsureUniqueNameDespiteUglification
      .ensureUniqueWashingtonNameDespiteUglification(example),
    example
  )

const cleanStackTrace = stackTraceString =>
  stackTraceString
    .split('\n')
    .map(line => line.trim())
    .reduce(
      (accumulator, line) => {
        if (line.indexOf('ensureUniqueWashingtonNameDespiteUglification') !== -1) {
          return set(prop('stop'), true, accumulator)
        } else if (accumulator.stop) {
          return accumulator
        } else {
          return set(prop('lines'), accumulator.lines.concat(line), accumulator)
        }
      },
      {lines: [], stop: false}
    )
    .lines

const setStatus = example => set(
  prop('result'),
  example.result
    .match({
      Failure: error => ({
        message: error.message,
        stack: cleanStackTrace(error.stack),
        original: error
      }),
      Success: id,
      Pending: id
    }),
  example
)

module.exports = suite =>
  suite
    .map(getTestResult)
    .map(setStatus)
