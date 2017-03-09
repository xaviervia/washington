const {task} = require('folktale/data/task')
const runSuiteTask = require('./runSuiteTask')

module.exports = [
  {
    description: 'runSuiteTask: a successful test',
    test: check => {
      runSuiteTask([
        {
          description: '1 is 1',
          test: () => 1,
          shouldEqual: 1
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            description: suiteResult[0].description,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'success',
      description: '1 is 1',
      shouldEqual: 1
    }
  },

  {
    description: 'runSuiteTask: a failing test (assertion error)',
    test: check => {
      runSuiteTask([
        {
          description: '1 will fail to be 2',
          test: () => 1,
          shouldEqual: 2
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            message: suiteResult[0].result.message,
            description: suiteResult[0].description,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'failure',
      message: '1 deepEqual 2',
      description: '1 will fail to be 2',
      shouldEqual: 2
    }
  },

  {
    description: 'runSuiteTask: a failing test (crashing)',
    test: check => {
      runSuiteTask([
        {
          description: 'there is no Narnia',
          test: () => { throw new Error('no Narnia') },
          shouldEqual: 'Narnia?'
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            message: suiteResult[0].result.message,
            description: suiteResult[0].description,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'failure',
      message: 'no Narnia',
      description: 'there is no Narnia',
      shouldEqual: 'Narnia?'
    }
  },

  {
    description: 'runSuiteTask: a pending test',
    test: check => {
      runSuiteTask([
        {
          description: 'buy milk'
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            description: suiteResult[0].description
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'pending',
      description: 'buy milk'
    }
  },

  {
    description: 'runSuiteTask: an async test',
    test: check => {
      runSuiteTask([
        {
          description: 'buy milk in a while',
          test: check => setTimeout(() => check('milk')),
          shouldEqual: 'milk'
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            description: suiteResult[0].description,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'success',
      description: 'buy milk in a while',
      shouldEqual: 'milk'
    }
  }
]
