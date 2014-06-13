washington = require "./washington"
assert     = require "assert"
color      = require "cli-color"
log        = (message)->
  console.log color.bold message

pending    = (reason)->
  throw new Error(reason)

cleanup    = ->
  washington.reset()

################################################################################

log "Calling the function should get back an instance"

example = washington()

assert.equal example instanceof washington, true

cleanup()

################################################################################

log "The message should be stored in the instance"

example = washington "Message"

assert.equal example.message, "Message"

cleanup()

################################################################################

log "The example function should also be stored"

exampleFunction = ->
example = washington "The message", exampleFunction

assert.equal example.function, exampleFunction

cleanup()

################################################################################

log "The example should be registered in the list"

example = washington "Registered"

assert.equal washington.list.indexOf(example) != -1, true

cleanup()

################################################################################

log "The example should change itself to a Success when successful"

exampleFunction = ->
  assert.equal 2 + 2, 4
example = washington "To the infinite and beyond!", exampleFunction

success = example.run()

assert.equal washington.list[0] instanceof washington.Success, true
assert.equal washington.list[0].message, "To the infinite and beyond!"
assert.equal washington.list[0].function, exampleFunction
assert.equal washington.list[0].original, example

assert.equal success, washington.list[0]

assert.equal washington.successes()[0], washington.list[0]

cleanup()

################################################################################

log "The example should change itself to a Failure when failing"

exampleFunction = ->
  assert.equal 2 + 3, 4
example = washington "To the failure and beyond!", exampleFunction

errorSample = null

try
  assert.equal 2 + 3, 4
catch error
  errorSample = error

failure = example.run()

assert.equal washington.list[0] instanceof washington.Failure, true
assert.equal washington.list[0].message, "To the failure and beyond!"
assert.equal washington.list[0].error instanceof assert.AssertionError, true
assert.equal washington.list[0].error.message, errorSample.message
assert.equal washington.list[0].function, exampleFunction
assert.equal washington.list[0].original, example

assert.equal failure, washington.list[0]

assert.equal washington.failures()[0], washington.list[0]

cleanup()

################################################################################

log "The example should change itself to a Pending when there is no function"

example = washington "This is not defined yet"

pending = example.run()

assert.equal washington.list[0] instanceof washington.Pending, true
assert.equal washington.list[0].message, "This is not defined yet"
assert.equal washington.list[0].original, example

assert.equal pending, washington.list[0]

assert.equal washington.pendings()[0], washington.list[0]

cleanup()

################################################################################

log "Run event tests"
require "./events.spec"

################################################################################

#log "Run async tests"
#require "./async.spec"
