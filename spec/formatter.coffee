formatter  = require("../washington").Formatter
assert     = require "assert"

RED        = "\u001b[31m"
GREEN      = "\u001b[32m"
YELLOW     = "\u001b[33m"
CLEAR      = "\u001b[0m"
BOLD       = "\u001b[1m"
GREY       = "\u001b[30m"

log        = (message)->
  console.log BOLD + message + CLEAR

hijack     = {}

jack       = (object, method, mock)->
  hijack[method] = object[method]
  object[method] = mock

unjack     = (object, method)->
  object[method] = hijack[method]

pending    = (reason)->
  throw new Error(reason)

module.exports = (done) ->
  #############################################################################

  log "Should log to info in green and nice whenever a success occurs and duration in grey"

  flag         = false
  message      = "This will succeed"

  jack console, "info", ()->
    assert.equal arguments[0], "%s ✌ %s%s%s (%dms)%s"
    assert.equal arguments[1], GREEN
    assert.equal arguments[2], message
    assert.equal arguments[3], CLEAR
    assert.equal arguments[4], GREY
    assert.equal arguments[5], "34"
    assert.equal arguments[6], CLEAR

    flag = true

  formatter.success
    message: "This will succeed"
    duration: -> 34

  assert.equal flag, true

  unjack hijack, "info"

  #############################################################################

  log "Should log to warn in yellow and normal whenever a pending occurs"

  flag         = false
  message      = "This is pending"

  jack console, "warn", ()->
    assert.equal arguments[0], "%s ✍ %s%s"
    assert.equal arguments[1], YELLOW
    assert.equal arguments[2], message
    assert.equal arguments[3], CLEAR

    flag = true

  formatter.pending
    message: "This is pending"

  assert.equal flag, true

  unjack hijack, "warn"

  #############################################################################

  log "Should log to error in red with the shortened stack whenever a failure occurs and duration in grey"

  flag         = false
  message      = "This fails"
  error        =
    stack: "Error: FAIL\n
    at null.function (/Users/fernando.canel/Code/remote/washington/examples/asyncFailSync.js:4:9)\n
    at Washington.Example.run (/Users/fernando.canel/Code/remote/washington/washington.js:847:24)\n
    at Function.Washington.go (/Users/fernando.canel/Code/remote/washington/washington.js:624:31)\n
    at Object.<anonymous> (/Users/fernando.canel/Code/remote/washington/examples/asyncFailSync.js:8:12)\n
    at Module._compile (module.js:444:26)\n
    at Object.Module._extensions..js (module.js:462:10)\n
    at Module.load (module.js:339:32)\n
    at Function.Module._load (module.js:294:12)\n
    at Function.Module.runMain (module.js:485:10)\n
    at startup (node.js:112:16)"

  shortened    = "Error: FAIL\n
  at null.function (/Users/fernando.canel/Code/remote/washington/examples/asyncFailSync.js:4:9)"

  jack console, "error", ()->
    assert.equal arguments[0], "%s ☞ %s%s%s (%dms)%s%s\n ☞ %s%s"
    assert.equal arguments[1], RED
    assert.equal arguments[2], message
    assert.equal arguments[3], CLEAR
    assert.equal arguments[4], GREY
    assert.equal arguments[5], "56"
    assert.equal arguments[6], CLEAR
    assert.equal arguments[7], RED
    assert.equal arguments[8], shortened
    assert.equal arguments[9], CLEAR
    flag = true

  formatter.failure
    message: "This fails"
    error: error
    duration: -> 56

  assert.equal flag, true

  unjack hijack, "error"

  #############################################################################

  log "Should log to error in red with the shortened stack from Promise"

  flag         = false
  message      = "This fails"
  error        =
    stack: "AssertionError: False as argument value, indicating assertion failure\n
    at Washington.Promise.done (/Users/fernando.canel/Code/remote/washington/washington.js:1287:13)\n
    at /Users/fernando.canel/Code/remote/washington/washington.js:850:30\n
    at null.function (/Users/fernando.canel/Code/remote/washington/examples/promise-failure.js:4:3)"

  shortened    = "AssertionError: False as argument value, indicating assertion failure"

  jack console, "error", ()->
    assert.equal arguments[0], "%s ☞ %s%s%s (%dms)%s%s\n ☞ %s%s"
    assert.equal arguments[1], RED
    assert.equal arguments[2], message
    assert.equal arguments[3], CLEAR
    assert.equal arguments[4], GREY
    assert.equal arguments[5], "56"
    assert.equal arguments[6], CLEAR
    assert.equal arguments[7], RED
    assert.equal arguments[8], shortened
    assert.equal arguments[9], CLEAR
    flag = true

  formatter.failure
    message: "This fails"
    error: error
    duration: -> 56

  assert.equal flag, true

  unjack hijack, "error"

  #############################################################################

  log "Should log to error in red with the shortened stack from a timeout"

  flag         = false
  message      = "This fails"
  error        =
    stack: "TimeoutError: Did you forgot to run the `done` function when ready?\n
    at null._onTimeout (/Users/fernando.canel/.nvm/v0.10.35/lib/node_modules/washington/washington.js:1235:23)\n
    at Timer.listOnTimeout (timers.js:88:15)"

  shortened    = "TimeoutError: Did you forgot to run the `done` function when ready?"

  jack console, "error", ()->
    assert.equal arguments[0], "%s ☞ %s%s%s (%dms)%s%s\n ☞ %s%s"
    assert.equal arguments[1], RED
    assert.equal arguments[2], message
    assert.equal arguments[3], CLEAR
    assert.equal arguments[4], GREY
    assert.equal arguments[5], "56"
    assert.equal arguments[6], CLEAR
    assert.equal arguments[7], RED
    assert.equal arguments[8], shortened
    assert.equal arguments[9], CLEAR
    flag = true

  formatter.failure
    message: "This fails"
    error: error
    duration: -> 56

  assert.equal flag, true

  unjack hijack, "error"

  #############################################################################

  log "Complete should list colored the successes, pending and failures and duration"

  flag         = false

  jack process, "exit", ->
  jack console, "log", (content)->
    assert.equal content,
                 RED + "3 failing" + CLEAR + " ∙ " +
                 YELLOW + "2 pending" + CLEAR + " ∙ " +
                 GREEN + "5 successful" + CLEAR + GREY + " (45ms)" + CLEAR
    flag = true

  formatter.complete
    successful:  -> [1, 2, 3, 4, 5]
    pending:     -> [1, 2]
    failing:     -> [1, 2, 3]
    duration:    ->
      45
    , 0

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "log"

  #############################################################################

  log "Complete should list colored the successful and pending and duration"

  flag         = false

  jack process, "exit", ->
  jack console, "log", (content)->
    assert.equal content,
                 YELLOW + "2 pending" + CLEAR + " ∙ " +
                 GREEN + "5 successful" + CLEAR + GREY + " (67ms)" + CLEAR
    flag = true

  formatter.complete
    successful:  -> [1, 2, 3, 4, 5]
    pending:     -> [1, 2]
    failing:     -> []
    duration:    ->
      67
    , 0

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "log"

  #############################################################################

  log "Complete should list colored the successful and duration in grey"

  flag         = false

  jack process, "exit", ->
  jack console, "log", (content)->
    assert.equal content,
                 GREEN + "5 successful" + CLEAR + GREY + " (98ms)" + CLEAR
    flag = true

  formatter.complete
    successful:  -> [1, 2, 3, 4, 5]
    pending:     -> []
    failing:     -> []
    duration:    ->
      98
    , 0

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "log"

  #############################################################################

  log "Complete should list colored the failing and duration in grey"

  flag         = false

  jack process, "exit", ->
  jack console, "log", (content)->
    assert.equal content,
                 RED + "5 failing" + CLEAR + GREY + " (12ms)" + CLEAR
    flag = true

  formatter.complete
    successful:  -> []
    pending:     -> []
    failing:     -> [1, 2, 3, 4, 5]
    duration:    ->
      12
    , 0

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "log"

  #############################################################################

  log "Complete should log *nothing* if no examples"

  flag         = true

  jack process, "exit", ->
  jack console, "log", ->
    flag = false

  formatter.complete
    successful:  -> []
    pending:     -> []
    failing:     -> []
    duration:    ->
      12
    , 0

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "log"

  #############################################################################

  log "Complete should list colored the pending"

  flag         = false

  jack process, "exit", ->
  jack console, "log", (content)->
    assert.equal content,
                 YELLOW + "5 pending" + CLEAR
    flag = true

  formatter.complete
    successful:  -> []
    pending:     -> [1, 2, 3, 4, 5]
    failing:     -> []
    duration:    ->
      0
    , 0

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "log"

  #############################################################################

  log "Should exit with status 0 when the code is 0"

  flag         = false
  dummyReport  =
    successful: ->
      []
    pending: ->
      []
    failing: ->
      []
    duration: ->
      0

  jack console, "log", ->
  jack process, "exit", (code)->
    assert.equal code, 0
    flag = true

  formatter.complete dummyReport, 0

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "log"

  #############################################################################

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

  #############################################################################

  log "In grey with empty sign if no examples where selected"

  flag         = false

  jack console, "warn", () ->
    assert.equal arguments[0], "%s ∅ No examples %s%s"
    assert.equal arguments[1], GREY
    assert.equal arguments[2], "selected"
    assert.equal arguments[3], CLEAR
    flag = true

  formatter.empty
    only: 2
    start: 2
    end: 4
    match: /this/
    filter: ->

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "warn"

  #############################################################################

  log "In grey with empty sign if no examples where found"

  flag         = false

  jack console, "warn", () ->
    assert.equal arguments[0], "%s ∅ No examples %s%s"
    assert.equal arguments[1], GREY
    assert.equal arguments[2], "found"
    assert.equal arguments[3], CLEAR
    flag = true

  formatter.empty({})

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "warn"

  #############################################################################

  log "In grey with umbrella sign if dry mode"

  flag         = false

  message      = "This is dry"
  jack console, "warn", () ->
    assert.equal arguments[0], "%s ☂ %s%s"
    assert.equal arguments[1], GREY
    assert.equal arguments[2], message
    assert.equal arguments[3], CLEAR
    flag = true

  formatter.dry
    message: "This is dry"

  assert.equal flag, true

  unjack process, "exit"
  unjack console, "warn"

  #############################################################################

  done()

module.exports(->) if process.argv[1] == __filename
