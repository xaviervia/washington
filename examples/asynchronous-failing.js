var example = require("washington")
var assert  = require("assert")

example("2 + 2 will not be 5", function (done) {
  var result = 2 + 2
  setTimeout(function () {
    try {
      assert.equal(result, 5)
      done()
    }
    catch(error) {
      done(error)
    }
  }, 100)
})

example.go()
