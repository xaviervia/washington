const {set, prop} = require('partial.lenses')
const {Failure, Pending, Success} = require('../data/status')

const matchesExpectation = ({expectedValue}) => result =>
  expectedValue !== result
    ? Failure({
      message: 'Assertion error: doesn’t match expectation',
      stack:
`expected: ${expectedValue}
got: ${result}`
    })
    : Success()

const hackToEnsureUniqueNameDespiteUglification = {
  ensureUniqueWashingtonNameDespiteUglification: scenario => {
    if (scenario.test == null) return Pending()

    try {
      return matchesExpectation(scenario)(scenario.test())
    } catch (e) {
      return Failure(e)
    }
  }
}

module.exports = scenario =>
  set(
    prop('result'),
    hackToEnsureUniqueNameDespiteUglification
      .ensureUniqueWashingtonNameDespiteUglification(scenario),
    scenario
  )
