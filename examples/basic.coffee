example = require "../washington"

example "2 + 2 == 4", (done) ->
  done 2 + 2, 4

example "2 + 2 == 5", (done) ->
  done 2 + 2, 5

example "2 + 2 != 4"

example.go()
