washington = require "../washington"
assert     = require "assert"
CLEAR      = "\u001b[0m"
BOLD       = "\u001b[1m"

log        = (message)->
  console.log BOLD + message + CLEAR

pending    = (reason)->
  throw new Error(reason)

cleanup    = ->
  washington.reset()

module.exports = (done) ->

  #############################################################################

  log "I can pick which example range to run"

  washington "Please don't run this everytime", ->

  washington "Run this instead", ->

  washington "And this", ->

  washington "And this!", ->

  washington "But not this either!", ->

  formatter = 
    success: (example)->
    complete: (report, code) ->

  washington.use formatter

  washington.go
    start: 2
    end: 4

  assert.equal washington.successful().length, 3

  assert washington.list[0] instanceof washington.Example
  assert washington.list[1] instanceof washington.Example
  assert washington.list[2] instanceof washington.Example
  assert washington.list[3] instanceof washington.Example
  assert washington.list[4] instanceof washington.Example

  assert washington.picked[0] instanceof washington.Success
  assert washington.picked[1] instanceof washington.Success
  assert washington.picked[2] instanceof washington.Success

  assert.equal washington.picked[0].message, "Run this instead"
  assert.equal washington.picked[1].message, "And this"
  assert.equal washington.picked[2].message, "And this!"

  cleanup()

  #############################################################################

  log "I can pick a single number to run"

  washington "First", ->
  washington "Second", ->

  washington.use {}

  washington.go only: 1

  assert washington.picked[0] instanceof washington.Success
  assert.equal washington.picked[0].message, "First"
  assert.equal washington.picked.length, 1

  cleanup()

  #############################################################################

  log "I can apply a regex on the names"

  washington "There will not", ->
  washington "Will not", ->
  washington "Will", ->

  washington.use {}

  washington.go match: /not/

  assert.equal washington.picked.length, 2
  assert.equal washington.picked[0].message, "There will not"
  assert.equal washington.picked[1].message, "Will not"

  cleanup()

  #############################################################################

  log "I can provide a filtering lambda"

  washington "There will not", (done) ->
    done()

  washington "Will not", ->
  washington "Will", ->

  washington.use {}

  washington.go filter: (example, index, list) ->
    assert.equal list, washington.picked
    example.function.length > 0

  assert.equal washington.picked.length, 1
  assert.equal washington.picked[0].message, "There will not"

  cleanup()

  #############################################################################

  log "Precedence: start > end > match > filter"

  washington "Not because START *MATCH*", ->
  washington "Not because NOTMATCH", ->
  washington "No because FILTER *MATCH*", ->
  washington "Not YES *MATCH*", ->
  washington "Not because END *MATCH*", ->

  washington.use {}

  washington.go
    start: 2
    end: 4
    match: /\*MATCH\*/
    filter: (example) -> example.message.match "Not"

  assert.equal washington.picked.length, 1
  assert.equal washington.picked[0].message, "Not YES *MATCH*"

  cleanup()

  #############################################################################

  log "empty & complete events: no examples selected, forward options and list"

  washington "Not because START *MATCH*", ->
  washington "Not because NOTMATCH", ->
  washington "No because FILTER *MATCH*", ->
  washington "Not because END *MATCH*", ->

  options = 
    start: 2
    end: 3
    match: /\*MATCH\*/
    filter: (example) -> example.message.match "Not"

  washington.use
    empty: (reasons, report) ->
      assert.equal reasons, options
      assert.equal report, washington
      @emptyCalled = true
    complete: ->
      assert @emptyCalled
      @completeCalled = true

  washington.go options

  assert.equal washington.picked.length, 0
  assert washington.formatter.emptyCalled
  assert washington.formatter.completeCalled

  cleanup()

  #############################################################################

  # log "I can use a namespace for sets of examples"

  #############################################################################

  done()

module.exports(->) if process.argv[1] == __filename