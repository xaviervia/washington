const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuiteTask = require('washington.core/runSuiteTask')
const indexTest = require('./index.test')

runSuiteTask(indexTest)
  .map(checkSuiteResults)
  .run()
