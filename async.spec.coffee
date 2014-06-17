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

log "Simple async test"

flag = false

example = washington "Async tests FTW", (done)->
  setTimeout ->
    done()
  , 10

washington.use
  complete: (report)->
    assert.equal report.list[0].original, example
    flag = true

example.run()

setTimeout ->
  assert.equal flag, true

  cleanup()

  ##############################################################################

  log "Async failing test"

  flag = false

  example = washington "Async tests failing", (done)->
    setTimeout ->
      done(new Error("my error"))
    , 10

  washington.use
    complete: (report)->
      assert.equal report.list[0].original, example
      flag = true

  example.run()

  setTimeout ->
    assert.equal flag, true
  , 100

, 100
