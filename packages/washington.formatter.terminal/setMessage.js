const {set, prop} = require('partial.lenses')
const {id} = require('zazen')
const {characters} = require('../constants')

module.exports = example => set(
  prop('message'),
  example.result
    .match({
      Failure: () => `${characters.unicode.failure} ${example.description}
${characters.unicode.failure} ${example.result.fold(id).message}
${example.result.fold(id).stack.map(line => `  ${line}`).join('\n')}`,
      Pending: () => `${characters.unicode.pending} ${example.description}`,
      Success: () => `${characters.unicode.success} ${example.description}`
    })
    .fold(id),
  example
)
