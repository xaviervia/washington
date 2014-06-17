var example = require("washington")
var assert  = require("assert")

example("2 + 2 will be 4", function (done) {
  var result = 2 + 2
  setTimeout(function () {
    try {
      assert.equal(result, 4)
      done()
    }
    catch(error) {
      done(error)
    }
  }, 100)
})

example.go()
