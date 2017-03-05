import washington, {example, suite} from 'washington'
import washingtonFormatterBrowser from 'washington.formatter.browser'

const suiteTask = washington(
  suite(
    example('1 + 2 is 3', check => check(1 + 2), 3),
    example('2 + 2 is 4', check => check(2 + 2), 4),
    example('2 + notDefined.number gives runtime error', check => check(2 + ({}).notDefined.number), 4),
    example('2 + 2 will not be 6', check => check(2 + 2), 6),
    example('2 + 2 will not get milk for me')
  ),
  {
    safe: true
  }
)

washingtonFormatterBrowser(suiteTask).run()
