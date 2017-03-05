const {List} = require('immutable-ext')
const Task = require('folktale/data/task')
const {green, red, yellow} = require('./colors')
const {Success, Pending, Failure} = require('washington.core/data/status')
const formatterBrowser = require('./')

module.exports = [
  {
    description: 'success is green',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Success()
        },
        {
          description: 'to be ignored',
          result: Pending()
        }
      ])

      formatterBrowser(Task.of(resultList))
        .map(resultList => {
          const resultArray = resultList.toJSON()

          check(resultArray[0].message)
        })
        .run()
    },
    expectedValue: ['%c testing', `color: ${green}`]
  },
  {
    description: 'pending is yellow',
    test: check => {
      const resultList = List([
        {
          description: 'testing',
          result: Pending()
        }
      ])

      formatterBrowser(Task.of(resultList))
        .map(resultList => {
          const resultArray = resultList.toJSON()

          check(resultArray[0].message)
        })
        .run()
    },
    expectedValue: ['%c testing', `color: ${yellow}`]
  },
  {
    description: 'failure is red',
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

      formatterBrowser(Task.of(resultList))
        .map(resultList => {
          const resultArray = resultList.toJSON()

          check(resultArray[0].message)
        })
        .run()
    },
    expectedValue: [`%c testing
assertion error
  something
  multiline`, `color: ${red}`]
  }
]
