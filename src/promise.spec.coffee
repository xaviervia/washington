Promise = require "./promise"
assert  = require "assert"
color      = require "cli-color"
log        = (message)->
  console.log color.bold message

pending    = (reason)->
  throw new Error(reason)

################################################################################

log "Done successful: should call the succeeded from the example"

flag = false

example =
  succeeded: ->
    flag = true

promise = new Promise example
promise.done()

assert.equal flag, true

################################################################################

log "Done failing: should call the failing from the example with the error"

flag = false

exception = new Error

example =
  failed: (error)->
    assert.equal error, exception
    flag = true

promise = new Promise example
promise.done(exception)

assert.equal flag, true
