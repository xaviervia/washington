const {set, prop} = require('partial.lenses')
const {List} = require('immutable-ext')
const Task = require('folktale/data/task')
const {deepEqual} = require('assert')

const {Failure, Pending, Success} = require('./data/status')

const id = x => x

const matchesExpectation = ({expectedValue}, result) => {
  try {
    deepEqual(result, expectedValue)
    return Success()
  } catch (e) {
    return Failure(e)
  }
}

const hackToEnsureUniqueNameDespiteUglification = {
  ensureUniqueWashingtonNameDespiteUglification: (example, callback) => {
    if (example.test == null) return callback(Pending())

    try {
      // Arity of 1 in the test indicates callback
      if (example.test.length === 1) {
        const thatHackAgain = {
          ensureUniqueWashingtonNameDespiteUglification: result =>
            callback(matchesExpectation(example, result))
        }

        example.test(
          thatHackAgain.ensureUniqueWashingtonNameDespiteUglification
        )
      } else {
        callback(
          matchesExpectation(example, example.test())
        )
      }
    } catch (e) {
      callback(Failure(e))
    }
  }
}

const getTestResult = example =>
  Task
    .task(({resolve}) => {
      hackToEnsureUniqueNameDespiteUglification
        .ensureUniqueWashingtonNameDespiteUglification(
          example,
          result => {
            resolve(set(
              prop('result'),
              result,
              example
            ))
          }
        )
    })
    .map(setStatus)

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
  List(suite)
    .traverse(Task.of, getTestResult)