const washington = require('washington')
const washingtonFormatterTAP = require('washington.formatter.tap')
const {example, suite} = washington

const add = x => y => x + y

const multiplication = x => y => x * y

const suiteTask = washington(suite(
  example('1 + 1 will be 2', () => add(1)(1), 2),

  example('3 + 2 will be 5', () => add(3)(2), 5),

  example('4 * 5 will be 20', () => multiply(4)(5), 20),

  example('4 * 5 will fail to be 25', () => multiplication(4)(5), 25),

  example('the test is not defined yet')
), {safe: true})

washingtonFormatterTAP(suiteTask).run()
