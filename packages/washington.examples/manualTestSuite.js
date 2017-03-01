const washington = require('washington')

const add = x => y => x + y

const multiplication = x => y => x * y

const testSuite = [
  {
    description: '1 + 1 will be 2',
    test: () => add(1)(1),
    expectedValue: 2
  },

  {
    description: '3 + 2 will be 5',
    test: () => add(3)(2),
    expectedValue: 5
  },

  {
    description: '4 * 5 will be 20',
    test: () => multiply(4)(5),
    expectedValue: 20
  },

  {
    description: '4 * 5 will fail to be 25',
    test: () => multiplication(4)(5),
    expectedValue: 25
  },

  {
    description: 'the test is not defined yet'
  }
]

washington(testSuite)
