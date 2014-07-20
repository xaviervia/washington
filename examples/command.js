var example = require("washington")
var assert  = require("assert")

function greet(name) {
  return "Hello " + name + "!"
}

example("Lets greet Paulie", function () {
  assert.equal(greet("Paulie"), "Hello Paulie!")
})

module.exports = greet
