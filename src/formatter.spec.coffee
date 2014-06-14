formatter  = require "./formatter"
assert     = require "assert"
color      = require "cli-color"
log        = (message)->
  console.log color.bold message
hijack     = {}

pending    = (reason)->
  throw new Error(reason)

################################################################################

log "Should log to info in green and nice whenever a success occurs"

flag         = false
hijack.info  = console.info
message      = "This will succeed"

console.info = (content)->
  assert.equal content,
               color.green " ✌ " + message
  flag = true

formatter.success
  message: "This will succeed"

assert.equal flag, true

console.info = hijack.info

################################################################################

log "Should log to warn in yellow and normal whenever a pending occurs"

flag         = false
hijack.warn  = console.warn
message      = "This is pending"

console.warn = (content)->
  assert.equal content,
               color.yellow " ✍ " + message
  flag = true

formatter.pending
  message: "This is pending"

assert.equal flag, true

console.warn = hijack.warn

################################################################################

log "Should log to error in red and harsh whenever a failure occurs"

flag         = false
hijack.error = console.error
message      = "This fails"
error        = new Error "This should be there"

console.error = (content)->
  assert.equal content,
               color.red " ☜ " + message + "\n ☜ " +
                 error.stack
  flag = true

formatter.failure
  message: "This fails"
  error: error

assert.equal flag, true

console.error = hijack.error

################################################################################

log "Should exit with status 0 when the code is 0"

flag         = false
hijack.exit  = process.exit

process.exit = (code)->
  assert.equal code, 0
  flag = true

formatter.complete null, 0

assert.equal flag, true

process.exit = hijack.exit

################################################################################

log "Should exit with status two if there are two failures"

flag         = false
hijack.exit  = process.exit

process.exit = (code)->
  assert.equal code, 2
  flag = true

formatter.complete null, 2

assert.equal flag, true

process.exit = hijack.exit
