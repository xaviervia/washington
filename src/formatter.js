// Default formatter
// =================
var color      = require("cli-color")

module.exports = {

  // on success
  // ----------
  //
  // Logs to `console.info` in green and adds a victory hand
  success: function (example) {
    console.info(color.green(" ✌ " + example.message))
  },

  // on pending
  // ----------
  //
  // Logs to `console.warn` in yellow and adds writing hand
  pending: function (example) {
    console.warn(color.yellow(" ✍ " + example.message))
  },

  // on failure
  // ----------
  //
  // Logs to `console.error` in red and adds a left pointing hand
  failure: function (example) {
    console.error(
      color.red(" ☜ " + example.message + "\n ☜ " + example.error.stack))
  },

  // on complete
  // ----------
  //
  // Exits using the code
  complete: function (report, code) {
    var items = []
    if (report.failing().length > 0)
      items.push(color.red(report.failing().length + " failing"))
    if (report.pending().length > 0)
      items.push(color.yellow(report.pending().length + " pending"))
    if (report.successful().length > 0)
      items.push(color.green(report.successful().length + " successful"))
    
    console.log(items.join(" ∙ "))
    process.exit(code)
  }

}
