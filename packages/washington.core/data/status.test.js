const {Pending, Failure, Success} = require('./status')

module.exports = [
  {
    description: 'Pending supports map',
    test: () => Pending(2).map(x => x + 2)['@@value'],
    expectedValue: 4
  },
  {
    description: 'Pending supports fold',
    test: () => Pending(3).fold(x => x),
    expectedValue: 3
  },
  {
    description: 'Pending supports match',
    test: () => Pending(4).match({Pending: x => x + 2})['@@value'],
    expectedValue: Pending(6)['@@value']
  },
  {
    description: 'Failure supports map',
    test: () => Failure(2).map(x => x + 2)['@@value'],
    expectedValue: 4
  },
  {
    description: 'Failure supports fold',
    test: () => Failure(3).fold(x => x),
    expectedValue: 3
  },
  {
    description: 'Failure supports match',
    test: () => Failure(4).match({Failure: x => x + 2})['@@value'],
    expectedValue: Failure(6)['@@value']
  },
  {
    description: 'Success supports map',
    test: () => Success(2).map(x => x + 2)['@@value'],
    expectedValue: 4
  },
  {
    description: 'Success supports fold',
    test: () => Success(3).fold(x => x),
    expectedValue: 3
  },
  {
    description: 'Success supports match',
    test: () => Success(4).match({Success: x => x + 2})['@@value'],
    expectedValue: Success(6)['@@value']
  }
]
