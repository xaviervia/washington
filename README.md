Washington
==========

> Little George sets a good example

[ ![Codeship Status for xaviervia/washington](https://codeship.io/projects/b9498dd0-d7b0-0131-28b3-76d451bab93b/status)](https://codeship.io/projects/23932)

Example Driven Development for Node.js.

Low footprint. Unique features:

- [Passive assertions](https://github.com/xaviervia/washington/wiki/Passive-Assertions).
  Throw errors or use return values.
- Stupidly simple asynchronous example support.
- Programmatically usable report (`washington.failing().length`)

You can also see the introductory website on
[xaviervia.github.io/washington](http://xaviervia.github.io/washington)

Installation
------------

```
npm install -g washington
```

Usage
-----

### Basic example

```javascript
var example = require("washington")

example("2 + 2 should be 4", function (check) {
  check( 2 + 2 == 4 )
})

example.go()
```

**Washington** runs the examples when the `go` method is called. By default,
each successful, pending or failing example is printed to the console and
the application ends with an exit code of `0` (success) if no example failed,
or with the amount of failing examples (more than `0` means failure).

> Note: I'm naming the module `example` even when the internal name is
> `Washington` and I'll maintain this inconsistency accross the
> documentation. This is because I strongly recommend using `example` to
> make the purpose explicit. Please bear in mind that all of `Washington`
> methods as stated in the documentation below are accessible through
> `example` in these introductory snippets.

### Failing example

```javascript
var example = require("washington")

example("2 + 2 should be 5", function (check) {
  check( 2 + 2 == 5 )
})

example.go()
```

### Pending example

> Oh yes, I missed having "pending". I'm looking at you,
> [**Jasmine**](jasmine.github.io)

```javascript
var example = require("washington")

example("2 + 2 should be 4")

example.go()
```

### Asynchronous example

The main difference between synchronous and asynchronous examples is that
asynchronous ones require to be told:

- When is the example complete
- What has been the error, if any

This is achieved by waiting for the `check` function to be invoked. The
`check` function is received by the example function as an argument.

```javascript
var example = require("washington")

example("2 + 2 will be 4", function (check) {
  var result = 2 + 2
  setTimeout(function () {
    check( result == 4 )
  }, 100)
})

example.go()
```

Please note that if the example function receives an argument, the example
will be assumed to not be complete until `check` is invoked and will timeout
if it is never executed. The default timeout span is `3000` milliseconds.
You can change the timeout by editing the `timeout` property of `Washington`:

```javascript
var example = require("washington")

example.timeout = 10000
```

### Set custom message on failing expectations

You can set a custom message when an example fails and get then a nice
message in the `AssertionError`:

```javascript
var example = require("washington");

example("2 + 2 should be 5", function (check) {
  check( 2 + 2 == 5 || "The sum doesn't result in 5");
});

example.go();
```

You can also send in a full `Error` object:

```javascript
var example = require("washington");

example("2 + 2 should be 5", function (check) {
  check( 2 + 2 == 5 || new Error("The sum doesn't result in 5") );
});

example.go();
```

> You can read more about [Passive Assertions](https://github.com/xaviervia/washington/wiki/Passive-Assertions)

### Sequential execution

Asynchronous examples are run one at a time. Washington is designed to do
this because many real life testing scenarios involve tests that interact
with the same objects or servers concurrently and knowing the state of the
server or object is significative to the example's completion. There is no
plan for adding an option for running the examples simultaneously.

```javascript
var example = require("washington")

var flag    = false

example("will set the flag to true", function (check) {
  setTimeout(function () {
    flag = true
    check()
  }, 100)
})

example("the flag should be set to true", function (check) {
  setTimeout(function () {
    check( flag )
  }, 10)
})

example.go()
```

### Dry run (no actual execution)

Dry run lists the examples without actually running them.

Useful for listing available examples.

```javascript
var example = require("washington")

example('Example', function () { 10 })
example('Pending example')
example('Failing example', function (check) { check(1 === 2) })
example('Async example', function () {})

example.go({
  dry: true
})

```

### Use it as a command

**Washington** provides a CLI for executing the examples without having to
invoke `.go()` manually.

```javascript
var example = require("washington")

function greet(name) {
  return "Hello " + name + "!"
}

example("Lets greet Paulie", function (check) {
  check( greet("Paulie") === "Hello Paulie!" )
})

module.exports = greet
```

Then you call the command line tool with the file as argument

```
washington greet.js
```

You can also use the `--only`, `--start`, `--end` and `--match` filtering options:

```
washington greet.js --start=2 --end=5 --match=WIP
```

If you just want to list the available tests, do a dry run

```
washington greet.js --dry
```

An interesting consequence of this approach is that the code file containing
the examples is a fully functional module, requirable and production ready.
Washington is added as a dependency, but that is not really a concern
in many applications. The file itself does not contain any invocations that
actually runs the examples, so they are just stored in memory unless
you run them manually from another script.

In essence, what the command line tool does is requiring **Washington**,
requiring the target file and then running the example set. You can also
require the script `greet.js` in another script that itself has some
Washington examples and run them all together from the command line. As a
way of organizing the examples, it is really concise and convenient.

> Note that the CLI creates and then destroys a
> [`.washington` artifact file](https://github.com/xaviervia/washington/wiki/Command-line-quirk:-Node's-require-isolation-policy)
> in the working directory.

Events
------

Washington provides a thorough event-driven interface for manipulating
information about the examples' results programmatically.

### `complete`

Fires whenever the full report is ready.

**Arguments sent to the callback:**

- `Object` report
- `Integer` exitCode

**Sample:**

```javascript
washington.on("complete", function (report, code) {

  // Log the results by hand
  console.log("Successful: " + report.successful().length)
  console.log("Pending: " + report.pending().length)
  console.log("Failing: " + report.failing().length)

  // Use the exit code to propagate failing status
  process.exit(code)

})
```

### `example`

Fires whenever an example ran. Fires just after the corresponding `success`,
`failure` or `pending` events by the same example.

**Arguments sent to the callback**

- `Washington.Pending` | `Washington.Success` | `Washington.Failure` example
- `Object` report

**Sample:**

```javascript
washington.on("example", function (example, report) {
  console.log("Another example completed out of " + report.list.length)
})
```

### `success`

Fires whenever an example ran successfully. Fires just before the
corresponding `example` event.

**Arguments sent to the callback**

- `Washington.Success` successObject
- `Object` report

### `failure`

Fires whenever an example failed. Fires just before the corresponding
`example` event.

**Arguments sent to the callback**

- `Washington.Failure` failureObject
- `Object` report

### `pending`

Fires whenever an example is pending. Fires just before the corresponding
`example` event.

**Arguments sent to the callback**

- `Washington.Pending` pendingObject
- `Object` report

### `promise`

Fires whenever an example was found to be asynchronous and became a Promise.

**Arguments sent to the callback**

- `Washington.Promise` promiseObject
- `Object` report

### `empty`

Is emitted whenever washington was instructed to run but no examples where
actually selected. The filtering options are sent to the listener for
reporting and debugging.

**Arguments sent to the callback**

- `Object` options
- `Object` report

### `dry`

Fires for each example in the suite when doing a dry run.

**Arguments sent to the callback**

- `Washington.Example` exampleObject

Properties
----------

- list: `Array` of examples
- picked: `Array` of examples to actually be run
- listeners: `Object` containing the events as key and the listeners as
  value `Array`s
- timeout: `Integer` amount of time in milliseconds before timeout. If
  not set, default to `3000` milliseconds as specified in the `Promise`
- formatter: `Object` containing methods that listen to their corresponding
  events

Methods
-------

### on( event, callback ) | on( eventHash )

> See [`Mediador.on`](https://github.com/xaviervia/mediador)

### off( event, callback ) | off( eventHash )

See [`Mediador.off`](https://github.com/xaviervia/mediador)

### emit( event, data )

See [`Mediador.emit`](https://github.com/xaviervia/mediador)

### use( formatter )

The `use` method allows you to change formatters easily.
The `formatter` object is simply an object where each method maps to an event
and Washington automatically hooks them and removes the previous formatter.

For example, here is something like the minimalistic reporter from RSpec:

```javascript
var example = require("washington")
var color   = require("cli-color")

example.use({
  success: function (success, report) {
    process.stdout.write(color.green("."))
  },

  pending: function (pending, report) {
    process.stdout.write(color.yellow("-"))
  },

  failure: function (failure, report) {
    process.stdout.write(color.red("X"))
  },

  complete: function (report, code) {
    process.exit(code)
  }
})

example("Good", function (check) {
  check( 1 === 1 )
})

example("Pending")

example("Bad", function (check) {
  check( 1 === 2 )
})

example.go()
```

**Silencing the output**

Silencing the output is pretty straightforward. If you send anything
to the `use` method that has no corresponding `example`, `success`, etc
methods itself, the result will be that the default formatter will be
removed but nothing added to replace it.

```javascript
var example = require("washington")

example.use("silent")

example("Will print nothing, do nothing")

example.go()
```

### go( options )

Runs the examples. If `options` are provided, filters the examples to run
based on the provided criteria.  Emits `complete` once the last example in
the picked range is emitted.

```javascript
var example = require("washington");

example.go({
  start: 7,       // Will start from the 7th example on
  end: 10,        // Will stop at the 10th example
  match: /WIP/,   // Will only select examples matching /WIP/
  filter: function (example) {
    // Will only select asynchronous examples
    return example.function.length == 1
  }
})
```

#### Arguments

- _optional_ `Object` options
  - _optional_ `Integer` start
  - _optional_ `Integer` end
  - _optional_ `Regexp`|`String` match
  - _optional_ `Function` filter
  - _optional_ `Boolean` dry

### complete()

Triggers the 'complete' event.

### isComplete()

Returns whether all the examples are ready or not.

#### Returns

- `Boolean` isComplete

### successful()

Returns the successful examples currently on the report.

#### Returns

- `Array` successfulExamples

### failing()

Returns the failing examples currently on the report.

#### Returns

- `Array` failingExamples

### pending()

Returns the pending examples currently on the report.

#### Returns

- `Array` pendingExamples

### duration()

Returns the total duration of all tests run, in milliseconds.

#### Returns

- `Integer` duration

### reset()

Sets washington to the defaults

- Empties the `list` of examples
- Empties the `picked` examples
- Removes all event `listeners`
- Sets the `timeout` to null (that will cause the default to be used)
- Sets the default `formatter` to be used

Washington.Example
------------------

### Properties

- message: `String` the description of the example
- function: `Function` the actual example
- duration: `Integer` the amount of time it took to run, in milliseconds

### Methods

#### new Washington.Example( message, function )

Creates a new `Washington.Example` which adds itself to the global `Washington`
instance, both to the general `list` and to the `picked` list.

> _Warning_: Creating a example consequently overwrites the contents of
> the `picked` list. This makes sense since the example cannot proactively
> filter itself once the criteria has been applied.

##### Arguments

- `String` message
- `Function` function

##### Returns

- `Washington.Example` example

#### run()

Runs the example.

If the example requires an argument, it is assumed that the result will
be passed to the argument function, so the example becomes a promise and
`run` returns the `Washington.Promise`

If the example does not require an argument, it fails or succeeds according
to whether the function throws an error or not. `run` then returns either a
`Washington.Success` or `Washington.Failure`

If the example has no function at all, it will become a `Washington.Pending`

#### Returns

- `Washington.Pending` | `Washington.Failure` | `Washington.Success` |
  `Washington.Promise` adaptedExample

Adapt it to a Failure forwarding the Error
#### next()

Returns the next example on the picked list or `undefined` if this is the
last example there.

Runs the next example if available. Otherwise declares the batch to be
complete.

##### Returns

- `Washington.Example` next

#### promise()

Starts a [`Washington.Promise`](promise.md) pointing to the current
example. Fires the `promise` event in `Washington` passing the `Promise`
as argument. Returns the `Promise`.

##### Returns

- `Washington.Promise` promise

#### succeeded()

Gets a [`Washington.Success`](success.md) object for this example.
Fires the `success` and `example` events on `Washington` passing the
`Success` as argument.

##### Returns

- `Washington.Success` success

#### failed()

Gets a [`Washington.Failure`](failure.md) object for this example.
Fires the `failure` and `example` events on `Washington` passing the
`Failure` as argument.

##### Returns

- `Washington.Failure` failure

#### pending()

Gets a [`Washington.Pending`](pending.md) object for this example.
Fires the `pending` and `example` events on `Washington` passing the
`Pending` as argument.

##### Returns

- `Washington.Pending` pending

Washington.Success
------------------

Class representing a successful to complete the example.

#### Properties

- message: `String`
- function: `Function`
- original: `Washington`

#### Constructor arguments

- `Washington.Example` original

### duration()

Returns an `Integer` with the duration of the original event, in
milliseconds

#### Returns

- `Integer` duration

- [`Washington.Failure`](src/failure.md)

- [`Washington.Pending`](src/pending.md)

- [`Washington.Promise`](src/promise.md)

Washington.Formatter
--------------------

This is the default formatter
### success(example)

Logs to `console.info` in green and adds a victory hand

### pending(example)

Logs to `console.warn` in yellow and adds writing hand

### failure(example)

Logs to `console.error` in red and adds a left pointing hand

### dry(example)

Logs to `console.warn` whether no examples were selected or no examples
were found

### empty(options)

Logs to `console.warn` whether no examples were selected or no examples
were found

### complete(report, code)

Logs the amount of pending, successful and failing examples and terminates the
process using the `code` as the exit status.

- [`Washington.TimeoutError`](src/timeout-error.md)

- [`Washington.AssertionError`](src/assertion-error.md)

Testing
-------

Washington tests are very low-level, because of course. It's almost a
miracle than a test library can be tested without collapsing in a paradox.

To run the tests, clone this repo and run:

```
npm install
npm test
```

License
-------

Copyright 2014 Xavier Via

BSD 2 Clause license.

See [LICENSE](LICENSE) attached.
