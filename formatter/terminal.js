const {task} = require('folktale/data/task')
const {green, yellow, red} = require('chalk')
const {id, Left, Right} = require('zazen')

module.exports = ({message, result}) => task(({resolve}) => {
  const toPrint = result
    .match({
      Failure: () => red(message),
      Pending: () => yellow(message),
      Success: () => green(message)
    })
    .fold(id)

  console.log(toPrint)
  resolve()
})
