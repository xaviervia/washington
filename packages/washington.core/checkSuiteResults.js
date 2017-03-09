module.exports = suiteResult => {
  // How many results did we get
  console.log(`${suiteResult.length} tests`)

  const failingExamples = suiteResult.filter(
    example => example.result.type === 'failure'
  )

  // Let’s print the failing examples so we know what happened
  failingExamples.forEach(example => {
    console.error(example.result)
  })

  // Exiting with the amount of failing cases is a simple way of letting CI know that this test suite failed
  process.exit(failingExamples.length)
}
