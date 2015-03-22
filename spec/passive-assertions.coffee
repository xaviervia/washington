washington = require "../washington"
assert     = require "assert"
CLEAR      = "\u001b[39m"
BOLD       = "\u001b[1m"
log        = (message)->
  console.log BOLD + message + CLEAR

pending    = (reason)->
  throw new Error(reason)

cleanup    = ->
  washington.reset()

module.exports = (done) ->

  #############################################################################

  log "Should fail with a regular error if return value is false"

  washington.use "silent"

  flag = false

  example = washington "Will fail because of false return value", ->
    (2 + 2) is 3

  washington.on "failure", (current)->
    assert current.error instanceof washington.AssertionError
    assert.equal current.error.message, "False as return value, indicating assertion failure"
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should propagate the error sent as return value"

  washington.use "silent"

  flag = false

  daError = Error "Nice way to fail bro"

  example = washington "Will fail because return value is an Error", -> daError

  washington.on "failure", (current)->
    assert current.error is daError
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should send the string typed return value as an AssertionError message"

  washington.use "silent"

  flag = false

  example = washington "Will fail because return value is an Error", ->
    "The message is failure"

  washington.on "failure", (current)->
    assert current.error instanceof washington.AssertionError
    assert.equal current.error.message, "The message is failure"
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should succeed on true return value"

  washington.use "silent"

  flag = false

  example = washington "Will fail because return value is an Error", -> true

  washington.on "success", (current)->
    assert current.original is example
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should fail with a regular error if argument for `done` is false"

  washington.use "silent"

  flag = false

  example = washington "Will fail because of false return value", (done)->
    done false

  washington.on "failure", (current)->
    assert current.error instanceof washington.AssertionError
    assert.equal current.error.message, "False as argument value, indicating assertion failure"
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should propagate the error sent as argument for `done`"

  washington.use "silent"

  flag = false

  daError = Error "Nice way to fail bro"

  example = washington "Will fail because return value is an Error", (done) ->
    done daError

  washington.on "failure", (current)->
    assert current.error is daError
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should send the string typed `done` argument as an AssertionError message"

  washington.use "silent"

  flag = false

  example = washington "Will fail because return value is an Error", (done)->
    done "The message is failure"

  washington.on "failure", (current)->
    assert current.error instanceof washington.AssertionError
    assert.equal current.error.message, "The message is failure"
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should succeed on true `done` argument"

  washington.use "silent"

  flag = false

  example = washington "Will fail because return value is an Error", (done)->
    done true

  washington.on "success", (current)->
    assert current.original is example
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should succeed on === `done` arguments"

  washington.use "silent"

  flag = false

  example = washington "Will succeed because arguments are ===", (done) ->
    done "supposed to fail?", "supposed to fail?"

  washington.on "success", (current)->
    assert current.original is example
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should fail on !== `done` arguments"

  washington.use "silent"

  flag = false

  example = washington "Will succeed because arguments are ===", (done) ->
    done "supposed to fail?", "will fail!"

  washington.on "failure", (current)->
    assert current.original is example
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should fail on !== `done` arguments and have arguments as error props"

  washington.use "silent"

  flag = false

  example = washington "Will succeed because arguments are ===", (done) ->
    done "supposed to fail?", "will fail!"

  washington.on "failure", (current)->
    assert current.original is example
    assert current.error.got is "supposed to fail?"
    assert current.error.want is "will fail!"
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Should fail and have the `got` and `want` in the message when done is called with two different arguments"

  washington.use "silent"

  flag = false

  example = washington "Will fail because of different arguments", (done)->
    done "what we got", "what we want"

  washington.on "failure", (current) ->
    assert current.error instanceof washington.AssertionError
    assert.equal current.error.message, "\n\tgot:\twhat we got\n\twant:\twhat we want"
    flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  done()

module.exports(->) if process.argv[1] == __filename
