var example = require("../washington")

example("Will work eventually", function (done) {
  "Hey hey"
})

example.on("promise", function (promise, report) {
  console.log("I have been promised that it " + promise.original.message)
})

example.go()
