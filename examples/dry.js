var example = require("washington")

example('Example', function () { 10 })
example('Pending example')
example('Failing example', function () { assert(1 === 2) })
example('Async example', function () {})


example.go({
  dry: true
})
