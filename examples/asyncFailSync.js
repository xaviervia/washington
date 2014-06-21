var washington = require("../washington")

washington("Fail sync, do async", function (done) {
  throw new Error("FAIL")
  setTimeout(done, 100)
})

washington.go()
