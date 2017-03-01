const {task} = require('folktale/data/task')

module.exports = test => task(({resolve}) => {
  console.log(test.message)
  resolve()
})
