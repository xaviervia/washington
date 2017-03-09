const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuiteTask = require('washington.core/runSuiteTask')
const formatterTAPTest = require('./formatterTAP.test')

runSuiteTask(formatterTAPTest)
  .map(checkSuiteResults)
  .run()
