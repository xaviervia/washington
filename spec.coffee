CLEAR      = "\u001b[0m"
BOLD       = "\u001b[1m"

log        = (message)->
  console.log BOLD + message + CLEAR



require("./washington.spec") -> 
  


  log ""
  log "Run formatter tests"
  log "-------------------"
  log ""
  require("./src/formatter.spec") ->



    log ""
    log "Run event tests"
    log "---------------"
    log ""
    require("./events.spec") ->



      log ""
      log "Run sequential tests"
      log "--------------------"
      log ""
      require("./sequential.spec") ->



        log ""
        log "Run profiling tests"
        log "---------------"
        log ""
        require("./profiling.spec") ->



          log ""
          log "Run Async tests"
          log "---------------"
          log ""
          require("./async.spec") ->



            log ""
            log "Run promise tests"
            log "-----------------"
            log ""
            require("./src/promise.spec") ->
              console.log "-----"
              console.log "READY"
