var example = require("../washington")

example("Passive assert by false", function () {
  return false
})

example("Passive assert by string", function () {
  return "This is the reason for the failure"
})

example("Passive assert with error", function () {
  return Error("This is a proper error, propagated")
})

example("Passive assert that is correct with true", function () {
  return 2 + 2 === 4
})

example("Passive assert by false, async", function (done) {
  done(false)
})

example("Passive assert by string, async", function (done) {
  done("This is the reason for the failure")
})

example("Passive assert with error, async", function (done) {
  done(Error("This is a proper error, propagated"))
})

example("Passive assert that is correct with true, async", function (done) {
  done(2 + 2 === 4)
})

example.go()
