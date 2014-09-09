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
// > Note: I'm naming the module `example` even when the internal name is
// > `Washington` and I'll maintain this inconsistency accross the
// > documentation. This is because I strongly recommend using `example` to
// > make the purpose explicit. Please bear in mind that all of `Washington`
// > methods as stated in the documentation below are accessible through
// > `example` in these samples.
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
// ### Sequential example
//
// Asynchronous examples are run one at a time. Washington is designed to do
// this because many real life testing scenarios involve tests that interact
// with the same objects or servers concurrently and knowing the state of the
// server or object is significative to the example's completion. As of
// version 0.3.0 there is no alternative to this behavior.
//
// ```javascript
// var example = require("washington")
// var assert  = require("assert")
//
// var flag    = false
//
// example("will set the flag to true", function (done) {
//   setTimeout(function () {
//     assert.equal(flag, false)
//     flag = true
//     done()
//   }, 100)
// })
//
// example("the flag should be set to true", function (done) {
//   setTimeout(function () {
//     try {
//       assert.equal(flag, true)
//       done()
//     }
//
//     catch(error) {
//       done(error)
//     }
//   }, 100)
// })
//
// example.go()
// ```
//
// ### Use it as a command
//
// > You need to install washington as global for using the command line
// > tool. Do that by running `sudo npm install -g washington`
//
// **Washington** provides a command line tool for executing the specs in
// a [**code document**]. The procedure is like this: you start with a file
// that features some washington specs, for example `greet.js`
//
// ```javascript
// var example = require("washington")
// var assert  = require("assert")
//
// function greet(name) {
//   return "Hello " + name + "!"
// }
//
// example("Lets greet Paulie", function () {
//   assert.equal(greet("Paulie"), "Hello Paulie!")
// })
//
// module.exports = greet
// ```
//
// Then you call the command line tool with the file as argument
//
// ```
// washington greet.js
// ```
//
// The interesting thing about this (besides convenience) is that the
// code file is a fully functional module, requirable and production ready.
// Washington is added as a dependency but that is not really a concern
// in most applications. The file itself does not contain an invocation to
// actually run the examples, so the examples are just stored by Node unless
// you run them manually from another script.
//
// In essence, what the command line tool does is requiring **Washington**
// and the file and running Washington. You can also require the script
// `greet.js` in another script that itself has some Washington specs
// and run them all together from the command line. As a way of organizing
// the examples, it is really concise and convenient.
//
// An interesting gotcha is that the command line tool actually creates a
// script named `.washington` in the current working directory that makes
// the actual requiring, and it then executes that script. This is because
// of the isolation policy of Node.js that limits access to data declared
// but not explictly exported with `module.exports` if the required script
// is located in a  different part of the directory tree. The `.washington`
// script is removed once the execution is completed.

"use strict";

var Mediador   = require("mediador")
var Formatter  = require("./src/formatter")

var Washington = function (message, func) {

  //! Return a new instance of Example
  return new Washington.Example(message, func)

}

//
// Events
// ------
//
// ### `complete`
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
// ### `example`
//
// Fires whenever an example ran. Fires just after the corresponding `success`,
// `failure` or `pending` events by the same example.
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
// ### `success`
//
// Fires whenever an example ran successfully. Fires just before the
// corresponding `example` event.
//
// **Arguments for callback**
//
// - `Washington.Success` successObject
// - `Object` report
//
// ### `failure`
//
// Fires whenever an example failed. Fires just before the corresponding
// `example` event.
//
// **Arguments for callback**
//
// - `Washington.Failure` failureObject
// - `Object` report
//
// ### `pending`
//
// Fires whenever an example is pending. Fires just before the corresponding
// `example` event.
//
// **Arguments for callback**
//
// - `Washington.Pending` pendingObject
// - `Object` report
//
// ### `promise`
//
// Fires whenever an example was found to be asynchronous and became a Promise.
//
// **Arguments for callback**
//
// - `Washington.Promise` promiseObject
// - `Object` report
//
// Properties
// ----------
//
// - list: `Array` of examples
// - listeners: `Array` of events
// - timeout: `Integer` amount of time in milliseconds before timeout. If
//   not set, default to `3000` milliseconds as specified in the `Promise`
// - formatter: `Object` containing methods that listen to their corresponding
//   events
//
// Methods
// -------
//
// ### on( event, callback ) | on( eventHash )
//
// > See [`Mediador.on`](https://github.com/xaviervia/mediador)
Washington.on = Mediador.prototype.on

