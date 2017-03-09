const {set, prop} = require('partial.lenses')
const {task} = require('folktale/data/task')
const {red, yellow, green} = require('./colors')

const formatFailure = (description, {message, stack}) => [
  `%c ${description}
${message}
${stack.map(line => `  ${line}`).join('\n')}`, `color: ${red}`]

const formatPending = description => [`%c ${description}`, `color: ${yellow}`]

const formatSuccess = description => [`%c ${description}`, `color: ${green}`]

const setMessage = example => set(
  prop('message'),
  (() => {
    switch (example.result.type) {
      case 'failure':
        return formatFailure(example.description, example.result)

      case 'pending':
        return formatPending(example.description)

      case 'success':
        return formatSuccess(example.description)
    }
  })(),
  example
)

module.exports = logger => suiteResult =>
  task(({resolve}) => {
    suiteResult
      .map(setMessage)
      .map(({message}) => { logger(...message) })

    const totals = suiteResult
      .reduce(({success, failure, pending}, {result: {type}}) => {
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

    const totalsToPrint = `${totals.success} success • ${totals.pending} pending • ${totals.failure} failure`
    logger(totalsToPrint)

    resolve(suiteResult)
  })
