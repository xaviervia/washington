const washington = require('washington')

const add = x => y => x + y

const multiplication = x => y => x * y

const testSuite = [
  {
    it: '1 + 1 will be 2',
    when: () => add(1)(1),
    shouldEqual: 2
  },

  {
    it: '3 + 2 will be 5',
    when: () => add(3)(2),
    shouldEqual: 5
  },

  {
    it: '4 * 5 will be 20',
    when: () => multiply(4)(5),
    shouldEqual: 20
  },

  {
    it: '4 * 5 will fail to be 25',
    when: () => multiplication(4)(5),
    shouldEqual: 25
  },

  {
    it: 'the test is not defined yet'
  }
]

washington(testSuite)
