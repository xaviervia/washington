const {List} = require('immutable-ext')
const Task = require('folktale/data/task')
const {green, red, yellow} = require('chalk')
const {Success, Pending, Failure} = require('washington.core/data/status')
const formatterTerminal = require('./')

module.exports = [
  {
    description: 'success is green and has a ✌',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Success()
        }
      ])

      formatterTerminal(Task.of(resultList))
        .map(resultList => {
          const resultArray = resultList.toJSON()

          check(resultArray[0].message)
        })
        .run()
    },
    expectedValue: green('✌ testing')
  },
  {
    description: 'pending is yellow and has a ✍',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Pending()
        }
      ])

      formatterTerminal(Task.of(resultList))
        .map(resultList => {
          const resultArray = resultList.toJSON()

          check(resultArray[0].message)
        })
        .run()
    },
    expectedValue: yellow('✍ testing')
  },
  {
    description: 'failure is red and has a ☞',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Failure({
            message: 'assertion error',
            stack: ['something', 'multiline']
          })
        }
      ])

      formatterTerminal(Task.of(resultList))
        .map(resultList => {
          const resultArray = resultList.toJSON()

          check(resultArray[0].message)
        })
        .run()
    },
    expectedValue: red(`☞ testing
☞ assertion error
  something
  multiline`)
  }
]
