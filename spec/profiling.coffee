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

  log "Little time for a little example"

  example = washington "will take very little to no time", ->
    assert 1 == 1

  washington.use 
    success: ->

  previousTime = new Date().getTime()

  example.run()

  afterTime = new Date().getTime()

  assert example.duration <= afterTime - previousTime

  cleanup()

  #############################################################################

  log "Little time for a little example, in the event"

  called = false

  example = washington "will take very little to no time", ->
    assert 1 == 1

  washington.use 
    success: (success) ->
      assert success.duration() is example.duration
      called = true

  example.run()

  assert called

  cleanup()

  #############################################################################

  log "Little time for a little failing example"

  example = washington "will take very little to no time", ->
    assert 1 == 2

  washington.use 
    failure: ->

  previousTime = new Date().getTime()

  example.run()

  afterTime = new Date().getTime()

  assert example.duration <= afterTime - previousTime

  cleanup()

  #############################################################################

  log "Little time for a little failing example, in the event"

  called = false

  example = washington "will take very little to no time", ->
    assert 1 == 2

  washington.use 
    failure: (failure) ->
      assert failure.duration() is example.duration
      called = true

  example.run()

  assert called

  cleanup()

  #############################################################################

  log "Moderate time for a moderate example"

  example = washington "will take a reasonable amount of time", (done) ->
    setTimeout ->
      assert 1 == 1
      done()
    , 200

  afterTime = false

  washington.use 
    success: ->
      afterTime = new Date().getTime()

  previousTime = new Date().getTime()

  example.run()

  setTimeout ->
    
    assert afterTime
    assert example.duration <= afterTime - previousTime

    cleanup()

    #############################################################################

    log "Reports total time"

    examples = 
      first: washington("will take a reasonable amount of time", (done) ->
          setTimeout ->
            assert 1 == 1
            done()
          , 200
        )
      second: washington("will take a reasonable amount of time", (done) ->
          setTimeout ->
            assert 1 == 1
            done()
          , 200
        )
    afterTime = false

    washington.use 
      complete: ->
        afterTime = new Date().getTime()

    previousTime = new Date().getTime()

    washington.go()

    setTimeout ->
      
      assert afterTime
      assert washington.duration() <= afterTime - previousTime
      assert washington.duration() > examples.first.duration
      assert washington.duration() > examples.second.duration
      assert.equal washington.duration(), examples.second.duration + examples.first.duration

      cleanup()

      #########################################################################

      done()

    , 500
  , 300

module.exports(->) if process.argv[1] == __filename
