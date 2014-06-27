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

washington.use "silent"

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

washington.use "silent"

example = washington "Full test", ->
  assert.equal 2 + 2, 4

flag = false

washington.on 'complete', (report, code)->
  assert.equal code, 0
  assert.equal report, washington
  assert.equal report.successful().length, 1
  assert.equal report.failing().length, 0
  assert.equal report.pending().length, 0
  flag = true

washington.go()

setTimeout ->

  assert.equal flag, true
  cleanup()

  ##############################################################################

  log "on 'success' should be called when an example has succeeded"

  washington.use "silent"

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

  washington.use "silent"

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

  washington.use "silent"

  pendingFlag = false

  example = washington "Will do nothing"

  washington.on "pending", (current, report)->
    assert.equal current.original, example
    assert.equal report, washington
    pendingFlag = true

  example.run()

  assert.equal pendingFlag, true

  cleanup()

  ##############################################################################

  log ""
  log "Run sequential tests"
  log "--------------------"
  log ""
  require "./sequential.spec"

, 500
