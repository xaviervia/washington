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

log "Should fire the example event on example runned"

flag = false

example = washington "Will fire", ->
  assert.equal 2 + 2, 4

washington.on "example", (current, report)->
  assert.equal current.original, example
  assert.equal report, washington
  flag = true

example.run()

assert.equal flag, true

cleanup()

################################################################################

log "on 'complete' should be called when complete"

example = washington "Full test", ->
  assert.equal 2 + 2, 4

flag = false

washington.on 'complete', (report, code)->
  assert.equal code, 0
  assert.equal report, washington
  assert.equal report.successes().length, 1
  assert.equal report.failures().length, 0
  assert.equal report.pendings().length, 0
  flag = true

washington.go()

setTimeout ->

  assert.equal flag, true
  cleanup()

  ##############################################################################

  log "on 'success' should be called when an example has succeeded"

  successFlag = false

  example = washington "Will fire", ->
    assert.equal 2 + 2, 4

  washington.on "success", (current, report)->
    assert.equal current.original, example
    assert.equal report, washington
    successFlag = true

  example.run()

  assert.equal successFlag, true

  cleanup()

  ##############################################################################

  log "on 'failure' should be called when an example has failed"

  failureFlag = false

  example = washington "Will fail", ->
    assert.equal 2 + 3, 4

  washington.on "failure", (current, report)->
    assert.equal current.original, example
    assert.equal report, washington
    failureFlag = true

  example.run()

  assert.equal failureFlag, true

  cleanup()

  ##############################################################################

  log "on 'pending' should be called when an example is pending"

  pendingFlag = false

  example = washington "Will do nothing"

  washington.on "pending", (current, report)->
    assert.equal current.original, example
    assert.equal report, washington
    pendingFlag = true

  example.run()

  assert.equal pendingFlag, true

  cleanup()

, 500
