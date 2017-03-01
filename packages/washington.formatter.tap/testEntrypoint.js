const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuite = require('washington.core/runSuite')
const formatterTAPTest = require('./formatterTAP.test')

runSuite(formatterTAPTest)
  .map(checkSuiteResults)
  .run()
