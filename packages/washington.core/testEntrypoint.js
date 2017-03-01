const statusTest = require('./data/status.test')
const runSuiteTest = require('./runSuite.test')
const checkSuiteResults = require('./checkSuiteResults')
const runSuite = require('./runSuite')

const tests = statusTest.concat(runSuiteTest)

runSuite(tests)
  .map(checkSuiteResults)
  .run()
