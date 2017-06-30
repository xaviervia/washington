const {set, prop} = require('partial.lenses')
const {task} = require('folktale/concurrency/task')

const setMessage = example => set(
  prop('message'),
  (() => {
    switch (example.result.type) {
      case 'failure':
        return `not ok - ${example.description}`

      case 'pending':
        return `ok - ${example.description} # pending`

      case 'success':
        return `ok - ${example.description}`
    }
  })(),
  example
)

module.exports = logger => suiteResult =>
  task(({resolve}) => {
    const exampleMessages = suiteResult
      .map(setMessage)
      .map(({message}) => message)

    const content = [
      'TAP version 13',
      `1..${suiteResult.length}`,
    ]

    logger(content.concat(exampleMessages).join('\n'))

    resolve(suiteResult)
  })
