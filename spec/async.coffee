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

  log "Sync failure for async and abort promise"

  flag = false

  example = washington "Fail sync please", (done)->
    throw new Error "Fail sync!"
    setTimeout ->
      done()
    , 10

  thePromise = null

  washington.use
    promise: (promise)->
      thePromise = promise

    failure: (failure)->
      assert.equal failure.message, "Fail sync please"
      assert.equal failure.error.message, "Fail sync!"
      assert.equal thePromise.ready, true
      flag = true

  example.run()

  assert.equal flag, true

  cleanup()

  #############################################################################

  log "Simple async test"

  flag = false

  example = washington "Async tests FTW", (done)->
    setTimeout ->
      done()
    , 10

  washington.use
    complete: (report)->
      assert.equal report.picked[0].original, example
      flag = true

  example.run()

  setTimeout ->
    assert.equal flag, true

    cleanup()

    ###########################################################################

    log "Async failing test"

    flag = false

    example = washington "Async tests failing", (done)->
      setTimeout ->
        done(new Error("my error"))
      , 10

    washington.use
      complete: (report)->
        assert.equal report.picked[0].original, example
        flag = true

    example.run()

    setTimeout ->
      assert.equal flag, true

      cleanup()

      #########################################################################

      log "Timeout test, have to wait til timeout (3s)"

      flag = false
      message = "The example timed out before firing the `done` function"

      example = washington "This will timeout", (done)->
        "Because nothing happens here, like, ever"
        if false
          done()

      washington.use
        complete: (report)->
          assert.equal report.picked[0].original, example
          assert.equal report.picked[0].error.message, message
          flag = true

      example.run()

      setTimeout ->
        assert.equal flag, true

        cleanup()

        #######################################################################

        log "Change timeout limit"

        washington.timeout = 200

        flag = false

        example = washington "Timeout fast", (done)->
          setTimeout ->
            done()
          , 300

        washington.use
          failure: (timeout)->
            assert.equal timeout.error instanceof washington.TimeoutError, true
            flag = true

          complete: (report)->
            assert.equal report.picked[0].original, example

        example.run()

        setTimeout ->
          assert.equal flag, true

          #####################################################################

          log "Reset resets timeout"

          washington.timeout = 400
          washington.reset()
          assert.equal washington.timeout == null, true

          cleanup()

          #####################################################################

          done()

        , 400

      , 3500

    , 100

  , 100

module.exports(->) if process.argv[1] == __filename

