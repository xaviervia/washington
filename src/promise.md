Promise
=======

Represents a promise that the example will be ready eventually.

If the example is not ready in 3 seconds it fails automatically with timeout.
You can configure the timeout in the second argument as milliseconds.

#### Properties

- original: `Washington`
- ready: `Boolean`

#### Constructor arguments

- `Washington` original
- _optional_ `Integer`: timeout

done( error )
-------------

Run the `done` method when the promise is fulfilled. Only runs if
the promise was not `ready`.

If there is no argument, the example is assumed to have succeeded and the
promise will call the `succeeded` method of the original example.

If there is an argument, the example is assumed to have failed and the
argument is assumed to be an error. The error is then forwarded to the
`failed` method of the original example.

#### Arguments

- _optional_ `Function` error

