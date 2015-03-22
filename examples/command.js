var example = require("washington")

function greet(name) {
  return "Hello " + name + "!"
}

example("Lets greet Paulie", function (check) {
  check(greet("Paulie"), "Hello Paulie!")
})

module.exports = greet
