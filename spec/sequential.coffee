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

  log "Async tests are completed before the next is executed"

  thenable = false
  thenned  = false
  complete = false

  washington "My thenable test", (done)->
    setTimeout ->
      thenable = true
      assert.equal 2, 2
      done()
    , 200

  washington "And then this will be", ->
    assert.equal thenable, true
    thenned = true

  washington.use
    complete: ->
      assert.equal thenned, true
      complete = true

  washington.go()

  setTimeout ->

    assert.equal complete, true
    cleanup()

    ###########################################################################

    done()

  , 500

module.exports(->) if process.argv[1] == __filename
