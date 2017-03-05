const {set, prop} = require('partial.lenses')
const {task} = require('folktale/data/task')
const {red, yellow, green} = require('./colors')

const id = x => x

const formatFailure = (description, {message, stack}) => [
  `%c ${description}
${message}
${stack.map(line => `  ${line}`).join('\n')}`, `color: ${red}`]

const formatPending = description => [`%c ${description}`, `color: ${yellow}`]

const formatSuccess = description => [`%c ${description}`, `color: ${green}`]

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
      resultList.map(({message}) => { console.log(...message) })

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
          message: `${totals.success} successful`
        },
        {
          total: totals.pending,
          message: `${totals.pending} pending`
        },
        {
          total: totals.failure,
          message: `${totals.failure} failing`
        }
      ].filter(({total}) => total > 0).map(({message}) => message).join(' • ')
      console.log(totalsToPrint)

      resolve(resultList)
    }))
