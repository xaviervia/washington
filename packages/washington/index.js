const formatterTerminal = require('washington.formatter.terminal')
const runSuite = require('washington.core')
const dsl = require('washington.dsl')

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
      .chain(formatterTerminal(console.log))
      .map(suiteResult => {
        // this could be a Task, but it's pointless, because it will quit anyway
        const failingExamples = suiteResult
          .filter(example => example.result.type === 'failure')

        process.exit(failingExamples.length)
      })
      .run()
  }
}

module.exports = washington
module.exports.example = dsl.example
module.exports.suite = dsl.suite
