import washington from 'washington'
import washingtonFormatterBrowser from 'washington.formatter.browser'

const suiteTask = washington(
  [
    {
      description: '1 + 2 is 3',
      test: check => check(1 + 2),
      shouldEqual: 3
    },
    {
      description: '2 + 2 is 4',
      test: check => check(2 + 2),
      shouldEqual: 4
    },
    {
      description: '2 + notDefined.number gives runtime error',
      test: check => check(2 + ({}).notDefined.number),
      shouldEqual: 4
    },
    {
      description: '2 + 2 will not be 6',
      test: check => check(2 + 2),
      shouldEqual: 6
    },
    {
      description: '2 + 2 will not get milk for me'
    }
  ],
  {
    safe: true
  }
)

suiteTask
  .chain(washingtonFormatterBrowser(console.log))
  .run()
