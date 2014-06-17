// Promise
// =======
//
// Represents a promise that the example will be ready eventually.
//
// #### Properties
//
// - original: `Washington`
//
// #### Constructor arguments
//
// - `Washington` original
//
"use strict"

var Promise = function (original) {
  this.original = original
}

// done( error )
// -------------
//
// Run the `done` method when the promise is fulfilled.
//
// If there is no argument, the example is assumed to have succeeded and the
// promise will call the `succeeded` method of the original example.
//
// If there is an argument, the example is assumed to have failed and the
// argument is assumed to be an error. The error is then forwarded to the
// `failed` method of the original example.
//
// #### Arguments
//
// - _optional_ `Function` error
//
Promise.prototype.done = function (error) {

  //! If there is an error
  if (error)

    //! Call failed
    this.original.failed(error)

  //! If there was no error, assume success
  else

    //! ...and call succeeded
    this.original.succeeded()
}


module.exports = Promise
