// Silent formatter
// ================
//
// All output is silenced. Only the exit code is forwarded.
module.exports = {
  complete: function (report, code) {
    process.exit(code)
  }
}
