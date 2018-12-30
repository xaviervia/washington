const {set, prop} = require('partial.lenses')
const {bold, green, red, yellow, grey} = require('chalk')
const {task} = require('folktale/concurrency/task')
const {inspect} = require('util')

const spaceEm = value => {
  const inspection = inspect(
    value, 
    {sorted: true, depth: 5, colors: true, breakLength: 120}
  ).split('\n')
  
  return inspection.length > 1
    ? inspection.map((line, index) => index === 0 ? line : `  ${line}`).join('\n')
    : inspection
}
  

const setMessage = example => set(
  prop('message'),
  (() => {
    switch (example.result.type) {
      case 'failure': {
        if (example.result.original === undefined || example.result.original.shouldEqual === undefined) {
          return `${red(example.description)}
${bold(red(example.result.message))}
${grey(example.result.stack.map(line => `  ${line}`).join('\n'))}
`          
        } else {
          return `${red(example.description)}
  ${grey('expect:')} ${spaceEm(example.result.original.shouldEqual)}
  ${grey('result:')} ${spaceEm(example.result.original.result)}
`
        }
      }

      case 'pending':
        return yellow(`${example.description}`)

      case 'success':
        return green(`${example.description}`)
    }
  })(),
  example
)

module.exports = logger => suiteResult =>
  task(({resolve}) => {
    const exampleMessages = suiteResult
      .map(setMessage)
      .map(({message}) => message)

    const totals = suiteResult
      .reduce(
        ({success, failure, pending}, {result: {type}}) => {
          switch (type) {
            case 'failure':
              return {success, failure: failure + 1, pending}

            case 'pending':
              return {success, failure, pending: pending + 1}

            case 'success':
              return {success: success + 1, failure, pending}
          }
        },
        {success: 0, failure: 0, pending: 0}
      )

    const totalsToPrint = [
      [totals.success, green(`${totals.success} successful`)],
      [totals.pending, yellow(`${totals.pending} pending`)],
      [totals.failure, red(`${totals.failure} failing`)]
    ]

    logger(
      exampleMessages
        .concat([
          '',
          totalsToPrint
            .filter(([total]) => total > 0)
            .map(([_, message]) => message)
            .join(grey(' • '))
        ])
        .join('\n')
    )

    resolve(suiteResult)
  })
