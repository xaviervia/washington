example = require "../washington"
assert  = require "assert"

example "2 + 2 == 4", ->
  assert.equal 2 + 2, 4

example "2 + 2 == 5", ->
  assert.equal 2 + 2, 5

example "2 + 2 != 4"

example.go()
