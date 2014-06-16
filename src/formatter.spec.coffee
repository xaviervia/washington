formatter  = require "./formatter"
assert     = require "assert"
color      = require "cli-color"
log        = (message)->
  console.log color.bold message
hijack     = {}

jack       = (object, method, mock)->
  hijack[method] = object[method]
  object[method] = mock

unjack     = (object, method)->
  object[method] = hijack[method]

pending    = (reason)->
  throw new Error(reason)

################################################################################

log "Should log to info in green and nice whenever a success occurs"

flag         = false
message      = "This will succeed"

jack console, "info", (content)->
  assert.equal content,
               color.green " ✌ " + message
  flag = true

formatter.success
  message: "This will succeed"

assert.equal flag, true

unjack hijack, "info"

################################################################################

log "Should log to warn in yellow and normal whenever a pending occurs"

flag         = false
message      = "This is pending"

jack console, "warn", (content)->
  assert.equal content,
               color.yellow " ✍ " + message
  flag = true

formatter.pending
  message: "This is pending"

assert.equal flag, true

unjack hijack, "warn"

################################################################################

log "Should log to error in red and harsh whenever a failure occurs"

flag         = false
message      = "This fails"
error        = new Error "This should be there"

jack console, "error", (content)->
  assert.equal content,
               color.red " ☜ " + message + "\n ☜ " +
                 error.stack
  flag = true

formatter.failure
  message: "This fails"
  error: error

assert.equal flag, true

unjack hijack, "error"

################################################################################

log "Complete should list colored the successes, pending and failures"

flag         = false

jack process, "exit", ->
jack console, "log", (content)->
  assert.equal content,
               color.red("3 failing") + " ∙ " +
               color.yellow("2 pending") + " ∙ " +
               color.green("5 successful")
  flag = true

formatter.complete
  successful: ->
    [1, 2, 3, 4, 5]
  pending: ->
    [1, 2]
  failing: ->
    [1, 2, 3]
  , 0

assert.equal flag, true

unjack process, "exit"
unjack console, "log"

################################################################################

log "Complete should list colored the successful and pending"

flag         = false

jack process, "exit", ->
jack console, "log", (content)->
  assert.equal content,
               color.yellow("2 pending") + " ∙ " +
               color.green("5 successful")
  flag = true

formatter.complete
  successful: ->
    [1, 2, 3, 4, 5]
  pending: ->
    [1, 2]
  failing: ->
    []
  , 0

assert.equal flag, true

unjack process, "exit"
unjack console, "log"

################################################################################

log "Complete should list colored the successful"

flag         = false

jack process, "exit", ->
jack console, "log", (content)->
  assert.equal content,
               color.green("5 successful")
  flag = true

formatter.complete
  successful: ->
    [1, 2, 3, 4, 5]
  pending: ->
    []
  failing: ->
    []
  , 0

assert.equal flag, true

unjack process, "exit"
unjack console, "log"

################################################################################

log "Complete should list colored the successful"

flag         = false

jack process, "exit", ->
jack console, "log", (content)->
  assert.equal content,
               color.red("5 failing")
  flag = true

formatter.complete
  successful: ->
    []
  pending: ->
    []
  failing: ->
    [1, 2, 3, 4, 5]
  , 0

assert.equal flag, true

unjack process, "exit"
unjack console, "log"

################################################################################

log "Should exit with status 0 when the code is 0"

flag         = false
dummyReport  =
  successful: ->
    []
  pending: ->
    []
  failing: ->
    []

jack console, "log", ->
jack process, "exit", (code)->
  assert.equal code, 0
  flag = true

formatter.complete dummyReport, 0

assert.equal flag, true

unjack process, "exit"
unjack console, "log"

################################################################################

log "Should exit with status two if there are two failures"

flag         = false

jack console, "log", ->
jack process, "exit", (code)->
  assert.equal code, 2
  flag = true

formatter.complete dummyReport, 2

assert.equal flag, true

unjack process, "exit"
unjack console, "log"
