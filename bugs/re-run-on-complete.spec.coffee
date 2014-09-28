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

###############################################################################

log "Bug: error on 'complete' causes re run"

formatter = 
  complete: ->
    throw new Error "Something Something"

washington.use formatter

washington "Test", ->

washington "Test2", ->

washington.go()