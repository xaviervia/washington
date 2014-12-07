Example
=======

Properties
----------

- message: `String` the description of the example
- function: `Function` the actual example
- duration: `Integer` the amount of time it took to run, in milliseconds

Methods
-------

### new Example( message, function ) 

Creates a new `Example` which adds itself to the global `Washington` 
instance, both to the general `list` and to the `picked` list. 

> _Warning_: Creating a example consequently overwrites the contents of 
> the `picked` list. This makes sense since the example cannot proactively
> filter itself once the criteria has been applied.

#### Arguments

- `String` message
- `Function` function

#### Returns

- `Example` example
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
Adapt it to a Failure forwarding the Error
### next()

Returns the next example on the picked list or `undefined` if this is the
last example there.

Runs the next example if available. Otherwise declares the batch to be
complete.

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
