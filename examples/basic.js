var example = require("washington")

example("2 + 2 should be 4", function (check) {
  check(2 + 2, 4)
})

example.go()
