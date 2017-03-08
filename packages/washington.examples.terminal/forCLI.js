const add = x => y => x + y

const multiplication = x => y => x * y

module.exports = [
  {
    it: 'returns 2 when adding 1 and 1',
    when: () => add(1)(1),
    shouldEqual: 2
  },

  {
    it: 'returns 3 + 2 will be 5',
    when: () => add(3)(2),
    shouldEqual: 5
  },

  {
    it: 'returns 20 when multiplying 4 by 5',
    when: () => multiply(4)(5),
    shouldEqual: 20
  },

  {
    it: 'does not return 25 when multiplying 4 by 5',
    when: () => multiplication(4)(5),
    shouldEqual: 25
  },

  {
    it: 'is not defined yet'
  }
]
