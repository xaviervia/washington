// Washington
// ==========
//
// > Little George sets a good example
//
// [ ![Codeship Status for xaviervia/washington](https://codeship.io/projects/b9498dd0-d7b0-0131-28b3-76d451bab93b/status)](https://codeship.io/projects/23932)
//
// Example library for TDD/BDD in Node.js.
// Very small. Much concise.
//
// - No assertions. Use [`assert`](http://nodejs.org/api/assert.html)
// - Stupidly simple asynchronous support.
// - Programmatically usable report (`washington.failing().length`)
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
// ### Basic example
//
// ```javascript
// var example = require("washington")
// var assert  = require("assert")
//
// example("2 + 2 should be 4", function () {
//   assert.equal(2 + 2, 4)
// })
//
// example.go()
// ```
//
// **Washington** runs the examples when the `go` method is called. By default,
// each successful, pending or failing example is printed to the console and
// the application ends with an exit code of `0` (success) if no example failed,
// or with the amount of failing examples (more than `0` means failure).
//
// ### Failing example
//
// ```javascript
// var example = require("washington")
// var assert  = require("assert")
//
// example("2 + 2 should be 5", function () {
//   assert.equal(2 + 2, 5)
// })
//
// example.go()
// ```
//
// ### Pending example
//
// > Oh yes, I missed having "pending". I'm looking at you,
// > [**Jasmine**](jasmine.github.io)
//
// ```javascript
// var example = require("washington")
//
// example("2 + 2 should be 4")
//
// example.go()
// ```
//
// ### Asynchronous example
//
// The main difference between synchronous and asynchronous examples is that
// asynchronous ones require to be told:
//
// - When is the example complete
// - What has been the error, if any
//
// This is achieved with the `done` function that the example function receives
// as argument.
//
// ```javascript
// var example = require("washington")
// var assert  = require("assert")
//
// example("2 + 2 will be 4", function (done) {
//   var result = 2 + 2
//   setTimeout(function () {
//     try {
//       assert.equal(result, 4)
//       done()
//     }
//     catch(error) {
//       done(error)
//     }
//   }, 100)
// })
//
// example.go()
// ```
//
// > **Important**: please note that if the example function receives
// > an argument, the example will be assumed to be asynchronous and will
// > timeout if the `done` function is never executed.
//
"use strict"

var mediator   = require("./src/mediator")
var Formatter  = require("./src/formatter")

