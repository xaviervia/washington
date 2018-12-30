const {bold, green, grey, red, yellow} = require('chalk')
const formatterTerminal = require('./')

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

      formatterTerminal(check)(suiteResult).run()
    },
    shouldEqual:
      green('testing') + '\n' +
      yellow('to be ignored') + '\n' +
      red('fails') + '\n' + bold(red('assertion error')) + '\n' + grey('  something\n  multiline') + '\n' +
      '\n' +
      '\n' +
      green('1 successful') +
      grey(' • ') +
      yellow('1 pending') +
      grey(' • ') +
      red('1 failing')
  }
]
