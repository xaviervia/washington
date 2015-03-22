// Plain formatter
// ===============
//
// Prints dots `.` for success, dashes `-` for pending, crosses `X` for failures
// and `O`s for dry run. Gives exit code as usual.
module.exports = {
  success: function () { process.stdout.write(".") },
  pending: function () { process.stdout.write("-") },
  failure: function () { process.stdout.write("X") },
  dry: function () { process.stdout.write("O") },
  complete: function (report, code) {
    process.stdout.write("\n")
    process.exit(code) }
}
