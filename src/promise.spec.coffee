Promise = require "./promise"
TimeoutError = require "./timeout-error"
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

################################################################################

log "Timeout in 3 seconds if not done"

flag = false
message = "The example timed out before firing the `done` function"

example =
  function: (lala)->
    lala()

  failed: (error)->
    assert.equal error instanceof TimeoutError, true
    assert.equal error.message, message
    assert.equal error.stack.length > 0, true
    flag = true

promise = new Promise example

setTimeout ->
  assert.equal flag, true

  ##############################################################################

  log "Configure timeout"

  flag = false

  example =
    function: (lala)->
      lala()
    failed: (error)->
      flag = true

  promise = new Promise example, 100

  setTimeout ->
    assert.equal flag, true

    ############################################################################

    log "Timeout with no done function"

    flag = false

    message = "Did you forgot to run the `complete` function when ready?"

    example =
      function: (complete)->
        "This will do nothing"
      failed: (error)->
        assert.equal error.message, message
        flag = true

    promise = new Promise example, 100

    setTimeout ->
      assert.equal flag, true
    , 200

  , 200



, 4000
