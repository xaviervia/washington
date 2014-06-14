// Washington
// ==========
//
// > Little George sets a good example
//
// Example library for TDD/BDD in Node.js.
// Very small. Much concise.
//
// - No assertions. Use `assert`
// - Stupidly simple async support
// - Programmatically usable report (`washington.report.failures().length`)
//
// Installation
// ------------
//
// ```
// npm install washington
// ```
//
// Usage
// -----
//
// ```javascript
// var example = require("washington")
// var assert  = require("assert")
//
// example("2 + 2 should be 4", function () {
//   assert.equal(2 + 2, 4)
// })
//
// // Shouldn't it be event driven? Of course it should
// example.on("complete", function (report, code) {
//   // High level log with standard formatter
//   report.log()
//
//   // Use the exit code to propagate failures
//   process.exit(code)
// })
//
// example.go()
// ```
//
// #### Arguments
//
"use strict"

var Washington = function (message, func) {

  //! Washington is being instantiated
  if (this instanceof Washington) {

    //! Assign the properties
    this.message  = message
    this.function = func

    //! Add the example to the list
    Washington.list = Washington.list || []
    Washington.list.push(this)

  }

  //! Washington is being called as a function
  else

    //! So we should return a new instance
    return new Washington(message, func)

}

//
// #### Events
//
// ##### `complete`
//
// Fires whenever the full report is ready.
//
// **Arguments for callback:**
//
// - `Washington.Report` report
// - `Integer` exitCode
//
// **Sample:**
//
// ```javascript
// washington.on("complete", function (report, code) {
//   // High level log with standard formatter
//   report.log()
//
//   // Use the exit code to propagate failures
//   process.exit(code)
// })
// ```
//
// ##### `example`
//
// ##### `success`
//
// ##### `failure`
//
// ##### `pending`
//
// ##### `timeout`
//
//
// API
// ---
//
// ### on( event, callback )
//
// Stores an event TODO
Washington.on = function (event, callback) {
  Washington.listeners = Washington.listeners || {}
  Washington.listeners[event] = Washington.listeners[event] || []
  if (Washington.listeners[event].indexOf(callback) == -1)
    Washington.listeners[event].push(callback)

  return Washington
}

Washington.trigger = function (event, args) {
  if (
    Washington.listeners &&
    Washington.listeners[event] instanceof Array)

    Washington.listeners[event].forEach(function (callback) {
      callback.apply(null, args)
    })
  return Washington
}

Washington.go = function () {
  Washington.list.forEach(function (example) {
    if (example.run === Washington.prototype.run)
      example.run()
  })
}

Washington.successes = function () {
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Success
  })
}

Washington.failures = function () {
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Failure
  })
}

Washington.pendings = function () {
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Pending
  })
}

Washington.reset = function () {
  Washington.list      = null
  Washington.listeners = null

  Washington.on("example", function () {
    if (Washington.list.filter(function (example) {
          return example instanceof Washington
        }).length == 0)
      Washington.trigger(
        "complete",
        [
          Washington,
          Washington.failures().length
        ]
      )
  })
}

Washington.prototype.run = function () {
  var replacement

  if (this.function) {
    try {
      this.function()
      replacement = this.succeeded()
    }
    catch (error) {
      replacement = this.failed(error)
    }
  }

  else
    replacement = this.pending()

  Washington.trigger('example', [replacement, Washington])
  return replacement
}

Washington.prototype.succeeded = function () {
  var success = new Washington.Success(this)
  var current = this
  Washington.list = Washington.list.map(function (example) {
    return example === current ? success : example
  })
  Washington.trigger('success', [success, Washington])
  return success
}

Washington.prototype.failed = function (error) {
  var failure = new Washington.Failure(this, error)
  var current = this
  Washington.list = Washington.list.map(function (example) {
    return example === current ? failure : example
  })
  Washington.trigger('failure', [failure, Washington])
  return failure
}

Washington.prototype.pending = function () {
  var pending = new Washington.Pending(this)
  var current = this
  Washington.list = Washington.list.map(function (example) {
    return example === current ? pending : example
  })
  Washington.trigger('pending', [pending, Washington])
  return pending
}

Washington.Success = require("./src/success")
Washington.Failure = require("./src/failure")
Washington.Pending = require("./src/pending")

Washington.reset()

module.exports = Washington
