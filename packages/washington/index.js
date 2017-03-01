const {List} = require('immutable-ext')
const Task = require('folktale/data/task')

const formatter = require('./formatter')
const runSuite = require('washington.core/runSuite')
const example = require('./example')
const suite = require('./suite')

const getEnvironmentFormatter = () => {
  try {
    const getWindow = window.document
    return formatter.browser
  } catch (e) {
    return formatter.terminal
  }
}

const washington = (testSuite, safe = false, formatter) => {
  const runResult = runSuite(testSuite)

  if (safe) {
    return runResult
  } else {
    const format = formatter || getEnvironmentFormatter()
    List(runResult.reverse())
      .traverse(Task.of, format)
      .run()
  }
}

washington.example = example
washington.suite = suite

module.exports = washington