// ### off( event, callback ) | off( eventHash )
//
// See [`Mediador.off`](https://github.com/xaviervia/mediador)
Washington.off = Mediador.prototype.off

// ### emit( event, data )
//
// See [`Mediador.emit`](https://github.com/xaviervia/mediador)
Washington.emit = Mediador.prototype.emit

// ### use( formatter )
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
// **Silencing the output**
//
// Silencing the output is pretty straightforward. If you send anything
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

// ### go()
//
// Runs the first example, which runs the second on complete and so on.
// Once the last example runs it runs the `complete` method of Washington.
Washington.go = function () {

  //! Run the first example
  Washington.list[0].run()

}

// ### complete()
//
// Triggers the 'complete' event.
Washington.complete = function () {
  Washington.emit(
    "complete",
    [
      Washington,
      Washington.failing().length
    ]
  )
}

// ### isComplete()
//
// Returns whether all the examples are ready or not.
//
// #### Returns
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
    .length === 0

}

// ### successful()
//
// Returns the amount of successful examples currently on the report.
//
// #### Returns
//
// - `Integer` amountOfSuccessfulExamples
Washington.successful = function () {

  //! Simply filter in all instances of Washington.Success from the list
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Success })

}

// ### failing()
//
// Returns the amount of failing examples currently on the report.
//
// #### Returns
//
// - `Integer` amountOfFailingExamples
Washington.failing = function () {

  //! Simply filter in all instances of Washington.Failure from the list
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Failure })

}

// ### pending()
//
// Returns the amount of pending examples currently on the report.
//
// #### Returns
//
// - `Integer` amountOfPendingExamples
Washington.pending = function () {

  //! Simply filter in all instances of Washington.Pending from the list
  return Washington.list.filter(function (example) {
    return example instanceof Washington.Pending })

}

// ### reset()
//
// Sets washington to the defaults
//
// - Empties the `list` of examples
// - Removes all event `listeners`
// - Sets the `timeout` to null (that will cause the default to be used)
// - Sets the default `formatter` to be used
Washington.reset = function () {
  Washington.list      = null
  Washington.listeners = null
  Washington.timeout   = null
  Washington.use(Formatter)
}

// Classes
// -------
//
// - [`Washington.Example`](src/example.md)
Washington.Example = require("./src/example")(Washington)

// - [`Washington.Success`](src/success.md)
Washington.Success = require("./src/success")

// - [`Washington.Failure`](src/failure.md)
Washington.Failure = require("./src/failure")

// - [`Washington.Pending`](src/pending.md)
Washington.Pending = require("./src/pending")

// - [`Washington.Promise`](src/promise.md)
Washington.Promise = require("./src/promise")

// - [`Washington.TimeoutError`](src/timeout-error.md)
Washington.TimeoutError = require("./src/timeout-error")

//! Setup washington to the defaults.
Washington.reset()

module.exports = Washington

// Testing
// -------
//
// Washington tests are written using only `assert`, because of course.
//
// To run the tests you need to have CoffeeScript installed. Clone the repo and
// run:
//
// ```
// > sudo npm install -g coffee-script
// > sudo npm link
// > npm test
// ```
//
// License
// -------
//
// Copyright 2014 Xavier Via
//
// BSD 2 Clause license.
//
// See [LICENSE](LICENSE) attached.
