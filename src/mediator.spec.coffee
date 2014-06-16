mediator = require "./mediator"
assert   = require "assert"
color    = require "cli-color"
log        = (message)->
  console.log color.bold message

pending    = (reason)->
  throw new Error(reason)


################################################################################

log "Fires events added on it"

flag = false

datumAsserter = (datum)->
  assert.equal datum, "datum"
  flag = true

result = mediator.on 'fire', datumAsserter
assert.equal result, mediator

result = mediator.trigger 'fire', ["datum"]
assert.equal result, mediator

assert.equal flag, true

################################################################################

log "Removes the event when instructed"

flag = false

result = mediator.off 'fire', datumAsserter
assert.equal result, mediator

result = mediator.trigger 'fire', ["datum"]
assert.equal result, mediator

assert.equal flag, false

################################################################################

log "Binds a full event hash when instructed"

actionFlag = false
reactionFlag = false
eventHash =
  action: (datum)->
    assert.equal datum, "actionDatum"
    actionFlag = true
  reaction: (datum)->
    assert.equal datum, "reactionDatum"
    reactionFlag = true

result = mediator.on eventHash
assert.equal result, mediator

mediator.trigger 'action', ["actionDatum"]
mediator.trigger 'reaction', ["reactionDatum"]

assert.equal actionFlag, true
assert.equal reactionFlag, true

################################################################################

log "Releases a full event hash when instructed"

actionFlag = false
reactionFlag = false

result = mediator.off eventHash
assert.equal result, mediator

mediator.trigger 'action', ["actionDatum"]
mediator.trigger 'reaction', ["reactionDatum"]

assert.equal actionFlag, false
assert.equal reactionFlag, false
