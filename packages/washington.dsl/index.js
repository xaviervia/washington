const suite = (name, ...suite) =>
  suite.map(x => ({...x, description: `${name}: ${x.description}`}))

const example = (description, test, shouldEqual) =>
  ({ description, test, shouldEqual })

module.exports.example = example
module.exports.suite = suite
