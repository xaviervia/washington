formatter  = require "./formatter"
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
    stack: "ReferenceError: ArrayEllipsis is not defined\n
    at null.function (/Users/fernando.canel/Code/remote/sydney/src/endpoint.js:653:15)\n
    at Example.run (/Users/fernando.canel/Code/remote/washington/src/example.js:116:24)\n
    at Example.next (/Users/fernando.canel/Code/remote/washington/src/example.js:167:20)\n
    at Example.failed (/Users/fernando.canel/Code/remote/washington/src/example.js:265:10)\n
    at Example.run (/Users/fernando.canel/Code/remote/washington/src/example.js:124:30)\n
    at Example.next (/Users/fernando.canel/Code/remote/washington/src/example.js:167:20)\n
    at Example.failed (/Users/fernando.canel/Code/remote/washington/src/example.js:265:10)\n
    at Example.run (/Users/fernando.canel/Code/remote/washington/src/example.js:124:30)\n
    at Example.next (/Users/fernando.canel/Code/remote/washington/src/example.js:167:20)\n
    at Example.failed (/Users/fernando.canel/Code/remote/washington/src/example.js:265:10)"

  shortened    = "ReferenceError: ArrayEllipsis is not defined\n
    at null.function (/Users/fernando.canel/Code/remote/sydney/src/endpoint.js:653:15)"

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
