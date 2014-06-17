example = require "../washington"
assert     = require "assert"

example "async good", (done)->
  setTimeout ->
    done()
  , 100

example "async fail", (done)->
  setTimeout ->
    done(new Error("fail"))
  , 100

example "sync good", ->
  "good"

example "sync pending"

example "sync fail", ->
  throw new Error("fail")

example.go()
