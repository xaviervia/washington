const {Pending, Failure, Success} = require('./status')

module.exports = [
  {
    it: 'Pending supports map',
    when: () => Pending(2).map(x => x + 2)['@@value'],
    shouldEqual: 4
  },
  {
    it: 'Pending supports fold',
    when: () => Pending(3).fold(x => x),
    shouldEqual: 3
  },
  {
    it: 'Pending supports match',
    when: () => Pending(4).match({Pending: x => x + 2})['@@value'],
    shouldEqual: Pending(6)['@@value']
  },
  {
    it: 'Failure supports map',
    when: () => Failure(2).map(x => x + 2)['@@value'],
    shouldEqual: 4
  },
  {
    it: 'Failure supports fold',
    when: () => Failure(3).fold(x => x),
    shouldEqual: 3
  },
  {
    it: 'Failure supports match',
    when: () => Failure(4).match({Failure: x => x + 2})['@@value'],
    shouldEqual: Failure(6)['@@value']
  },
  {
    it: 'Success supports map',
    when: () => Success(2).map(x => x + 2)['@@value'],
    shouldEqual: 4
  },
  {
    it: 'Success supports fold',
    when: () => Success(3).fold(x => x),
    shouldEqual: 3
  },
  {
    it: 'Success supports match',
    when: () => Success(4).match({Success: x => x + 2})['@@value'],
    shouldEqual: Success(6)['@@value']
  }
]
