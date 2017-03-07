const formatterTerminal = require('washington.formatter.terminal')
const runSuite = require('washington.core')

const washington = (testSuite, options = {}) => {
  const suiteTask = runSuite(
    testSuite instanceof Array
      ? testSuite
      : [testSuite]
  )

  if (options.safe) {
    return suiteTask
  } else {
    return suiteTask
      .chain(formatterTerminal)
      .map(suiteResult => {
        // this could be a Task, but it's pointless, because it will quit anyway
        const failingExamples = resultArray
          .filter(example => example.result.type === 'failure')

        process.exit(failingExamples.length)
      })
  }
}

module.exports = washington
