var example = require("washington")

example("2 + 2 will be 4", function (done) {
  var result = 2 + 2
  setTimeout(function () {
    try {
      done(result, 4)
    }
    catch(error) {
      done(error)
    }
  }, 100)
})

example.go()
