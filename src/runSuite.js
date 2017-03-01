const getTestResult = require('./getTestResult')
const setMessage = require('./setMessage')
const setStatus = require('./setStatus')

module.exports = suite =>
  suite
    .map(getTestResult)
    .map(setStatus)
    .map(setMessage)
