example = require "../washington"
assert  = require "assert"

example "2 + 2 == 5", ->
  assert.equal 2 + 2, 5

example.on "complete", (report, code)->
  console.log report.list.map (item)->
    if item instanceof example.Failure
      item.error
    else
      item.message
  process.exit code

example.go()
