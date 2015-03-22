var example = require("washington")

var RED        = "\u001b[31m"
var GREEN      = "\u001b[32m"
var YELLOW     = "\u001b[33m"
var CLEAR      = "\u001b[0m"

example.use({
  success: function (success, report) {
    process.stdout.write(GREEN + "." + CLEAR)
  },

  pending: function (pending, report) {
    process.stdout.write(YELLOW + "-" + CLEAR)
  },

  failure: function (failure, report) {
    process.stdout.write(RED + "X" + CLEAR)
  },

  complete: function (report, code) {
    process.exit(code)
  }
})

example("Good", function (compare) {
  compare(1, 1)
})

example("Pending")

example("Bad", function (compare) {
  compare(1, 2)
})

example.go()
