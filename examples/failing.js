var example = require("washington")

example("2 + 2 should be 5", function (done) {
  done(2 + 2, 5)
})

example.go()
