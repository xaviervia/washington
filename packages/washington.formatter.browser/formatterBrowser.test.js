const Task = require('folktale/data/task')
const {green, red, yellow} = require('./colors')
const formatterBrowser = require('./')

const collectFourCalls = callback => {
  let calls = []
  return (...xs) => {
    calls.push(xs)
    if (calls.length === 4) {
      callback(calls)
    }
  }
}

module.exports = [
  {
    description: 'prints a colorful output',
    test: check => {
      const suiteResult = [
        {
          description: 'testing',
          result: {
            type: 'success'
          }
        },
        {
          description: 'to be ignored',
          result: {
            type: 'pending'
          }
        },
        {
          description: 'fails',
          result: {
            type: 'failure',
            message: 'assertion error',
            stack: ['something', 'multiline']
          }
        }
      ]

      formatterBrowser(collectFourCalls(check))(suiteResult).run()
    },
    shouldEqual: [
      ['%c testing', `color: ${green}`],
      ['%c to be ignored', `color: ${yellow}`],
      ['%c fails\nassertion error\n  something\n  multiline', `color: ${red}`],
      ['1 success • 1 pending • 1 failure']
    ]
  }
]
