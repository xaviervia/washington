const {id, compose, match, Left, Right} = require('zazen')
const {get, prop, set} = require('partial.lenses')
const {List} = require('immutable-ext')
const Task = require('folktale/data/task')

const {characters} = require('./constants')
const formatter = require('./formatter')
const getTestResult = require('./src/getTestResult')

const cleanStackTrace = stackTraceString =>
  stackTraceString
    .split('\n')
    .map(line => line.trim())
    .reduce(
      (accumulator, line) =>
        line.indexOf('ensureUniqueWashingtonNameDespiteUglification') !== -1
          ? set(prop('stop'), true, accumulator)
          : (
            accumulator.stop
              ? accumulator
              : set(prop('lines'), accumulator.lines.concat(line), accumulator)
          ),
      {lines: [], stop: false}
    )
    .lines

const setStatus = test => set(
  prop('result'),
  test.result
    .match({
      Failure: error => ({
        message: error.message,
        stack: cleanStackTrace(error.stack),
        original: error
      }),
      Success: id,
      Pending: id
    }),
  test
)

const setMessage = test => set(
  prop('message'),
  test.result
    .match({
      Failure: () => `${characters.unicode.failure} ${test.description}
${characters.unicode.failure} ${test.result.fold(id).message}
${test.result.fold(id).stack.map(line => `  ${line}`).join('\n')}`,
      Pending: () => `${characters.unicode.pending} ${test.description}`,
      Success: () => `${characters.unicode.success} ${test.description}`
    })
    .fold(id),
  test
)

const getEnvironmentFormatter = () => {
  try {
    const getWindow = window.document
    return formatter.browser
  } catch (e) {
    return formatter.terminal
  }
}

const washington = (testSuite, safe = false, formatter) => {
  const runResult = testSuite
    .map(getTestResult)
    .map(setStatus)
    .map(setMessage)

  if (safe) {
    return runResult
  } else {
    const format = formatter || getEnvironmentFormatter()
    List(runResult.reverse())
      .traverse(Task.of, format)
      .run()
  }
}

module.exports = washington
