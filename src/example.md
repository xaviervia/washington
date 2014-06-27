Example
=======

Properties
----------

- message: `String` the description of the example
- function: `Function` the actual example

Methods
-------

### run()

Runs the example.

If the example requires an argument, it is assumed that the result will
be passed to the argument function, so the example becomes a promise and
`run` returns the `Washington.Promise`

If the example does not require an argument, it fails or succeeds according
to whether the function throws an error or not. `run` then returns either a
`Washington.Success` or `Washington.Failure`

If the example has no function at all, it will become a `Washington.Pending`

#### Returns

- `Washington.Pending` | `Washington.Failure` | `Washington.Success` |
  `Washington.Promise` adaptedExample

### next()

Returns the next example on the list or `undefined` if this is the last
example.

#### Returns

- `Washington.Example` next

### promise()

Starts a [`Washington.Promise`](promise.md) pointing to the current
example. Fires the `promise` event in `Washington` passing the `Promise`
as argument. Returns the `Promise`.

#### Returns

- `Washington.Promise` promise

### succeeded()

Gets a [`Washington.Success`](success.md) object for this example.
Fires the `success` and `example` events on `Washington` passing the
`Success` as argument.

#### Returns

- `Washington.Success` success

### failed()

Gets a [`Washington.Failure`](failure.md) object for this example.
Fires the `failure` and `example` events on `Washington` passing the
`Failure` as argument.

#### Returns

- `Washington.Failure` failure

### pending()

Gets a [`Washington.Pending`](pending.md) object for this example.
Fires the `pending` and `example` events on `Washington` passing the
`Pending` as argument.

#### Returns

- `Washington.Pending` pending
