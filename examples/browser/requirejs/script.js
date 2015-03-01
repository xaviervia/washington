define(function (require, exports, module) {
  var example = require("../../../washington")

  example.use({
    success: function (example) { console.log("%c ✌ " + example.message, "color: #00FF44") },
    pending: function (example) { console.warn("%c ✍ " + example.message, "color: #AAAA00") },
    failure: function (example) {
      console.error("%c ☞ " + example.message, "color: #DD0000")
      console.error(example.error) },
    complete: function (report) {
      console.log("Complete! " + report.successful().length + " successful, " +
                  report.pending().length + " pending and " +
                  report.failing().length + " failing")
    }
  })

  example("Just a simple passing example", function () {
    return 2 + 2 === 4
  })

  example("Something that is still pending")

  example("A simple failing example", function () {
    return 2 + 2 === 5 || Error("2 + 2 will not be 5, but what can one do")
  })

  example("Something asynchronous in here!", function (check) {
    setTimeout(function () {
      check(true)
    }, 1000)
  })

  example.go()
})
