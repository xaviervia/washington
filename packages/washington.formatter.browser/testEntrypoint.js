const checkSuiteResults = require('washington.core/checkSuiteResults')
const runSuite = require('washington.core/runSuite')
const formatterBrowserTest = require('./formatterBrowser.test')

runSuite(formatterBrowserTest)
  .map(checkSuiteResults)
  .run()
