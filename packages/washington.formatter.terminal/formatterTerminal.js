const {set, prop} = require('partial.lenses')
const {green, red, yellow} = require('chalk')
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

      resolve(resultList)
    }))
