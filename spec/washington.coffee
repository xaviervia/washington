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

hijack     = {}

jack       = (object, method, mock)->
  hijack[method] = object[method]
  object[method] = mock

unjack     = (object, method)->
  object[method] = hijack[method]


module.exports = (done) ->

  log "Washington"
  log "=========="
  log ""

  #############################################################################

  log "Calling the function should get back an instance"

  example = washington()

  assert.equal example instanceof washington.Example, true

  cleanup()

  #############################################################################

  log "The message should be stored in the instance"

  example = washington "Message"

  assert.equal example.message, "Message"

  cleanup()

  #############################################################################

  log "The example function should also be stored"

  exampleFunction = ->
  example = washington "The message", exampleFunction

  assert.equal example.function, exampleFunction

  cleanup()

  #############################################################################

  log "The example should be registered in the list"

  example = washington "Registered"

  assert.equal washington.list.indexOf(example) != -1, true

  cleanup()

  #############################################################################

  log "The example should change itself to a Success when successful"

  washington.use "silent"

  exampleFunction = ->
    assert.equal 2 + 2, 4
  example = washington "To the infinite and beyond!", exampleFunction

  success = example.run()

  assert.equal washington.picked[0] instanceof washington.Success, true
  assert.equal washington.picked[0].message, "To the infinite and beyond!"
  assert.equal washington.picked[0].function, exampleFunction
  assert.equal washington.picked[0].original, example

  assert.equal success, washington.picked[0]

  assert.equal washington.successful()[0], washington.picked[0]

  cleanup()

  #############################################################################

  log "The example should change itself to a Failure when failing"

  washington.use "silent"

  exampleFunction = ->
    assert.equal 2 + 3, 4
  example = washington "To the failure and beyond!", exampleFunction

  errorSample = null

  try
    assert.equal 2 + 3, 4
  catch error
    errorSample = error

  failure = example.run()

  assert.equal washington.picked[0] instanceof washington.Failure, true
  assert.equal washington.picked[0].message, "To the failure and beyond!"
  assert washington.picked[0].error instanceof assert.AssertionError
  assert.equal washington.picked[0].error.message, errorSample.message
  assert.equal washington.picked[0].function, exampleFunction
  assert.equal washington.picked[0].original, example

  assert.equal failure, washington.picked[0]

  assert.equal washington.failing()[0], washington.picked[0]

  cleanup()

  #############################################################################

  log "The example should change itself to a Pending when there is no function"

  washington.use "silent"

  example = washington "This is not defined yet"

  pending = example.run()

  assert.equal washington.picked[0] instanceof washington.Pending, true
  assert.equal washington.picked[0].message, "This is not defined yet"
  assert.equal washington.picked[0].original, example

  assert.equal pending, washington.picked[0]

  assert.equal washington.pending()[0], washington.picked[0]

  cleanup()

  #############################################################################

  log "By default the formatter should be set as formatter"

  flag = false

  formatter = require "../src/formatter"

  jack washington, "on", (object)->
    if object != "example"
      assert.equal object, formatter
      flag = true

  washington.reset()

  assert.equal washington.formatter, formatter
  assert.equal flag, true

  unjack washington, "on"

  cleanup()

  #############################################################################

  log "Use should simply remove is the argument is not an object"

  flag = true
  offFlag = false

  jack washington, "on", (object)->
    flag = false

  jack washington, "off", (object)->
    assert.equal object, formatter
    offFlag = true

  washington.use "something"

  assert.equal washington.formatter, null
  assert.equal flag, true
  assert.equal offFlag, true

  unjack washington, "on"
  unjack washington, "off"

  cleanup()

  #############################################################################

  log "You should be able to replace the formatter by a different one"

  myformatFlag   = false
  formatterFlag  = false

  myformat =
    success: ->
      console.log "something"

  jack washington, "on", (object)->
    if object != "example"
      assert.equal object, myformat
      myformatFlag = true

  jack washington, "off", (object)->
    assert.equal object, formatter
    formatterFlag = true

  washington.use myformat

  assert.equal washington.formatter, myformat
  assert.equal myformatFlag, true
  assert.equal formatterFlag, true

  unjack washington, "on"
  unjack washington, "off"

  cleanup()

  #############################################################################

  log "It is not complete if there are examples not done"

  washington.picked = [new washington]
  assert.equal washington.isComplete(), false

  cleanup()

  #############################################################################

  log "It is not complete if there are promises"

  washington.picked = [new washington.Promise({})]

  washington.picked[0].ready = true # Prevent the promise from firing a timeout

  assert.equal washington.isComplete(), false

  cleanup()

  #############################################################################

  done()

module.exports(->) if process.argv[1] == __filename
