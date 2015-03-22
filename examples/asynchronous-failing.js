var example = require("washington")

example("2 + 2 will not be 5", function (done) {
  var result = 2 + 2
  setTimeout(function () {
    try {
      done(result, 5)
    }
    catch(error) {
      done(error)
    }
  }, 100)
})

example.go()
