const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuite = require('washington.core/runSuite')
const formatterTerminalTest = require('./formatterTerminal.test')

runSuite(formatterTerminalTest)
  .map(checkSuiteResults)
  .run()
