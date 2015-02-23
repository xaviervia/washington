// Washington
// ==========
//
// > Little George sets a good example
//
// [ ![Codeship Status for xaviervia/washington](https://codeship.io/projects/b9498dd0-d7b0-0131-28b3-76d451bab93b/status)](https://codeship.io/projects/23932)
//
// Example Driven Development for Node.js.
//
// Low footprint. Unique features:
//
// - [Passive assertions](https://github.com/xaviervia/washington/wiki/Passive-Assertions).
//   Throw errors or use return values.
// - Stupidly simple asynchronous example support.
// - Programmatically usable report (`washington.failing().length`)
//
// You can also see the introductory website on
// [xaviervia.github.io/washington](http://xaviervia.github.io/washington)
//
// Installation
// ------------
//
// ```
// npm install -g washington
// ```
//
// Usage
// -----
//
// ### Basic example
//
// ```javascript
// var example = require("washington")
//
// example("2 + 2 should be 4", function (check) {
//   check( 2 + 2 == 4 )
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
// > `example` in these introductory snippets.
//
// ### Failing example
//
// ```javascript
// var example = require("washington")
//
// example("2 + 2 should be 5", function (check) {
//   check( 2 + 2 == 5 )
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
// This is achieved by waiting for the `check` function to be invoked. The
// `check` function is received by the example function as an argument.
//
// ```javascript
// var example = require("washington")
//
// example("2 + 2 will be 4", function (check) {
//   var result = 2 + 2
//   setTimeout(function () {
//     check( result == 4 )
//   }, 100)
// })
//
// example.go()
// ```
//
// Please note that if the example function receives an argument, the example
// will be assumed to not be complete until `check` is invoked and will timeout
// if it is never executed. The default timeout span is `3000` milliseconds.
// You can change the timeout by editing the `timeout` property of `Washington`:
//
// ```javascript
// var example = require("washington")
//
// example.timeout = 10000
// ```
//
// ### Set custom message on failing expectations
//
// You can set a custom message when an example fails and get then a nice
// message in the `AssertionError`:
//
// ```javascript
// var example = require("washington");
//
// example("2 + 2 should be 5", function (check) {
//   check( 2 + 2 == 5 || "The sum doesn't result in 5");
// });
//
// example.go();
// ```
//
// You can also send in a full `Error` object:
//
// ```javascript
// var example = require("washington");
//
// example("2 + 2 should be 5", function (check) {
//   check( 2 + 2 == 5 || new Error("The sum doesn't result in 5") );
// });
//
// example.go();
// ```
//
// > You can read more about [Passive Assertions](https://github.com/xaviervia/washington/wiki/Passive-Assertions)
//
// ### Sequential execution
//
// Asynchronous examples are run one at a time. Washington is designed to do
// this because many real life testing scenarios involve tests that interact
// with the same objects or servers concurrently and knowing the state of the
// server or object is significative to the example's completion. There is no
// plan for adding an option for running the examples simultaneously.
//
// ```javascript
// var example = require("washington")
//
// var flag    = false
//
// example("will set the flag to true", function (check) {
//   setTimeout(function () {
//     flag = true
//     check()
//   }, 100)
// })
//
// example("the flag should be set to true", function (check) {
//   setTimeout(function () {
//     check( flag )
//   }, 10)
// })
//
// example.go()
// ```
//
// ### Dry run (no actual execution)
//
// Dry run lists the examples without actually running them.
//
// Useful for listing available examples.
//
// ```javascript
// var example = require("washington")
//
// example('Example', function () { 10 })
// example('Pending example')
// example('Failing example', function (check) { check(1 === 2) })
// example('Async example', function () {})
//
// example.go({
//   dry: true
// })
//
// ```
//
// ### Use it as a command
//
// **Washington** provides a CLI for executing the examples without having to
// invoke `.go()` manually.
//
// ```javascript
// var example = require("washington")
//
// function greet(name) {
//   return "Hello " + name + "!"
// }
//
// example("Lets greet Paulie", function (check) {
//   check( greet("Paulie") === "Hello Paulie!" )
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
// You can also use the `--only`, `--start`, `--end` and `--match` filtering options:
//
// ```
// washington greet.js --start=2 --end=5 --match=WIP
// ```
//
// If you just want to list the available tests, do a dry run
//
// ```
// washington greet.js --dry
// ```
//
// An interesting consequence of this approach is that the code file containing
// the examples is a fully functional module, requirable and production ready.
// Washington is added as a dependency, but that is not really a concern
// in many applications. The file itself does not contain any invocations that
// actually runs the examples, so they are just stored in memory unless
// you run them manually from another script.
//
// In essence, what the command line tool does is requiring **Washington**,
// requiring the target file and then running the example set. You can also
// require the script `greet.js` in another script that itself has some
// Washington examples and run them all together from the command line. As a
// way of organizing the examples, it is really concise and convenient.
//
// > Note that the CLI creates and then destroys a
// > [`.washington` artifact file](https://github.com/xaviervia/washington/wiki/Command-line-quirk:-Node's-require-isolation-policy)
// > in the working directory.
//

