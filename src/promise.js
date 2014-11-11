// Promise
// =======
//
// Represents a promise that the example will be ready eventually.
//
// If the example is not ready in 3 seconds it fails automatically with timeout.
// You can configure the timeout in the second argument as milliseconds.
//
// #### Properties
//
// - original: `Washington`
// - ready: `Boolean`
//
// #### Constructor arguments
//
// - `Washington` original
// - _optional_ `Integer`: timeout
//
"use strict";

var TimeoutError = require("./timeout-error")

var Promise = function (original, timeout) {

  //! Fail if original is missing
  if (!original)
    throw new Error("Missing original example")

  //! Set the properties
  this.original = original
  this.ready    = false

  //! Start the timeout
  var promise = this
  setTimeout( function () {

    //! If the promise is not done
    if (!promise.ready) {

      //! Prepare message. Check the test function to ensure the use has not
      //! forgot to use the `done` function
      var message = "The example timed out before firing the `done` function"
      if (promise.original) {
        var functionMatch = /^function\s*?\(\s*(\w+?)\s*\)/
                            .exec(promise.original.function)

        //! If the function name is not present, assume that it is because
        //! the user forgot to put it there
        if(promise.original.function
              .toString()
              .substring(functionMatch[0].length)
              .indexOf(functionMatch[1]) == -1)
            message = "Did you forgot to run the `" + functionMatch[1] +
                      "` function when ready?"
      }

      promise.done( new TimeoutError(message) )
    }
  }, timeout ? timeout : 3000 )
}

// done( error )
// -------------
//
// Run the `done` method when the promise is fulfilled. Only runs if
// the promise was not `ready`.
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

  //! Do nothing if the promise is already done
  if (!this.ready) {

    //! Set the promise as ready so that the timeout is discarded
    this.ready = true

    //! If there is an error
    if (error)

      //! Call failed
      this.original.failed(error)

    //! If there was no error, assume success
    else

      //! ...and call succeeded
      this.original.succeeded()

  }

}


module.exports = Promise
