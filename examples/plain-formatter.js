var example = require("../washington")
var plainFormatter = require("../plain")

example.use(plainFormatter)

example("success", function () {})
example("pending")
example("failure", function () { return false })

example.go()
