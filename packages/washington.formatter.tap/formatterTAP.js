const {set, prop} = require('partial.lenses')
const {task} = require('folktale/data/task')

const id = x => x

const formatFailure = description => `not ok - ${description}`

const formatPending = description => `ok - ${description} # pending`

const formatSuccess = description => `ok - ${description}`

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
      console.log('TAP version 13')
      console.log(`1..${resultList.toJSON().length}`)
      resultList.map(({message}) => { console.log(message) })

      resolve(resultList)
    }))
