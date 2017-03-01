const runSuite = require('./runSuite')

module.exports = [
  {
    description: 'runSuite: a successful test',
    test: () => {
      const result = runSuite([
        {
          description: '1 is 1',
          test: () => 1,
          expectedValue: 1
        }
      ])

      return {
        type: result[0].result['@@type'],
        description: result[0].description,
        expectedValue: result[0].expectedValue
      }
    },
    expectedValue: {
      type: 'Success',
      description: '1 is 1',
      expectedValue: 1
    }
  },

  {
    description: 'runSuite: a failing test (assertion error)',
    test: () => {
      const result = runSuite([
        {
          description: '1 will fail to be 2',
          test: () => 1,
          expectedValue: 2
        }
      ])

      return {
        type: result[0].result['@@type'],
        message: result[0].result['@@value'].message,
        description: result[0].description,
        expectedValue: result[0].expectedValue
      }
    },
    expectedValue: {
      type: 'Failure',
      message: '1 deepEqual 2',
      description: '1 will fail to be 2',
      expectedValue: 2
    }
  },

  {
    description: 'runSuite: a failing test (crashing)',
    test: () => {
      const result = runSuite([
        {
          description: 'there is no Narnia',
          test: () => { throw new Error('no Narnia') },
          expectedValue: 'Narnia?'
        }
      ])

      return {
        type: result[0].result['@@type'],
        message: result[0].result['@@value'].message,
        description: result[0].description,
        expectedValue: result[0].expectedValue
      }
    },
    expectedValue: {
      type: 'Failure',
      message: 'no Narnia',
      description: 'there is no Narnia',
      expectedValue: 'Narnia?'
    }
  },

  {
    description: 'runSuite: a pending test',
    test: () => {
      const result = runSuite([
        {
          description: 'buy milk'
        }
      ])

      return {
        type: result[0].result['@@type'],
        description: result[0].description
      }
    },
    expectedValue: {
      type: 'Pending',
      description: 'buy milk'
    }
  }
]
