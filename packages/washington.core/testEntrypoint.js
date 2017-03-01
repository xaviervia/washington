const statusTest = require('./data/status.test')
const runSuiteTest = require('./runSuite.test')
const runSuite = require('./runSuite')

const result = runSuite(statusTest.concat(runSuiteTest))

// How many results did we get
console.log(`${result.length} tests`)

const failingExamples = result.filter(
  example => example.result['@@type'] === 'Failure'
)

// Let’s print the failing examples so we know what happened
failingExamples.forEach(example => {
  console.error(example.result['@@value'])
})

// Exiting with the amount of failing cases is a simple way of letting CI know that this test suite failed
process.exit(failingExamples.length)
