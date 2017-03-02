const {set, prop} = require('partial.lenses')
const {task} = require('folktale/data/task')

const id = x => x

const setMessage = example =>
  example.result
    .match({
      Failure: () => ({
        status: 'failure',
        description: example.description,
        expectedValue: example.expectedValue,
        message: example.result.fold(id).message,
        stack: example.result.fold(id).stack
      }),
      Pending: () => ({
        status: 'pending',
        description: example.description
      }),
      Success: () => ({
        status: 'success',
        description: example.description,
        expectedValue: example.expectedValue
      })
    })
    .fold(id)

module.exports = suiteTask =>
  suiteTask
    .map(resultList => resultList.toJSON().map(setMessage))
