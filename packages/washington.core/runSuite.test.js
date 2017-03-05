const runSuite = require('./runSuite')

module.exports = [
  {
    description: 'runSuite: a successful test',
    test: check => {
      runSuite([
        {
          description: '1 is 1',
          test: () => 1,
          expectedValue: 1
        }
      ])
        .map(resultList => {
          const result = resultList.toJSON()
          check({
            type: result[0].result['@@type'],
            description: result[0].description,
            expectedValue: result[0].expectedValue
          })
        })
        .run()
    },
    expectedValue: {
      type: 'Success',
      description: '1 is 1',
      expectedValue: 1
    }
  },

  {
    description: 'runSuite: a failing test (assertion error)',
    test: check => {
      runSuite([
        {
          description: '1 will fail to be 2',
          test: () => 1,
          expectedValue: 2
        }
      ])
        .map(resultArray => {
          const result = resultArray.toJSON()
          check({
            type: result[0].result['@@type'],
            message: result[0].result['@@value'].message,
            description: result[0].description,
            expectedValue: result[0].expectedValue
          })
        })
        .run()
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
    test: check => {
      runSuite([
        {
          description: 'there is no Narnia',
          test: () => { throw new Error('no Narnia') },
          expectedValue: 'Narnia?'
        }
      ])
        .map(resultArray => {
          const result = resultArray.toJSON()
          check({
            type: result[0].result['@@type'],
            message: result[0].result['@@value'].message,
            description: result[0].description,
            expectedValue: result[0].expectedValue
          })
        })
        .run()
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
    test: check => {
      runSuite([
        {
          description: 'buy milk'
        }
      ])
        .map(resultArray => {
          const result = resultArray.toJSON()
          check({
            type: result[0].result['@@type'],
            description: result[0].description
          })
        })
        .run()
    },
    expectedValue: {
      type: 'Pending',
      description: 'buy milk'
    }
  },

  {
    description: 'runSuite: an async test',
    test: check => {
      runSuite([
        {
          description: 'buy milk in a while',
          test: check => setTimeout(() => check('milk')),
          expectedValue: 'milk'
        }
      ])
        .map(resultArray => {
          const result = resultArray.toJSON()
          check({
            type: result[0].result['@@type'],
            description: result[0].description,
            expectedValue: result[0].expectedValue
          })
        })
        .run()
    },
    expectedValue: {
      type: 'Success',
      description: 'buy milk in a while',
      expectedValue: 'milk'
    }
  }
]
