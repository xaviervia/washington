var example = require("washington")
var assert  = require("assert")

example("2 + 2 should be 5", function () {
  assert.equal(2 + 2, 5)
})

example.go()
