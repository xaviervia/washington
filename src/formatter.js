// Default formatter
// =================
//
"use strict";

var RED        = "\u001b[31m"
var GREEN      = "\u001b[32m"
var YELLOW     = "\u001b[33m"
var CLEAR      = "\u001b[0m"
var GREY       = "\u001b[30m"

module.exports = {

  exampleRunRegexp: /at Example\.run \(.+?washington\/src\/example\.js:\d+:\d+\)/,

  // on success
  // ----------
  //
  // Logs to `console.info` in green and adds a victory hand
  //
  success: function (example) {
    console.info(
      "%s ✌ %s%s%s (%dms)%s",
      GREEN, example.message, CLEAR, GREY, example.duration(), CLEAR )
  },

  // on pending
  // ----------
  //
  // Logs to `console.warn` in yellow and adds writing hand
  //
  pending: function (example) {
    console.warn(
      "%s ✍ %s%s",
      YELLOW, example.message, CLEAR )
  },

  // on failure
  // ----------
  //
  // Logs to `console.error` in red and adds a left pointing hand
  //
  failure: function (example) {
    var stack = []
    var stop = false
    var index = 0
    var baseStack = example.error.stack.split("\n")

    while ( !stop && index < baseStack.length) {
      if (!baseStack[index].match(this.exampleRunRegexp))
        stack.push(baseStack[index])
      else stop = true

      index ++
    }

    console.error(
      "%s ☞ %s%s%s (%dms)%s%s\n ☞ %s%s",
      RED, example.message, CLEAR, GREY, example.duration(),
      CLEAR, RED, stack.join("\n"), CLEAR )
  },

  // on dry
  // ------
  //
  // Logs to `console.warn` whether no examples were selected or no examples
  // were found
  //
  dry: function (example) {
    console.warn(
      "%s ☂ %s%s",
      GREY, example.message, CLEAR )
  },

  // on empty
  // --------
  //
  // Logs to `console.warn` whether no examples were selected or no examples
  // were found
  //
  empty: function (options) {
    console.warn(
      "%s ∅ No examples %s%s",
      GREY, (Object.keys(options).length == 0 ? "found" : "selected"), CLEAR )
  },

  // on complete
  // ----------
  //
  // Exits using the code
  //
  complete: function (report, code) {
    var items = []
    if (report.failing().length > 0)
      items.push(RED + report.failing().length + " failing" + CLEAR)
    if (report.pending().length > 0)
      items.push(YELLOW + report.pending().length + " pending" + CLEAR)
    if (report.successful().length > 0)
      items.push(GREEN + report.successful().length + " successful" + CLEAR)

    var log = items.join(" ∙ ")
    if (report.duration() > 0)
      log += GREY + " (" + report.duration() + "ms)" + CLEAR

    if (items.length > 0)
      console.log(log)
    process.exit(code)
  }

}
