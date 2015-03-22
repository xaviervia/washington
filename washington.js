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
//   Throw errors, use the callback function or just set return values. No need
//   for any separate assertion library.
// - Stupidly simple asynchronous support.
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
// var example = require("washington");
//
// example("2 + 2 should be 4", function (check) {
//   check( 2 + 2, 4 );
// });
//
// example.go();
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
// var example = require("washington");
//
// example("2 + 2 should be 5", function (check) {
//   check( 2 + 2, 5 );
// });
//
// example.go();
// ```
//
// ### Pending example
//
// > Oh yes, I missed having "pending". I'm looking at you,
// > [**Jasmine**](jasmine.github.io)
//
// ```javascript
// var example = require("washington");
//
// example("2 + 2 should be 4");
//
// example.go();
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
// var example = require("washington");
//
// example("2 + 2 will be 4", function (check) {
//   var result = 2 + 2;
//   setTimeout(function () {
//     check( result, 4 );
//   }, 100);
// });
//
// example.go();
// ```
//
// Please note that if the example function receives an argument, the example
// will be assumed to not be complete until `check` is invoked and will timeout
// if it is never executed. The default timeout span is `3000` milliseconds.
// You can change the timeout by editing the `timeout` property of `Washington`:
//
// ```javascript
// var example = require("washington");
//
// example.timeout = 10000;
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
// var example = require("washington");
//
// var flag    = false;
//
// example("will set the flag to true", function (check) {
//   setTimeout(function () {
//     flag = true;
//     check();
//   }, 100);
// });
//
// example("the flag should be set to true", function (check) {
//   setTimeout(function () {
//     check( flag );
//   }, 10);
// });
//
// example.go();
// ```
//
// ### Dry run (no actual execution)
//
// Dry run lists the examples without actually running them.
//
// Useful for listing available examples.
//
// ```javascript
// var example = require("washington");
//
// example('Example', function () { 10 });
// example('Pending example');
// example('Failing example', function (check) { check(1 === 2) });
// example('Async example', function () {});
//
// example.go({
//   dry: true
// });
//
// ```
//
// ### Use it as a command
//
// **Washington** provides a CLI for executing the examples without having to
// invoke `.go()` manually.
//
// ```javascript
// var example = require("washington");
//
// function greet(name) {
//   return "Hello " + name + "!";
// }
//
// example("Lets greet Paulie", function (check) {
//   check( greet("Paulie"), "Hello Paulie!" );
// });
//
// module.exports = greet;
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
  //   console.log("Successful: " + report.successful().length);
  //   console.log("Pending: " + report.pending().length);
  //   console.log("Failing: " + report.failing().length);
  //
  //   // Use the exit code to propagate failing status
  //   process.exit(code);
  //
  // });
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
  //   console.log("Another example completed out of " + report.list.length);
  // });
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
  // var example = require("washington");
  // var color   = require("cli-color");
  //
  // example.use({
  //   success: function (success, report) {
  //     process.stdout.write(color.green("."));
  //   },
  //
  //   pending: function (pending, report) {
  //     process.stdout.write(color.yellow("-"));
  //   },
  //
  //   failure: function (failure, report) {
  //     process.stdout.write(color.red("X"));
  //   },
  //
  //   complete: function (report, code) {
  //     process.exit(code);
  //   }
  // });
  //
  // example("Good", function (check) {
  //   check( 1, 1 );
  // });
  //
  // example("Pending");
  //
  // example("Bad", function (check) {
  //   check( 1, 2 );
  // });
  //
  // example.go();
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
  // var example = require("washington");
  //
  // example.use("silent");
  //
  // example("Will print nothing, do nothing");
  //
  // example.go();
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
    Washington.use(Washington.Formatter)
  }

  // Washington.Example
  // ------------------
  //
  // ### Properties
  //
  // - message: `String` the description of the example
  // - function: `Function` the actual example
  // - duration: `Integer` the amount of time it took to run, in milliseconds
  //
  // ### Methods
  //
  // #### new Washington.Example( message, function )
  //
  // Creates a new `Washington.Example` which adds itself to the global `Washington`
  // instance, both to the general `list` and to the `picked` list.
  //
  // > _Warning_: Creating a example consequently overwrites the contents of
  // > the `picked` list. This makes sense since the example cannot proactively
  // > filter itself once the criteria has been applied.
  //
  // ##### Arguments
  //
  // - `String` message
  // - `Function` function
  //
  // ##### Returns
  //
  // - `Washington.Example` example
  //
  Washington.Example = function (message, func) {

    //! Assign the properties
    this.message  = message
    this.function = func

    //! Add the example to the list
    Washington.list = Washington.list || []
    Washington.list.push(this)

    //! Sync list and picked list
    Washington.picked = Washington.list

  }

  // #### run()
  //
  // Runs the example.
  //
  // If the example requires an argument, it is assumed that the result will
  // be passed to the argument function, so the example becomes a promise and
  // `run` returns the `Washington.Promise`
  //
  // If the example does not require an argument, it fails or succeeds according
  // to whether the function throws an error or not. `run` then returns either a
  // `Washington.Success` or `Washington.Failure`
  //
  // If the example has no function at all, it will become a `Washington.Pending`
  //
  // #### Returns
  //
  // - `Washington.Pending` | `Washington.Failure` | `Washington.Success` |
  //   `Washington.Promise` adaptedExample
  //
  Washington.Example.prototype.run = function () {
    var replacement

    //! Start the clock
    this.start = new Date().getTime()

    //! The example may not be a function if it is just pending, so lets check
    if (this.function) {

      //! If the example function requires an argument
      //! it is interpreted as asynchronous
      if (this.function.length == 1) {


        //! Try catch the function call for the promise since it may fail
        //! synchronously after all
        try {

          //! Get the promise
          replacement = this.promise()

          //! Send the done function of the Promise to the example function
          //! and make sure that it doesn't lose context
          this.function(function () {
            var i = 0, j = arguments.length, args = []
            for (; i < j; i ++) args.push(arguments[i])
            replacement.done.apply(replacement, args) })

        }

        //! If it fails
        catch (error) {

          //! Set the promise as ready so it disregards the done method and
          //! the timeout
          replacement.ready = true

          // Adapt it to a Failure forwarding the Error
          replacement = this.failed(error)

        }

      }

      //! If the example function requires no arguments
      //! it is interpreted as synchronous
      else {

        //! Attempt to run the example function, store return value
        try {
          var result = this.function()

          //! If the return value is `false`, adapt it to Failure with
          //! a Washington.AssertionError that describes the problem
          if (result === false)
            replacement = this.failed(
              new Washington.AssertionError(
                "False as return value, indicating assertion failure") )

          //! If the result value is an actual `Error`, adapt the Example to a
          //! Failure passing the received error
          else if (result instanceof Error)
            replacement = this.failed(result)

          //! If the result value is a `String`, we treat it as a the message
          //! of a generic Washington.AssertionError
          else if (typeof result === "string" || result instanceof String)
            replacement = this.failed(
              new Washington.AssertionError(result) )

          //! If the function succeeds, adapt it to Success
          else
            replacement = this.succeeded()
        }

        //! If it fails, adapt it to a Failure forwarding the Error
        catch (error) {
          replacement = this.failed(error)  }

      }

    }

    //! If there is no function set the example as Pending
    else
      replacement = this.pending()


    //! Return the adapted example
    return replacement

  }

  // #### next()
  //
  // Returns the next example on the picked list or `undefined` if this is the
  // last example there.
  //
  // Runs the next example if available. Otherwise declares the batch to be
  // complete.
  //
  // ##### Returns
  //
  // - `Washington.Example` next
  //
  Washington.Example.prototype.next = function () {

    var next   = undefined
    var i      = 0
    var max    = Washington.picked.length - 1

    //! Whatever happens first: the next is discovered or we run out of picked
    //! examples
    while (!next && i < max) {

      next = Washington.picked[i].original === this ?
        Washington.picked[i + 1] : undefined

      i ++
    }

    if (next) next.run()

    else Washington.complete()

    return next
  }

  // #### promise()
  //
  // Starts a [`Washington.Promise`](promise.md) pointing to the current
  // example. Fires the `promise` event in `Washington` passing the `Promise`
  // as argument. Returns the `Promise`.
  //
  // ##### Returns
  //
  // - `Washington.Promise` promise
  //
  Washington.Example.prototype.promise = function () {

    //! Create the Promise (starts the timeout!)
    var promise = new Washington.Promise(this, Washington.timeout)

    //! Replace the example for the Promise in the Washington.picked
    Washington.picked = Washington.picked.map((function (example) {
      return example === this ? promise : example
    }).bind(this))

    //! Emit the 'promise' event
    Washington.emit('promise', [promise, Washington])

    //! Return the promise
    return promise
  }

  // #### succeeded()
  //
  // Gets a [`Washington.Success`](success.md) object for this example.
  // Fires the `success` and `example` events on `Washington` passing the
  // `Success` as argument.
  //
  // ##### Returns
  //
  // - `Washington.Success` success
  //
  Washington.Example.prototype.succeeded = function () {

    //! Get the duration
    this.duration = new Date().getTime() - this.start

    //! Create the Success object
    var success = new Washington.Success(this)

    //! Replace the Example or Promise for the Success on the list
    Washington.picked = Washington.picked.map((function (example) {
      return example instanceof Washington.Promise ?
        (example.original === this ? success : example ) :
        (example === this ? success : example )
    }).bind(this))

    //! Emit the 'success' and 'example' events
    Washington.emit('success', [success, Washington])
    Washington.emit('example', [success, Washington])

    //! Run the next example or complete the report
    this.next()

    //! Return the Success object
    return success

  }

  // #### failed()
  //
  // Gets a [`Washington.Failure`](failure.md) object for this example.
  // Fires the `failure` and `example` events on `Washington` passing the
  // `Failure` as argument.
  //
  // ##### Returns
  //
  // - `Washington.Failure` failure
  //
  Washington.Example.prototype.failed = function (error) {

    //! Get the duration
    this.duration = new Date().getTime() - this.start

    //! Create the Failure object
    var failure = new Washington.Failure(this, error)

    //! Replace the Example or Promise for the Failure on the list
    Washington.picked = Washington.picked.map((function (example) {
      return example instanceof Washington.Promise ?
        (example.original === this ? failure : example ) :
        (example === this ? failure : example )
    }).bind(this))

    //! Emit the 'failure' and 'example' events
    Washington.emit('failure', [failure, Washington])
    Washington.emit('example', [failure, Washington])

    //! Run the next example or complete the report
    this.next()

    //! Return the Failure object
    return failure
  }

  // #### pending()
  //
  // Gets a [`Washington.Pending`](pending.md) object for this example.
  // Fires the `pending` and `example` events on `Washington` passing the
  // `Pending` as argument.
  //
  // ##### Returns
  //
  // - `Washington.Pending` pending
  //
  Washington.Example.prototype.pending = function () {

    //! Create the Pending object
    var pending = new Washington.Pending(this)

    //! Replace the Example for the Pending on the list
    Washington.picked = Washington.picked.map((function (example) {
      return example === this ? pending : example
    }).bind(this))

    //! Emit the 'pending' and 'example' events
    Washington.emit('pending', [pending, Washington])
    Washington.emit('example', [pending, Washington])

    //! Run the next example or complete the report
    this.next()

    //! Return the Pending object
    return pending

  }

  // Washington.Success
  // ------------------
  //
  // Class representing a successful to complete the example.
  //
  // #### Properties
  //
  // - message: `String`
  // - function: `Function`
  // - original: `Washington.Example`
  //
  // #### Constructor arguments
  //
  // - `Washington.Example` original
  //
  Washington.Success = function (original) {
    this.message  = original.message
    this.function = original.function
    this.original = original
  }

  // ### duration()
  //
  // Returns an `Integer` with the duration of the original event, in
  // milliseconds
  //
  // #### Returns
  //
  // - `Integer` duration
  //
  Washington.Success.prototype.duration = function() {

    //! Defensive code never hurt anybody
    if (this.original)
      return this.original.duration

  }

  // Washington.Failure
  // ------------------
  //
  // Class representing a failure to complete the example.
  //
  // #### Properties
  //
  // - message: `String`
  // - function: `Function`
  // - error: `Error`
  // - original: `Washington.Example`
  //
  // #### Constructor arguments
  //
  // - `Washington.Example` original
  // - `Error` error
  //
  Washington.Failure = function (original, error) {
    this.message  = original.message
    this.function = original.function
    this.error    = error
    this.original = original
  }

  // ### duration()
  //
  // Returns an `Integer` with the duration of the original event, in
  // milliseconds
  //
  // #### Returns
  //
  // - `Integer` duration
  //
  Washington.Failure.prototype.duration = function() {

    //! Defensive code never hurt anybody
    if (this.original)
      return this.original.duration

  }

  // Washington.Pending
  // ------------------
  //
  // Class representing an example in a pending status.
  //
  // #### Properties
  //
  // - message: `String`
  // - original: `Washington.Example`
  //
  // #### Constructor arguments
  //
  // - `Washington.Example` original
  //
  Washington.Pending = function (original) {
    this.message  = original.message
    this.original = original
  }

  // Washington.Promise
  // ------------------
  //
  // Represents a promise that the example will be ready eventually.
  //
  // If the example is not ready in 3 seconds it fails automatically with timeout.
  // You can configure the timeout in the second argument as milliseconds.
  //
  // #### Properties
  //
  // - original: `Washington.Example`
  // - ready: `Boolean`
  //
  // #### Constructor arguments
  //
  // - `Washington.Example` original
  // - _optional_ `Integer`: timeout
  //
  Washington.Promise = function (original, timeout) {

    //! Fail if original is missing
    if (!original)
      throw new Error("Missing original example")

    //! Set the properties
    this.original = original
    this.ready    = false

    //! Start the timeout
    var promise = this
    setTimeout( function () {

      //! If the promise is not done
      if (!promise.ready) {

        //! Prepare message. Check the test function to ensure the use has not
        //! forgot to use the `done` function
        var message = "The example timed out before firing the `done` function"
        if (promise.original) {
          var functionMatch = /^function\s*?\(\s*(\w+?)\s*\)/
                              .exec(promise.original.function)

          //! If the function name is not present, assume that it is because
          //! the user forgot to put it there
          if(promise.original.function
                .toString()
                .substring(functionMatch[0].length)
                .indexOf(functionMatch[1]) == -1)
              message = "Did you forgot to run the `" + functionMatch[1] +
                        "` function when ready?"
        }

        promise.done( new Washington.TimeoutError(message) )
      }
    }, timeout ? timeout : 3000 )
  }

  // ### done( [ result [, want] ] )
  //
  // Run the `done` method when the promise is fulfilled. Only runs if
  // the promise was not `ready`.
  //
  // If there is no argument, the example is assumed to have succeeded and the
  // promise will call the `succeeded` method of the original example.
  //
  // If there is an argument, the example is assumed to have failed and the
  // argument is assumed to be an error. The error is then forwarded to the
  // `failed` method of the original example.
  //
  // If there are two arguments, the first argument is assumed to be what the
  // example got as a result while the second argument is assumed to be what
  // was wanted to get as an outcome. The two arguments are then compared
  // using the `===` operator. If the comparison returns `true` the example is
  // considered to be passing: else, an `AssertionError` with the `got` and
  // `want` properties set to the first and second arguments, and a message
  // explaining the comparison.
  //
  // #### Arguments
  //
  // - _optional_ `Object` result
  // - _optional_ `Object` want
  //
  Washington.Promise.prototype.done = function (result, want) {

    //! Do nothing if the promise is already done
    if (!this.ready) {

      //! Set the promise as ready so that the timeout is discarded
      this.ready = true

      //! If there is a second argument, make a `===` comparison…
      if (arguments.length === 2) {

        //! ...and call succeeded if equal!
        if (arguments[0] === arguments[1])
          this.original.succeeded()

        //! or fail with a custom structure if not equal
        else
          this.original.failed(
            new Washington.AssertionError("\n\tgot:\t" + result + "\n\twant:\t" + want, result, want) )
      }

      else {

        //! If the `result` is an Error
        if (result instanceof Error)

          //! Call failed
          this.original.failed(result)

        //! If the `result` is `false`, create and fail with an AssertionError
        else if (result === false)
          this.original.failed(
            new Washington.AssertionError("False as argument value, indicating assertion failure") )

        //! If the `result` is a String, assume it was intended as the message
        //! for a generic Washington.AssertionError
        else if (typeof result === "string" || result instanceof String)
          this.original.failed(
            new Washington.AssertionError(result) )

        //! If there was no error, assume success
        else

          //! ...and call succeeded
          this.original.succeeded()

      }
    }

  }

  // Washington.Formatter
  // --------------------
  //
  // This is the default formatter
  Washington.Formatter = (function () {
    "use strict";

    var RED        = "\u001b[31m"
    var GREEN      = "\u001b[32m"
    var YELLOW     = "\u001b[33m"
    var CLEAR      = "\u001b[0m"
    var GREY       = "\u001b[30m"

    return {

      exampleRunRegexp: /Washington\.Example\.run \(.+?washington\/washington\.js:\d+:\d+\)/,
      promiseDoneRegexp: /Washington\.Promise\.done \(.+?washington\/washington\.js:\d+:\d+\)/,

      // ### success(example)
      //
      // Logs to `console.info` in green and adds a victory hand
      //
      success: function (example) {
        console.info(
          "%s ✌ %s%s%s (%dms)%s",
          GREEN, example.message, CLEAR, GREY, example.duration(), CLEAR )
      },

      // ### pending(example)
      //
      // Logs to `console.warn` in yellow and adds writing hand
      //
      pending: function (example) {
        console.warn(
          "%s ✍ %s%s",
          YELLOW, example.message, CLEAR )
      },

      // ### failure(example)
      //
      // Logs to `console.error` in red and adds a left pointing hand
      //
      failure: function (example) {
        var stack = []
        var stop = false
        var index = 0
        var baseStack = example.error.stack.split("\n")

        while ( !stop && index < baseStack.length) {
          if (!baseStack[index].match(this.exampleRunRegexp) &&
              !baseStack[index].match(this.promiseDoneRegexp) )
            stack.push(baseStack[index])
          else stop = true

          index ++
        }

        console.error(
          "%s ☞ %s%s%s (%dms)%s%s\n ☞ %s%s",
          RED, example.message, CLEAR, GREY, example.duration(),
          CLEAR, RED, stack.join("\n"), CLEAR )
      },

      // ### dry(example)
      //
      // Logs to `console.warn` whether no examples were selected or no examples
      // were found
      //
      dry: function (example) {
        console.warn(
          "%s ☂ %s%s",
          GREY, example.message, CLEAR )
      },

      // ### empty(options)
      //
      // Logs to `console.warn` whether no examples were selected or no examples
      // were found
      //
      empty: function (options) {
        console.warn(
          "%s ∅ No examples %s%s",
          GREY, (Object.keys(options).length == 0 ? "found" : "selected"), CLEAR )
      },

      // ### complete(report, code)
      //
      // Logs the amount of pending, successful and failing examples and terminates the
      // process using the `code` as the exit status.
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
  })()

  // Washington.TimeoutError
  // -----------------------
  //
  // Represents an error generated by timeout
  Washington.TimeoutError = function (message) {

    //! Set the error message
    this.message = message

    //! Set the name. Used for logging the stack trace
    this.name    = "TimeoutError"

    //! Get the stack trace from Error
    //! This is a weird thing to do but it turns out that it is the only
    //! way around
    Error.captureStackTrace(this, Washington.TimeoutError)
  }

  //! Inherit from Error
  Washington.TimeoutError.prototype = Object.create(Error.prototype)

  // Washington.AssertionError
  // -------------------------
  //
  // Represents an error generated by a passive assertion (the example's return
  // value)
  Washington.AssertionError = function (message, got, want) {

    //! Set the error message
    this.message = message

    //! If got and want, store them
    if (got && want) {
      this.got  = got
      this.want = want
    }

    //! Set the name. Used for logging the stack trace
    this.name    = "AssertionError"

    //! Get the stack trace from Error
    //! This is a weird thing to do but it turns out that it is the only
    //! way around
    Error.captureStackTrace(this, Washington.AssertionError)
  }

  //! Inherit from Error
  Washington.AssertionError.prototype = Object.create(Error.prototype)

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
