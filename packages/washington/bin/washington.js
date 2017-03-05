#!/usr/bin/env node
const washington = require('..')
const tests = require(process.cwd() + '/' + process.argv[2])
washington(tests)
