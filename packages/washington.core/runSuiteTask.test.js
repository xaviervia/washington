const {task} = require('folktale/data/task')
const runSuiteTask = require('./runSuiteTask')

module.exports = [
  {
    it: 'runSuiteTask: a successful test',
    when: check => {
      runSuiteTask([
        {
          it: '1 is 1',
          when: () => 1,
          shouldEqual: 1
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            it: suiteResult[0].it,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'success',
      it: '1 is 1',
      shouldEqual: 1
    }
  },

  {
    it: 'runSuiteTask: a failing test (assertion error)',
    when: check => {
      runSuiteTask([
        {
          it: '1 will fail to be 2',
          when: () => 1,
          shouldEqual: 2
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            message: suiteResult[0].result.message,
            it: suiteResult[0].it,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'failure',
      message: '1 deepEqual 2',
      it: '1 will fail to be 2',
      shouldEqual: 2
    }
  },

  {
    it: 'runSuiteTask: a failing test (crashing)',
    when: check => {
      runSuiteTask([
        {
          it: 'there is no Narnia',
          when: () => { throw new Error('no Narnia') },
          shouldEqual: 'Narnia?'
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            message: suiteResult[0].result.message,
            it: suiteResult[0].it,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'failure',
      message: 'no Narnia',
      it: 'there is no Narnia',
      shouldEqual: 'Narnia?'
    }
  },

  {
    it: 'runSuiteTask: a pending test',
    when: check => {
      runSuiteTask([
        {
          it: 'buy milk'
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            it: suiteResult[0].it
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'pending',
      it: 'buy milk'
    }
  },

  {
    it: 'runSuiteTask: an async test',
    when: check => {
      runSuiteTask([
        {
          it: 'buy milk in a while',
          when: check => setTimeout(() => check('milk')),
          shouldEqual: 'milk'
        }
      ])
        .chain(suiteResult => task(({resolve}) => {
          check({
            type: suiteResult[0].result.type,
            it: suiteResult[0].it,
            shouldEqual: suiteResult[0].shouldEqual
          })

          resolve()
        }))
        .run()
    },
    shouldEqual: {
      type: 'success',
      it: 'buy milk in a while',
      shouldEqual: 'milk'
    }
  }
]