var Washington = function (message, func) {

  //! We should return a new instance
  return new Washington.Example(message, func)

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
// - `Object` report
// - `Integer` exitCode
//
// **Sample:**
//
// ```javascript
// washington.on("complete", function (report, code) {
//
//   // Log the results by hand
//   console.log("Successful: " + report.successful().length)
//   console.log("Pending: " + report.pending().length)
//   console.log("Failing: " + report.failing().length)
//
//   // Use the exit code to propagate failing status
//   process.exit(code)
//
// })
// ```
//
// ##### `example`
//
// Fires whenever an example ran. Fires just after the corresponding `success`,
// `failure` or `pending` events by the same example. Internally, Washington
// hooks itself to the `example` event to find out if the batch is ready and
// fire the `complete` event.
//
// **Arguments for callback**
//
// - `Washington.Pending` | `Washington.Success` | `Washington.Failure` example
// - `Object` report
//
// **Sample:**
//
// ```javascript
// washington.on("example", function (example, report) {
//   console.log("Another example completed out of " + report.list.length)
// })
// ```
//
// ##### `success`
//
// Fires whenever an example ran successfully. Fires just before the
// corresponding `example` event.
//
// **Arguments for callback**
//
// - `Washington.Success` successObject
// - `Object` report
//
// ##### `failure`
//
// Fires whenever an example failed. Fires just before the corresponding
// `example` event.
//
// **Arguments for callback**
//
// - `Washington.Failure` failureObject
// - `Object` report
//
// ##### `pending`
//
// Fires whenever an example is pending. Fires just before the corresponding
// `example` event.
//
// **Arguments for callback**
//
// - `Washington.Pending` pendingObject
// - `Object` report
//
// ##### `promise`
//
// Fires whenever an example is async and became a promise.
//
// **Arguments for callback**
//
// - `Washington.Promise` promiseObject
// - `Object` report
//
// API
// ---
//
// ### Washington function
//
// #### Properties
//
// - list: `Array` of examples
// - listeners: `Array` of events
// - timeout: `Integer` amount of time in milliseconds before timeout. If
//   not set, default to `3000` milliseconds as specified in the `Promise`
// - formatter: `Object` containing methods that listen to their corresponding
//   events
//
// #### Methods
//
// - `Washington.on`: See [`Mediator.on`](src/mediator.md)
Washington.on = mediator.on

// - `Washington.off`: See [`Mediator.off`](src/mediator.md)
Washington.off = mediator.off

// - `Washington.trigger`: See [`Mediator.trigger`](src/mediator.md)
Washington.trigger = mediator.trigger

// ##### use( formatter )
//
// The `use` method allows you to change formatters easily.
// The `formatter` object is simply an object where each method maps to an event
// and Washington automatically hooks them and removes the previous formatter.
//
// For example, here is something like the minimalistic reporter from RSpec:
//
// ```javascript
// var example = require("washington")
// var assert  = require("assert")
// var color   = require("cli-color")
//
// example.use({
//   success: function (success, report) {
//     process.stdout.write(color.green("."))
//   },
//
//   pending: function (pending, report) {
//     process.stdout.write(color.yellow("-"))
//   },
//
//   failure: function (failure, report) {
//     process.stdout.write(color.red("X"))
//   },
//
//   complete: function (report, code) {
//     process.exit(code)
//   }
// })
//
// example("Good", function () {
//   assert.equal(1, 1)
// })
//
// example("Pending")
//
// example("Bad", function () {
//   assert.equal(1, 2)
// })
//
// example.go()
// ```
//
// ###### Silencing the reporter
//
// Silencing the reporter is pretty straightforward. If you send anything
// to the `use` method that has no corresponding `example`, `success`, etc
// methods itself, the result will be that the default formatter will be
// removed but nothing added to replace it.
//
// ```javascript
// var example = require("washington")
//
// example.use("silent")
//
// example("Will print nothing, do nothing")
//
// example.go()
// ```
Washington.use = function (formatter) {

  //! If there is a formatter set
  if (Washington.formatter)

    //! ...that formatter events should be removed
    Washington.off(Washington.formatter)

  //! The formatter may not be an object
  try {

    //! Verify if the formatter has properties that can be listed
    Object.keys(formatter)

    //! Hook all the formatter properties as events
    Washington.on(formatter)

    //! Save the formatter as the current formatter
    Washington.formatter = formatter

  }

  //! If the argument is not an object just set the formatter as null
  catch (notObject) {
    Washington.formatter = null
  }
}

// ##### go()
//
// Runs the examples in the list, one by one.
Washington.go = function () {

  //! For each example in the list
  Washington.list.forEach(function (example) {

    //! Run only if the example has a run function
    //! This is because only objects of type Washington should be run
    if (example.run === Washington.Example.prototype.run)
      example.run() })

}

// ##### isComplete()
//
// Returns whether all the examples are ready or not.
//
// ###### Returns
//
// - `Boolean` isComplete
Washington.isComplete = function () {

  //! Filter the list of examples searching for instances of Washington
  //! or Washington.Promise
  return Washington.list
    .filter(function (example) {
      return (example instanceof Washington.Example) ||
        (example instanceof Washington.Promise)
    })

    //! If there was any instance of Washington or Washington.Promise
    //! then the report is not complete
    .length == 0

}

// ##### successful()
//
// Returns the amount of successful examples currently on the report.
//
// ###### Returns
//
// - `Integer` amountOfSuccessfulExamples
Washington.successful = function () {

  //! Simply filter in all instances of Washington.Success from the list
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Success })

}

// ##### failing()
//
// Returns the amount of failing examples currently on the report.
//
// ###### Returns
//
// - `Integer` amountOfFailingExamples
Washington.failing = function () {

  //! Simply filter in all instances of Washington.Failure from the list
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Failure })

}

// ##### pending()
//
// Returns the amount of pending examples currently on the report.
//
// ###### Returns
//
// - `Integer` amountOfPendingExamples
Washington.pending = function () {

  //! Simply filter in all instances of Washington.Pending from the list
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Pending })

}

// ##### reset()
//
// Sets washington to the defaults
//
// - Empties the list of examples
// - Removes all event listeners
// - Sets the timeout to null (that will cause the default to be used)
// - Sets the default formatter to be used
// - Hooks function that fires the `complete` event when the last `example` ran
Washington.reset = function () {
  Washington.list      = null
  Washington.listeners = null
  Washington.timeout   = null
  Washington.use(Formatter)

  Washington.on("example", function () {
    if (Washington.isComplete())
      Washington.trigger(
        "complete",
        [
          Washington,
          Washington.failing().length
        ]
      )
  })
}

Washington.Example = require("./src/example")(Washington)
Washington.Success = require("./src/success")
Washington.Failure = require("./src/failure")
Washington.Pending = require("./src/pending")
Washington.Promise = require("./src/promise")
Washington.TimeoutError = require("./src/timeout-error")

Washington.reset()

module.exports = Washington
