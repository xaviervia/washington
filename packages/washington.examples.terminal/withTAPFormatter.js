const washington = require('washington')
const washingtonFormatterTAP = require('washington.formatter.tap')

const add = x => y => x + y

const multiplication = x => y => x * y

const suiteTask = washington([
  {
    description: 'returns 2 when adding 1 and 1',
    test: () => add(1)(1),
    shouldEqual: 2
  },

  {
    description: 'returns 3 + 2 will be 5',
    test: () => add(3)(2),
    shouldEqual: 5
  },

  {
    description: 'returns 20 when multiplying 4 by 5',
    test: () => multiply(4)(5),
    shouldEqual: 20
  },

  {
    description: 'does not return 25 when multiplying 4 by 5',
    test: () => multiplication(4)(5),
    shouldEqual: 25
  },

  {
    description: 'is not defined yet'
  }
], {safe: true})

suiteTask
  .chain(washingtonFormatterTAP(console.log))
  .run()
