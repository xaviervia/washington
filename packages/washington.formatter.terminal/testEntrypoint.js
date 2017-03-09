const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuiteTask = require('washington.core/runSuiteTask')
const formatterTerminalTest = require('./formatterTerminal.test')

runSuiteTask(formatterTerminalTest)
  .map(checkSuiteResults)
  .run()
