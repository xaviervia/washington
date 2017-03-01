const {set, prop} = require('partial.lenses')
const {green, red, yellow, grey} = require('chalk')
const {task} = require('folktale/data/task')
const {unicode, ascii} = require('./characters')

const id = x => x
const characters = unicode

const formatFailure = (description, {message, stack}) =>
  red(`${characters.failure} ${description}
${characters.failure} ${message}
${stack.map(line => `  ${line}`).join('\n')}`)

const formatPending = description =>
  yellow(`${characters.pending} ${description}`)

const formatSuccess = description =>
  green(`${characters.success} ${description}`)

const setMessage = example => set(
  prop('message'),
  example.result
    .match({
      Failure: () => formatFailure(example.description, example.result.fold(id)),
      Pending: () => formatPending(example.description),
      Success: () => formatSuccess(example.description)
    })
    .fold(id),
  example
)

module.exports = suiteTask =>
  suiteTask
    .map(resultList => resultList.map(setMessage))
    .chain(resultList => task(({resolve}) => {
      resultList.map(({message}) => { console.log(message) })

      const totals = resultList
        .toJSON()
        .reduce(({success, failure, pending}, {result}) =>
          result.match({
            Failure: () => ({success, failure: failure + 1, pending}),
            Pending: () => ({success, failure, pending: pending + 1}),
            Success: () => ({success: success + 1, failure, pending})
          }).fold(x => x),
          {success: 0, failure: 0, pending: 0}
        )

      const totalsToPrint = [
        {
          total: totals.success,
          message: green(`${totals.success} ${characters.success}`)
        },
        {
          total: totals.pending,
          message: yellow(`${totals.pending} ${characters.pending}`)
        },
        {
          total: totals.failure,
          message: red(`${totals.failure} ${characters.failure}`)
        }
      ].filter(({total}) => total > 0).map(({message}) => message).join(grey(' • '))
      console.log(totalsToPrint)

      resolve(resultList)
    }))