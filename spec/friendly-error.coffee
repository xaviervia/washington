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

  log "Don't fail if there are no examples, log 'none found' instead"

  formatter =
    empty: (options, report) ->
      formatter.empty.called = true

  washington.use formatter

  washington.go()

  assert formatter.empty.called

  cleanup()

  #############################################################################

  done()

module.exports(->) if process.argv[1] == __filename
