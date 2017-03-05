# Washington

[![https://travis-ci.org/xaviervia/washington.svg?branch=master](https://travis-ci.org/xaviervia/washington.svg?branch=master)](https://travis-ci.org/xaviervia/washington/builds) [![npm version](https://img.shields.io/npm/v/washington.svg?maxAge=10000)](https://www.npmjs.com/package/washington)

A pure, functional—as much as it can be in JavaScript—unit testing tool with a straightforward API.

## Installation

```
npm install washington --dev
```

## Cheat sheet

#### Programmatically:

```javascript
import washington, {example} from 'washington'

washington(
  example('1 + 1 is 2', check => check(1 + 1), 2)
)
```

#### From the command line:

```javascript
// test.js
import {example} from 'washington'

export default example('1 + 1 is 2', check => check(1 + 1), 2)
```

```
> washington test.js
```

#### Asynchronous examples work out of the box:

```javascript
example('value will be 1', check => setTimeout(() => check(1)), 1)
```

#### You can compare complex object/array structures, no problem:

Assertions are done with `assert.deepEqual`, so this works out of the box as well.

```javascript
example(
  'the object should have the expected structure',
  check => check({ a: [1, '2', false] }),
  { a: [1, '2', false] }
)
```

#### There is a shorthand for synchronous examples: just return the value:

```javascript
example('1 + 1 is 2 and synchronously so', () => 1 + 1, 2)
```

#### Examples without a test scenario are considered pending. Washington is your unit test to-do list:

```javascript
example('so test, many unit')
```

#### To make it work in the browser, just replace the output formatter:

```javascript
import washington, {example, suite} from 'washington'
import washingtonFormatterBrowser from 'washington.formatter.browser'

const suiteTask = washington(
  example('1 + 2 is 3', check => check(1 + 2), 3),
  { safe: true }
)

washingtonFormatterBrowser(suiteTask).run()
```

There is no [Karma](https://karma-runner.github.io/) adapter yet. Make an issue or pull request if you want one.

#### The `example` helper function is completely optional.

Its just a shorthand to create the example object. You can do this as well:

```javascript
import washington from 'washington'

washington({
  description: '1 + 1 is 2',
  test: check => check(1 + 1),
  expectedValue: 2
})
```

Choose the style that suits you better.

#### A test suite is just an array of tests:

```javascript
import washington from 'washington'

washington([
  {
    description: '1 + 1 is 2',
    test: check => check(1 + 1),
    expectedValue: 2
  },
  {
    description: '2 + 2 is 4',
    test: check => check(2 + 2),
    expectedValue: 4
  }
])
```

…or

```javascript
import washington, {example} from 'washington'

washington([
  example('1 + 1 is 2', check => check(1 + 1), 2),
  example('2 + 2 is 4', check => check(2 + 2), 4)
])
```

…or with the fancy `suite` (that just creates an Array with the arguments, but damn it looks sweet):

```javascript
import washington, {example, suite} from 'washington'

washington(
  suite(
    example('1 + 1 is 2', check => check(1 + 1), 2),
    example('2 + 2 is 4', check => check(2 + 2), 4)
  )
)
```

#### Output [TAP](https://testanything.org/) instead of the default colors:

```javascript
const washington = require('washington')
const washingtonFormatterTAP = require('washington.formatter.tap')
const {example, suite} = washington

const suiteTask = washington(
  suite(
    example('1 + 1 is 2', check => check(1 + 1), 2),
    example('2 + 2 is 4', check => check(2 + 2), 4)
  ),
  {safe: true}
)

washingtonFormatterTAP(suiteTask).run()
```

#### Get JSON output instead of the default colors:

```javascript
const washington = require('washington')
const washingtonFormatterJSON = require('washington.formatter.json')
const {example, suite} = washington

const suiteTask = washington(
  suite(
    example('1 + 1 is 2', check => check(1 + 1), 2),
    example('2 + 2 is not 5', check => check(2 + 2), 5),
    example('get chocolate as well')
  ),
  {safe: true}
)

washingtonFormatterJSON(suiteTask)
  .map(result => {
    console.log('object structure result', result)
     // => [ { status: 'success',
     //    description: '1 + 1 is 2',
     //    expectedValue: 2 },
     //  { status: 'failure',
     //    description: '2 + 2 is not 5',
     //    expectedValue: 5,
     //    message: '4 deepEqual 5',
     //    stack:
     //     [ 'AssertionError: 4 deepEqual 5',
     //       'at matchesExpectation …' ] },
     //  { status: 'pending', description: 'get chocolate as well' } ]  
  })
  .run()
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
    description: 'adding 1 and 1 gives 2',
    test: check => check(addition(1, 1)),
    expectedValue: 2
  },
  {
    description: 'adding 1 and 3 gives 4',
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

> Note that the above code is not using the Washington helpers for constructing the examples. The intention is to make it transparent to you right now that the example scenarios that Washington works with are plain JavaScript objects. This opens up a plethora of opportunities to organize your tests as it better pleases you.

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
    description: 'multiplying 1 by 1 gives 1',
    test: check => check(multiplication(1, 1)),
    expectedValue: 1
  },
  {
    description: 'multiplying 2 by 3 gives 6',
    test: check => check(multiplication(2, 3)),
    expectedValue: 6
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

Washington is built on principles inspired or directly taken from the Fantasy Land community. Furthermore, the test suite is just a regular array of simple objects, there is no hidden magic or state anywhere. You can easily write your own lib that consumes the Washington example format. In this sense Washington aims to be also future proof.

> Shoutout to [DrBoolean](egghead.io/instructors/brian-lonsdorf) who should take credit of most of my [education in functional JavaScript](https://www.youtube.com/watch?v=h_tkIpwbsxY)

## Why "Washington"?

- George Washington gave us all a good example
- We all know that he can’t lie

## Collaborating

Tests for Washington are written in Washington. I really believe in [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) and [ain’t afraid of self reference](https://xkcd.com/917/).

This library is transpiler free. I ❤️ Babel but it’s not necessary for this.

## License

Copyright 2014 Fernando Vía Canel

BSD 2 Clause license

[See LICENSE](LICENSE)
