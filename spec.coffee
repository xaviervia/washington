CLEAR      = "\u001b[0m"
BOLD       = "\u001b[1m"

log        = (message)->
  console.log BOLD + message + CLEAR



require("./spec/washington") ->



  log ""
  log "Run formatter tests"
  log "-------------------"
  log ""
  require("./src/formatter.spec") ->



    log ""
    log "Run event tests"
    log "---------------"
    log ""
    require("./spec/events") ->



      log ""
      log "Run sequential tests"
      log "--------------------"
      log ""
      require("./spec/sequential") ->



        log ""
        log "Run profiling tests"
        log "---------------"
        log ""
        require("./spec/profiling") ->



          log ""
          log "Run Async tests"
          log "---------------"
          log ""
          require("./spec/async") ->



            log ""
            log "Run picking tests"
            log "---------------"
            log ""
            require("./spec/picking") ->



              log ""
              log "Run promise tests"
              log "-----------------"
              log ""
              require("./src/promise.spec") ->



                log ""
                log "Run friendly errors tests"
                log "-------------------------"
                log ""
                require("./spec/friendly-error") ->



                  log ""
                  log "Run dry run tests"
                  log "-------------------------"
                  log ""
                  require("./spec/dry") ->

                    console.log "-----"
                    console.log "READY"
