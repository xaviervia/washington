var example = require("../washington")
var silentFormatter = require("../silent")

example.use(silentFormatter)

example("something something pending")

example("something successful", function () {})

example("something wrong", function (check) { check(false) })

example.go()
