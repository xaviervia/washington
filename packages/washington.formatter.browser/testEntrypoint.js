const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuiteTask = require('washington.core/runSuiteTask')
const formatterBrowserTest = require('./formatterBrowser.test')

runSuiteTask(formatterBrowserTest)
  .map(checkSuiteResults)
  .run()
