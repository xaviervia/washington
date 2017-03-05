const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuite = require('washington.core/runSuite')
const formatterTAPTest = require('./formatterJSON.test')

runSuite(formatterTAPTest)
  .map(checkSuiteResults)
  .run()
