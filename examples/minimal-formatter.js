var example = require("washington")
var assert  = require("assert")
var color   = require("cli-color")

example.use({
  success: function (success, report) {
    process.stdout.write(color.green("."))
  },

  pending: function (pending, report) {
    process.stdout.write(color.yellow("-"))
  },

  failure: function (failure, report) {
    process.stdout.write(color.red("X"))
  },

  complete: function (report, code) {
    process.exit(code)
  }
})

example("Good", function () {
  assert.equal(1, 1)
})

example("Pending")

example("Bad", function () {
  assert.equal(1, 2)
})

example.go()
