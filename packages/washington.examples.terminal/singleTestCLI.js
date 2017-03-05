const {example} = require('washington')

module.exports = example('1 + 2 is 3', check => check(1 + 2), 3)
