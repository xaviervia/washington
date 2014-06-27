var example = require("../washington")
var assert  = require("assert")

var flag    = false

example("will set the flag to true", function (done) {
  setTimeout(function () {
    assert.equal(flag, false)
    flag = true
    done()
  }, 100)
})

example("the flag should be set to true", function (done) {
  setTimeout(function () {
    try {
      assert.equal(flag, true)
      done()
    }

    catch(error) {
      done(error)
    }
  }, 100)
})

example.go()
