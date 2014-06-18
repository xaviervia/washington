var example = require("washington")
var assert  = require("assert")

example("2 + 2 will be 4 but the done will never fire", function (done) {
  var result = 2 + 2
  setTimeout(function () {
    try {
      assert.equal(result, 4)
    }
    catch(error) {
      done(error)
    }
  }, 100)
})

example.go()
