# Washington

[![https://travis-ci.org/xaviervia/washington.svg?branch=master](https://travis-ci.org/xaviervia/washington.svg?branch=master)](https://travis-ci.org/xaviervia/washington/builds) [![npm version](https://img.shields.io/npm/v/washington.svg?maxAge=1000)](https://www.npmjs.com/package/washington)

A [pure, functional†](#why-do-you-say-this-is-functional) unit testing tool with a dependency-free test suite API.

## Installation

```
npm install washington --dev
```

Washington provides a CLI, so you can install it globally to get the `washington` command:

```
npm install -g washington
```

## Cheat sheet

#### From the command line:

```javascript
// tests.js
const add = (x, y) => x + y

module.exports = [
  {
    description: 'returns 2 when adding 1 and 1',
    test: check => check(add(1, 1)),
    shouldEqual: 2
  },
  {
    description: 'returns 4 when adding 2 and 2',
    test: check => check(add(2, 2)),
    shouldEqual: 4
  }
]
```

```
> washington test.js
```

The `washington` command exits the process with an exit code equal to the number of failing examples. This takes advantage of the fact that any non-zero exit code means that the command failed.

#### Programmatically:

```javascript
const washington = require('washington')

const add = (x, y) => x + y

washington([
  {
    description: 'returns 2 when adding 1 and 1',
    test: check => check(add(1, 1)),
    shouldEqual: 2
  }
])
```

By default the `washington` function also exits the process with an exit code equal to the number of failing examples.

#### Asynchronous examples work out of the box:

```javascript
const addLater = (x, y, callback) => {
  setTimeout(() => callback(x + y))
}

module.exports = [
  {
    description: 'will eventually add 1 and 1 and pass 2 to the callback',
    test: check => addLater(1, 1, result => check(result)),
    shouldEqual: 2
  }
]
```

#### You can compare complex object/array structures, no problem:

```javascript
module.exports = [
  {
    description: 'has the expected data structure',
    test: check => check({ a: [1, '2', false] }),
    shouldEqual: { a: [1, '2', false] }
  }
]
```

This is because assertions are done with [`assert.deepEqual`](https://nodejs.org/api/assert.html#assert_assert_deepequal_actual_expected_message).

#### There is a shorthand for synchronous examples; just return the value that you want to compare:

```javascript
const add = (x, y) => x + y

module.exports = [
  {
    description: 'returns 2 synchronously when adding 1 and 1',
    test: () => add(1, 1),
    shouldEqual: 2
  }
]
```

#### Examples without a test scenario are considered pending. Washington is your unit test to-do list:

```javascript
module.exports = [
  {
    description: 'is so test, many unit'
  },
  {
    description: 'buys milk'
  }
]
```

#### To make it work in the browser, just replace the output formatter:

```javascript
import washington from 'washington'
import washingtonFormatterBrowser from 'washington.formatter.browser'

const add = (x, y) => x + y

const suiteTask = washington(
  [
    {
      description: 'returns 3 when adding 1 and 2',
      test: check => check(add(1, 2)),
      shouldEqual: 3
    }
  ],
  { safe: true }
)

suiteTask
  .chain(washingtonFormatterBrowser(console.log))
  .run()
```

There is no [Karma](https://karma-runner.github.io/) adapter yet. Make an issue or pull request if you want one.

### Other formatters

#### Output [TAP](https://testanything.org/) instead of the default colors:

```javascript
const washington = require('washington')
const washingtonFormatterTAP = require('washington.formatter.tap')

const add = (x, y) => x + y

const suiteTask = washington(
  [
    {
      description: 'returns 2 when adding 1 and 1',
      test: check => check(add(1, 1)),
      shouldEqual: 2
    },
    {
      description: 'returns 4 when adding 2 and 2',
      test: check => check(add(2, 2)),
      shouldEqual: 4
    }    
  ],
  {safe: true}
)

suiteTask
  .chain(washingtonFormatterTAP(console.log))
  .run()
```

#### Access the test results programmatically

Maybe you want to use this tool for something else other than simple unit testing? Displaying results interactively in a REPL, in the browser, or sending them over a network…

I always thought that a library like this might be useful for exercises such as [Ruby Koans](https://github.com/edgecase/ruby_koans).

Check the [suite result object structure](#suite-result) for details on the object structure that Washington puts inside the Task.

```javascript
const washington = require('washington')

const add = (x, y) => x + y

const suiteTask = washington(
  [
    {
      description: 'returns 2 when adding 1 and 1',
      test: check => check(add(1, 1)),
      shouldEqual: 2
    },
    {
      description: 'returns 4 when adding 2 and 2',
      test: check => check(add(2, 2)),
      shouldEqual: 4
    },
    {
      description: 'gets chocolate as well'
    }
  ],
  {safe: true} // This prevents the default output formatter from running
)

suiteTask
  .map(result => {
    console.log('object structure result', result)
  })
  .run()
```

> `map` is used in this example because most users need not be familiar with `chain` and Folktale Tasks. If you are, I suggest that you use that instead.

## API

The `washington` function takes two arguments. It returns a `Task` when running `safe`. When the `safe` option `false` or not set, it will quit the process before returning.

```javascript
const suiteTask = washington(
  testSuite, // explained in the previous examples
  {
    // When set to be `safe`, washington will not actually run anything.
    // Instead, it will return a Folktale Task that you can consume
    // to add your own output formatter or manipulate the result in any
    // other way
    safe: true
  }
)

suiteTask
  .map(suiteResult => {
    console.log(suiteResult)

    return suiteResult
  })

suiteTask
  .chain(suiteResult => Task.of(suiteResult))
```

The `suiteTask` is a [Folktale Task](https://github.com/origamitower/folktale/tree/master/src/data/task). In a nutshell, that means that you can `map` or `chain` over it to get access to the results. These operations are defined in the [Fantasy Land specification](https://github.com/fantasyland/fantasy-land).

If you are not familiar with this, think of `map` and `chain` as the `then` of a Promise. In the ["Why do you say this is functional"](#why-do-you-say-this-is-functional) section there are links to great tutorials if you want to learn more.

### Suite Result

The `suiteResult` structure looks like this:

```javascript
[
  {
    description: 'some examples that is successful',
    test: () => 1 + 1,
    shouldEqual: 2,
    result: {
      type: 'success'
    }
  },
  {
    description: 'something pending',
    result: {
      type: 'pending'
    }
  },
  {
    description: 'an error',
    test: check => check(1 + 1),
    shouldEqual: 3,
    result: {
      type: 'failure',
      message: 'the error message',
      stack: [
        'a list of',
        'lines',
        'from the stack trace'
      ],
      original: new Error // Original error object
    }
  }
]
```

## A simple setup for a project using Washington as a test tool

Washington is a library and a CLI, not a testing framework. This means that it does not enforce any file structure for testing and does not do any discovery of files in your project. So, how do you set it up to use it in yours?

Say you have a project with the structure:

```
example-project/
  src/
    addition.js
    addition.test.js
  package.json
```

…and `addition.js` looks like:

```javascript
// src/addition.js
function addition (x, y) {
  return x + y
}

module.exports = addition
```

Then you can write the tests in the `addition.test.js` as follows:

```javascript
// src/addition.test.js
const addition = require('./addition')

module.exports = [
  {
    description: 'returns 2 when adding 1 and 1',
    test: check => check(addition(1, 1)),
    expectedValue: 2
  },
  {
    description: 'returns 4 when adding 1 and 3',
    test: check => check(addition(1, 3)),
    expectedValue: 4
  }
]
```

…and in the `package.json` set the test script to use Washington with that file as input:

```json
  …
  "scripts": {
    "test": "washington src/addition.test.js"
  }
  …
```

The output of this will be: // TODO image

### Working with multiple test files

OK, so what if I have another file in my project, that I want to test? Let’s add multiplication:

```diff
example-project/
  src/
    addition.js
    addition.test.js
+    multiplication.js
+    multiplication.test.js
  package.json
```

```javascript
// src/multiplication.js
function multiplication (x, y) {
  return x * y
}

module.exports = multiplication
```

```javascript
// src/multiplication.test.js
const multiplication = require('./multiplication')

module.exports = [
  {
    description: 'returns 1 when multiplying 1 by 1',
    test: check => check(multiplication(1, 1)),
    shouldEqual: 1
  },
  {
    description: 'returns 6 when multiplying 2 by 3',
    test: check => check(multiplication(2, 3)),
    shouldEqual: 6
  }
]
```

Well, the exported values of these two test files (`addition.test.js` and `multiplication.test.js`) are just arrays. There is a very simple solution here. Let’s create and `src/index.test.js`:

```diff
example-project/
  src/
    addition.js
    addition.test.js
    multiplication.js
    multiplication.test.js
+    index.test.js
  package.json
```

```javascript
// src/index.test.js
const additionTest = require('./addition.test')
const multiplicationTest = require('./multiplication.test')

module.exports = additionTest.concat(multiplicationTest)
```

…and in the `package.json`:

```json
  …
  "scripts": {
    "test": "washington src/index.test"
  }
  …
```

Remember, there is nothing fancy going on here, your test are just data, so you can feel free to manipulate them that way. You can make a script that grabs all `.test.js` file by a glob pattern and concat them all together if you feel so inclined. Washington’s only concern is that you pass in an array of example objects.

#### But what about namespaces?

Washington is an opinionated tool regarding namespaces. Washington thinks you don’t need them.

There are two reasons:

1. You can namespace you example descriptions. `'Addition: 1 and 1 give 2'`.
2. If you need a deeply nested structure of tests, there’s probably room for simplification in the app/library.

But sure some of you disagree! Well, if you for some reason you really like Washington’s approach and would like to use it, but you also really want to get a nested structure of tests, remember: examples are just plain JavaScript objects. You are more than welcome to add a `namespace` or `breadcrumbs` property to them and use it in a custom formatter to organize the output of the test suite.

## Why do you say this is functional?

> † As much as it can be in JavaScript

Washington is built on principles inspired or directly taken from the Fantasy Land community. Furthermore, the test suite is just a regular array of simple objects, there is no hidden magic or state anywhere. You can easily write your own lib that consumes the Washington example format. I believe this makes Washington fairly future proof—time will tell.

Washington is also friendly to a functional programming approach by providing a nice out-of-the-box experience for testing pure functions. Because the test cases are just plain objects, it’s easy to imagine automating test scenario generation. Washington could be easily combined with [jsverify](https://github.com/jsverify/jsverify) for this purpose.

> Shoutout to [DrBoolean](egghead.io/instructors/brian-lonsdorf) who should take credit of most of my [education in functional JavaScript](https://www.youtube.com/watch?v=h_tkIpwbsxY)

## Why "Washington"?

- George Washington gave us all a good example
- We all know that he can’t lie

## Collaborating

Tests for Washington are written in Washington. I really believe in [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) and [ain’t afraid of self reference](https://xkcd.com/917/).

This library is transpiler free. I ❤️ Babel but it’s not necessary for this.

The project is a [multi-package repo managed with Lerna](https://lernajs.io/). To get started, clone and then run:

```
> npm install
> npm run bootstrap
```

This installs lerna locally and then run `lerna bootstrap` that will set up all necessary symlinks between the packages.

## License

Copyright 2014 Fernando Vía Canel

BSD 2 Clause license

[See LICENSE](LICENSE)
