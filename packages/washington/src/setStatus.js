const {set, prop} = require('partial.lenses')
const {id} = require('zazen')

const cleanStackTrace = stackTraceString =>
  stackTraceString
    .split('\n')
    .map(line => line.trim())
    .reduce(
      (accumulator, line) =>
        line.indexOf('ensureUniqueWashingtonNameDespiteUglification') !== -1
          ? set(prop('stop'), true, accumulator)
          : (
            accumulator.stop
              ? accumulator
              : set(prop('lines'), accumulator.lines.concat(line), accumulator)
          ),
      {lines: [], stop: false}
    )
    .lines

module.exports = example => set(
  prop('result'),
  example.result
    .match({
      Failure: error => ({
        message: error.message,
        stack: cleanStackTrace(error.stack),
        original: error
      }),
      Success: id,
      Pending: id
    }),
  example
)
