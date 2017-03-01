const formatterTerminal = require('washington.formatter.terminal')
// const formatterBrowser = require('washington.formatter.browser')
const runSuite = require('washington.core')
const example = require('./example')
const suite = require('./suite')

const washington = (testSuite, safe = false) => {
  const suiteTask = runSuite(
    testSuite instanceof Array
      ? testSuite
      : [testSuite]
  )

  if (safe) {
    return suiteTask
  } else {
    formatterTerminal(suiteTask)
      .map(resultList => {
        const resultArray = resultList.toJSON()

        const failingExamples = resultArray.filter(example => example.result['@@type'] === 'Failure')

        process.exit(failingExamples.length)
      })
      .run()
  }
}

washington.example = example
washington.suite = suite

module.exports = washington
