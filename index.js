const {id, compose, match, Left, Right} = require('zazen')
const {List} = require('immutable-ext')
const Task = require('folktale/data/task')

const formatter = require('./formatter')
const runSuite = require('./src/runSuite')
const example = require('./src/helpers/example')
const suite = require('./src/helpers/suite')

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
