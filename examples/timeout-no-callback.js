var example = require("../washington")
var assert  = require("assert")

example("2 + 2 will be 4 but I forgot the callback", function (done) {
  var result = 2 + 2
  setTimeout(function () {
    try {
      return result === 4
    }
    catch(error) {
    }
  }, 100)
})

example.go()
