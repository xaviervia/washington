washington = require "./washington"
assert     = require "assert"
color      = require "cli-color"
log        = (message)->
  console.log color.bold message

pending    = (reason)->
  throw new Error(reason)

cleanup    = ->
  washington.reset()

################################################################################

log "Simple async test"

flag = false

example = washington "Async tests FTW", (done)->
  setTimeout ->
    done()
  , 10

washington.use
  complete: (report)->
    assert.equal report.list[0].original, example
    flag = true

example.run()

setTimeout ->
  assert.equal flag, true

  cleanup()

  ##############################################################################

  log "Async failing test"

  flag = false

  example = washington "Async tests failing", (done)->
    setTimeout ->
      done(new Error("my error"))
    , 10

  washington.use
    complete: (report)->
      assert.equal report.list[0].original, example
      flag = true

  example.run()

  setTimeout ->
    assert.equal flag, true

    cleanup()

    ############################################################################

    log "Timeout test, have to wait til timeout (3s)"

    flag = false
    message = "The example timed out before firing the `done` function"

    example = washington "This will timeout", (done)->
      "Because nothing happens here, like, ever"
      if false
        done()

    washington.use
      complete: (report)->
        assert.equal report.list[0].original, example
        assert.equal report.list[0].error.message, message
        flag = true

    example.run()

    setTimeout ->
      assert.equal flag, true

      cleanup()

      ########################################################################

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
          assert.equal report.list[0].original, example

      example.run()

      setTimeout ->
        assert.equal flag, true

        ########################################################################

        log "Reset resets timeout"

        washington.timeout = 400
        washington.reset()
        assert.equal washington.timeout == null, true

        cleanup()

        ########################################################################

        log ""
        log "Run Promise tests"
        log "---------------"
        log ""
        require "./src/promise.spec"
        
      , 400

    , 3500

  , 100

, 100
