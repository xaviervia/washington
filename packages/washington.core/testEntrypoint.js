const statusTest = require('./data/status.test')
const runSuiteTaskTest = require('./runSuiteTask.test')
const checkSuiteResults = require('./checkSuiteResults')
const runSuiteTask = require('./runSuiteTask')

const tests = statusTest.concat(runSuiteTaskTest)

runSuiteTask(tests)
  .map(checkSuiteResults)
  .run()
