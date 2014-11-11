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

module.exports = (done) ->

  #############################################################################

  log "Dry run examples"

  listener =
    dry: (example) ->
      @dry.calls = @dry.calls or []
      @dry.calls.push example

  washington.use listener

  washington 'Example', -> 10
  washington 'Pending example'
  washington 'Failing example', -> assert 1 is 2
  washington 'Async example', (done) ->

  washington.go
    dry: true

  assert.equal listener.dry.calls[0].message, 'Example'
  assert.equal listener.dry.calls[1].message, 'Pending example'
  assert.equal listener.dry.calls[2].message, 'Failing example'
  assert.equal listener.dry.calls[3].message, 'Async example'

  cleanup()

  #############################################################################

  log "Filtered dry run examples"

  listener =
    dry: (example) ->
      @dry.calls = @dry.calls or []
      @dry.calls.push example

  washington.use listener

  washington 'Example', -> 10
  washington 'Pending example'
  washington 'Failing example', -> assert 1 is 2
  washington 'Async example', (done) ->

  washington.go
    match: 'example'
    dry: true

  assert.equal listener.dry.calls[0].message, 'Pending example'
  assert.equal listener.dry.calls[1].message, 'Failing example'
  assert.equal listener.dry.calls[2].message, 'Async example'

  cleanup()

  #############################################################################

  done()

module.exports(->) if process.argv[1] == __filename
