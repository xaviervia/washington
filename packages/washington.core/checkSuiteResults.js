module.exports = result => {
  const resultArray = result.toJSON()

  // How many results did we get
  console.log(`${resultArray.length} tests`)

  const failingExamples = resultArray.filter(
    example => example.result['@@type'] === 'Failure'
  )

  // Let’s print the failing examples so we know what happened
  failingExamples.forEach(example => {
    console.error(example.result['@@value'])
  })

  // Exiting with the amount of failing cases is a simple way of letting CI know that this test suite failed
  process.exit(failingExamples.length)
}
