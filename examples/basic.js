var example = require("washington")
var assert  = require("assert")

example("2 + 2 should be 4", function () {
  assert.equal(2 + 2, 4)
})

example.go()
