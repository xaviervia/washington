const {List} = require('immutable-ext')
const Task = require('folktale/data/task')
const {green, red, yellow} = require('chalk')
const {Success, Pending, Failure} = require('washington.core/data/status')
const formatterTerminal = require('./')

module.exports = [
  {
    description: 'success blob has description and expectedValue',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Success(),
          expectedValue: 2
        }
      ])

      formatterTerminal(Task.of(resultList))
        .map(resultJSON => {
          check(resultJSON)
        })
        .run()
    },
    expectedValue: [
      {
        status: 'success',
        description: 'testing',
        expectedValue: 2
      }
    ]
  },
  {
    description: 'pending blob has description',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Pending()
        }
      ])

      formatterTerminal(Task.of(resultList))
        .map(resultJSON => {
          check(resultJSON)
        })
        .run()
    },
    expectedValue: [
      {
        status: 'pending',
        description: 'testing'
      }
    ]
  },
  {
    description: 'failure blob has description, expectedValue, message and stack lines',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Failure({
            message: 'assertion error',
            stack: ['something', 'multiline']
          }),
          expectedValue: 3
        }
      ])

      formatterTerminal(Task.of(resultList))
        .map(resultJSON => {
          check(resultJSON)
        })
        .run()
    },
    expectedValue: [
      {
        status: 'failure',
        message: 'assertion error',
        stack: ['something', 'multiline'],
        description: 'testing',
        expectedValue: 3
      }
    ]
  }
]
