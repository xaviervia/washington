const {type} = require('zazen')

const Pending = x => ({
  '@@value': x,
  '@@type': 'Pending',
  map: f => Pending(f(x)),
  inpect: () => `Pending(${x})`,
  match: ({Pending: f}) => Pending(f(x)),
  fold: f => f(x)
})

const Failure = x => ({
  '@@value': x,
  '@@type': 'Failure',
  map: f => Failure(f(x)),
  inpect: () => `Failure(${x})`,
  match: ({Failure: f}) => Failure(f(x)),
  fold: f => f(x)
})

const Success = x => ({
  '@@value': x,
  '@@type': 'Success',
  map: f => Success(f(x)),
  inpect: () => `Success(${x})`,
  match: ({Success: f}) => Success(f(x)),
  fold: f => f(x)
})

module.exports = {
  Pending,
  Success,
  Failure
}
