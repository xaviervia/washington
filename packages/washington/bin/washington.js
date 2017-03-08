#!/usr/bin/env node
const washington = require('..')
const tests = require(process.cwd() + '/' + process.argv[2])

if (tests instanceof Array) {
  washington(tests)
} else {
  tests.run()
}
