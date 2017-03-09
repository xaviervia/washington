const formatterTAP = require('./')

module.exports = [
  {
    description: 'prints a valid TAP output',
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

      formatterTAP(check)(suiteResult).run()
    },
    shouldEqual: `TAP version 13
1..3
ok - testing
ok - to be ignored # pending
not ok - fails`
  }
]
