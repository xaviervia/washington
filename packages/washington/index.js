const formatterTerminal = require('washington.formatter.terminal')
// const formatterBrowser = require('washington.formatter.browser')
const runSuite = require('washington.core')
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

const washington = (testSuite, safe = false) => {
  const suiteTask = runSuite(
    testSuite instanceof Array
      ? testSuite
      : [testSuite]
  )

  if (safe) {
    return suiteTask
  } else {
    formatterTerminal(suiteTask).run()
  }
}

washington.example = example
washington.suite = suite

module.exports = washington
