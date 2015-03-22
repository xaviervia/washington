var example = require("washington")

function greet(name) {
  return "Hello " + name + "!"
}

example("Lets greet Paulie", function (check) {
  check(greet("Paulie"), "Hello Paulie!")
})

example("Lets wait for Thom")

example("I don't think Bert tried hard enough", function () { return false })

module.exports = greet