"use strict";

(function (name, definition) {

  //! AMD
  if (typeof define === 'function')
    define(definition)

  //! Node.js
  else if (typeof module !== 'undefined' && module.exports)
    module.exports = definition()

  //! Browser
  else {
    var theModule = definition(), global = window, old = global[name];

    theModule.noConflict = function () {
      global[name] = old
      return theModule
    }

    global[name] = theModule
  }

})('example', function () {

  //! Inlined github.com/xaviervia/mediador dependency
  var Mediador = function () {}

  Mediador.prototype.on = function (event, callback, scope) {
    if (!callback) for (var key in event) {
      if (event[key] instanceof Function) this.on(key, event[key], event) }
    else {
      this.listeners = this.listeners || {}
      this.listeners[event] = this.listeners[event] || []
      if (this.listeners[event].indexOf(callback) === -1)
        this.listeners[event].push({ callback: callback, scope: scope })
    }
    return this }

  Mediador.prototype.emit = function (event, args) {
    if (this.listeners && this.listeners instanceof Object &&
        this.listeners[event] instanceof Array)
        for (var index in this.listeners[event])
          this.listeners[event][index].callback
            .apply(this.listeners[event][index].scope, (args ? args : []).concat([this]))
    return this }

  Mediador.prototype.off = function (event, callback) {
    if (!callback) {
      for (var key in event)
        if (event[key] instanceof Function)
          this.off(key, event[key])
    }
    else
      if (this.listeners && this.listeners instanceof Object &&
          this.listeners[event] instanceof Array) {
          var iterator  = 0
          var index     = null
          var max       = this.listeners[event].length
          while (index === null || iterator < max) {
            if (this.listeners[event][iterator].callback === callback)
              index = iterator
            iterator ++
          }
          this.listeners[event].splice(index, 1)
      }
    return this }

  var Formatter  = require("./src/formatter")

  var Washington = function (message, func) {

    //! Return a new instance of Example
    return new Washington.Example(message, func)

  }

  // Events
  // ------
  //
  // Washington provides a thorough event-driven interface for manipulating
  // information about the examples' results programmatically.
  //
  // ### `complete`
  //
  // Fires whenever the full report is ready.
  //
  // **Arguments sent to the callback:**
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
  // **Arguments sent to the callback**
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
  // **Arguments sent to the callback**
  //
  // - `Washington.Success` successObject
  // - `Object` report
  //
  // ### `failure`
  //
  // Fires whenever an example failed. Fires just before the corresponding
  // `example` event.
  //
  // **Arguments sent to the callback**
  //
  // - `Washington.Failure` failureObject
  // - `Object` report
  //
  // ### `pending`
  //
  // Fires whenever an example is pending. Fires just before the corresponding
  // `example` event.
  //
  // **Arguments sent to the callback**
  //
  // - `Washington.Pending` pendingObject
  // - `Object` report
  //
  // ### `promise`
  //
  // Fires whenever an example was found to be asynchronous and became a Promise.
  //
  // **Arguments sent to the callback**
  //
  // - `Washington.Promise` promiseObject
  // - `Object` report
  //
  // ### `empty`
  //
  // Is emitted whenever washington was instructed to run but no examples where
  // actually selected. The filtering options are sent to the listener for
  // reporting and debugging.
  //
  // **Arguments sent to the callback**
  //
  // - `Object` options
  // - `Object` report
  //
  // ### `dry`
  //
  // Fires for each example in the suite when doing a dry run.
  //
  // **Arguments sent to the callback**
  //
  // - `Washington.Example` exampleObject
  //
  // Properties
  // ----------
  //
  // - list: `Array` of examples
  // - picked: `Array` of examples to actually be run
  // - listeners: `Object` containing the events as key and the listeners as
  //   value `Array`s
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
  //
  Washington.on = Mediador.prototype.on

  // ### off( event, callback ) | off( eventHash )
  //
  // See [`Mediador.off`](https://github.com/xaviervia/mediador)
  //
  Washington.off = Mediador.prototype.off

  // ### emit( event, data )
  //
  // See [`Mediador.emit`](https://github.com/xaviervia/mediador)
  //
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
  // example("Good", function (check) {
  //   check( 1 === 1 )
  // })
  //
  // example("Pending")
  //
  // example("Bad", function (check) {
  //   check( 1 === 2 )
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
  //
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

  // ### go( options )
  //
  // Runs the examples. If `options` are provided, filters the examples to run
  // based on the provided criteria.  Emits `complete` once the last example in
  // the picked range is emitted.
  //
  // ```javascript
  // var example = require("washington");
  //
  // example.go({
  //   start: 7,       // Will start from the 7th example on
  //   end: 10,        // Will stop at the 10th example
  //   match: /WIP/,   // Will only select examples matching /WIP/
  //   filter: function (example) {
  //     // Will only select asynchronous examples
  //     return example.function.length == 1
  //   }
  // })
  // ```
  //
  // #### Arguments
  //
  // - _optional_ `Object` options
  //   - _optional_ `Integer` start
  //   - _optional_ `Integer` end
  //   - _optional_ `Regexp`|`String` match
  //   - _optional_ `Function` filter
  //   - _optional_ `Boolean` dry
  //
  Washington.go = function (options) {

    //! If the list is empty, just report that
    if (!Washington.list || Washington.list.length === 0)
      return Washington
        .emit("empty", [options || {}])
        .complete()

    //! If filtering options are available, restrict "picked"
    if (options) {

      //! Expand only into "start" and "end" to simplify filtering
      if (options.only) {
        options.start = options.only
        options.end = options.only
      }

      //! Subset to the `picked list if needed
      Washington.picked = Washington.list.filter(function (example, index) {
        if (options && options.start && index < options.start - 1) return false
        if (options.end && index > options.end - 1) return false
        if (options.match && !example.message.match(options.match)) return false
        return true
      })

      //! If a filter is provided, apply it
      if (options.filter)
        Washington.picked = Washington.picked.filter(options.filter)

    }

    //! Emit "empty" and "complete" if no examples selected
    if (Washington.picked.length === 0)
      Washington
        .emit("empty", [options])
        .complete()

    //! If this is just a dry run
    else if(options && options.dry)
      Washington.picked.forEach(function (example) {
        Washington.emit("dry", [example]) })

    //! Run the first example
    else Washington.picked[0].run()

  }

  // ### complete()
  //
  // Triggers the 'complete' event.
  //
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
  //
  Washington.isComplete = function () {

    //! Filter the list of examples searching for instances of Washington
    //! or Washington.Promise
    return Washington.picked
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
  // Returns the successful examples currently on the report.
  //
  // #### Returns
  //
  // - `Array` successfulExamples
  //
  Washington.successful = function () {

    //! Simply filter in all instances of Washington.Success from the list
    return Washington.picked ? (
        Washington.picked.filter(function (example) {
          return example instanceof Washington.Success })
      ) : []

  }

  // ### failing()
  //
  // Returns the failing examples currently on the report.
  //
  // #### Returns
  //
  // - `Array` failingExamples
  //
  Washington.failing = function () {

    //! Simply filter in all instances of Washington.Failure from the list
    return Washington.picked ? (
        Washington.picked.filter(function (example) {
          return example instanceof Washington.Failure })
      ) : []

  }

  // ### pending()
  //
  // Returns the pending examples currently on the report.
  //
  // #### Returns
  //
  // - `Array` pendingExamples
  //
  Washington.pending = function () {

    //! Simply filter in all instances of Washington.Pending from the list
    return Washington.picked ? (
        Washington.picked.filter(function (example) {
          return example instanceof Washington.Pending })
      ) : []

  }

  // ### duration()
  //
  // Returns the total duration of all tests run, in milliseconds.
  //
  // #### Returns
  //
  // - `Integer` duration
  //
  Washington.duration = function () {

    //! Collect
    var duration = 0

    //! Add for each example that has duration
    if (Washington.picked)
      Washington.picked.forEach(function (example) {
        duration += example.duration ? example.duration() : 0 })

    //! Return the total
    return duration

  }

  // ### reset()
  //
  // Sets washington to the defaults
  //
  // - Empties the `list` of examples
  // - Empties the `picked` examples
  // - Removes all event `listeners`
  // - Sets the `timeout` to null (that will cause the default to be used)
  // - Sets the default `formatter` to be used
  //
  Washington.reset = function () {
    Washington.list      = null
    Washington.picked    = null
    Washington.listeners = null
    Washington.timeout   = null
    Washington.use(Formatter)
  }

  // Classes
  // -------
  //
  // - [`Washington.Example`](src/example.md)
  //
  Washington.Example = require("./src/example")(Washington)

  // - [`Washington.Success`](src/success.md)
  //
  Washington.Success = require("./src/success")

  // - [`Washington.Failure`](src/failure.md)
  //
  Washington.Failure = require("./src/failure")

  // - [`Washington.Pending`](src/pending.md)
  //
  Washington.Pending = require("./src/pending")

  // - [`Washington.Promise`](src/promise.md)
  //
  Washington.Promise = require("./src/promise")

  // - [`Washington.TimeoutError`](src/timeout-error.md)
  //
  Washington.TimeoutError = require("./src/timeout-error")

  // - [`Washington.AssertionError`](src/assertion-error.md)
  //
  Washington.AssertionError = require("./src/assertion-error")

  //! Setup washington to the defaults.
  Washington.reset()

  return Washington

})

// Testing
// -------
//
// Washington tests are very low-level, because of course. It's almost a
// miracle than a test library can be tested without collapsing in a paradox.
//
// To run the tests, clone this repo and run:
//
// ```
// npm install
// npm test
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
