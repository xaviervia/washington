// Example
// =======
//
// Properties
// ----------
//
// - message: `String` the description of the example
// - function: `Function` the actual example
//
"use strict";

module.exports = function (Washington) {

  var Example = function (message, func) {

    //! Assign the properties
    this.message  = message
    this.function = func

    //! Add the example to the list
    Washington.list = Washington.list || []
    Washington.list.push(this)

  }

  // Methods
  // -------
  //
  // ### run()
  //
  // Runs the example.
  //
  // If the example requires an argument, it is assumed that the result will
  // be passed to the argument function, so the example becomes a promise and
  // `run` returns the `Washington.Promise`
  //
  // If the example does not require an argument, it fails or succeeds according
  // to whether the function throws an error or not. `run` then returns either a
  // `Washington.Success` or `Washington.Failure`
  //
  // If the example has no function at all, it will become a `Washington.Pending`
  //
  // #### Returns
  //
  // - `Washington.Pending` | `Washington.Failure` | `Washington.Success` |
  //   `Washington.Promise` adaptedExample
  Example.prototype.run = function () {
    var replacement

    //! The example may not be a function if it is just pending, so lets check
    if (this.function) {

      //! If the example function requires an argument
      //! it is interpreted as asynchronous
      if (this.function.length == 1) {


        //! Try catch the function call for the promise since it may fail
        //! synchronously after all
        try {

          //! Get the promise
          replacement = this.promise()

          //! Send the done function of the Promise to the example function
          //! and make sure that it doesn't lose context
          this.function(function (error) {
            replacement.done(error) })

        }

        //! If it fails
        catch (error) {

          //! Set the promise as ready so it disregards the done method and
          //! the timeout
          replacement.ready = true

          // Adapt it to a Failure forwarding the Error
          replacement = this.failed(error)

        }

      }

      //! If the example function requires no arguments
      //! it is interpreted as synchronous
      else {

        //! Attempt to run the example function
        try {
          this.function()

          //! If the function succeeds, adapt it to Success
          replacement = this.succeeded()
        }

        //! If it fails, adapt it to a Failure forwarding the Error
        catch (error) {
          replacement = this.failed(error)  }

      }

    }

    //! If there is no function set the example as Pending
    else
      replacement = this.pending()


    //! Return the adapted example
    return replacement

  }

  // ### next()
  //
  // Returns the next example on the list or `undefined` if this is the last
  // example.
  //
  // #### Returns
  //
  // - `Washington.Example` next
  Example.prototype.next = function () {

    var next = Washington
        .list
        .filter(
          (function (example, index, collection) {
            if (index > 0)
              return collection[index - 1].original === this
            else
              return false
          }).bind(this)
        )[0]

    if (next)  next.run()

    else       Washington.complete()

  }

  // ### promise()
  //
  // Starts a [`Washington.Promise`](promise.md) pointing to the current
  // example. Fires the `promise` event in `Washington` passing the `Promise`
  // as argument. Returns the `Promise`.
  //
  // #### Returns
  //
  // - `Washington.Promise` promise
  Example.prototype.promise = function () {

    //! Create the Promise (starts the timeout!)
    var promise = new Washington.Promise(this, Washington.timeout)

    //! Replace the example for the Promise in the Washington.list
    Washington.list = Washington.list.map((function (example) {
      return example === this ? promise : example
    }).bind(this))

    //! Emit the 'promise' event
    Washington.emit('promise', [promise, Washington])

    //! Return the promise
    return promise
  }

  // ### succeeded()
  //
  // Gets a [`Washington.Success`](success.md) object for this example.
  // Fires the `success` and `example` events on `Washington` passing the
  // `Success` as argument.
  //
  // #### Returns
  //
  // - `Washington.Success` success
  Example.prototype.succeeded = function () {

    //! Create the Success object
    var success = new Washington.Success(this)

    //! Replace the Example or Promise for the Success on the list
    Washington.list = Washington.list.map((function (example) {
      return example instanceof Washington.Promise ?
        (example.original === this ? success : example ) :
        (example === this ? success : example )
    }).bind(this))

    //! Emit the 'success' and 'example' events
    Washington.emit('success', [success, Washington])
    Washington.emit('example', [success, Washington])

    //! Run the next example or complete the report
    this.next()

    //! Return the Success object
    return success

  }

  // ### failed()
  //
  // Gets a [`Washington.Failure`](failure.md) object for this example.
  // Fires the `failure` and `example` events on `Washington` passing the
  // `Failure` as argument.
  //
  // #### Returns
  //
  // - `Washington.Failure` failure
  Example.prototype.failed = function (error) {

    //! Create the Failure object
    var failure = new Washington.Failure(this, error)

    //! Replace the Example or Promise for the Failure on the list
    Washington.list = Washington.list.map((function (example) {
      return example instanceof Washington.Promise ?
        (example.original === this ? failure : example ) :
        (example === this ? failure : example )
    }).bind(this))

    //! Emit the 'failure' and 'example' events
    Washington.emit('failure', [failure, Washington])
    Washington.emit('example', [failure, Washington])

    //! Run the next example or complete the report
    this.next()

    //! Return the Failure object
    return failure
  }

  // ### pending()
  //
  // Gets a [`Washington.Pending`](pending.md) object for this example.
  // Fires the `pending` and `example` events on `Washington` passing the
  // `Pending` as argument.
  //
  // #### Returns
  //
  // - `Washington.Pending` pending
  Example.prototype.pending = function () {

    //! Create the Pending object
    var pending = new Washington.Pending(this)

    //! Replace the Example for the Pending on the list
    Washington.list = Washington.list.map((function (example) {
      return example === this ? pending : example
    }).bind(this))

    //! Emit the 'pending' and 'example' events
    Washington.emit('pending', [pending, Washington])
    Washington.emit('example', [pending, Washington])

    //! Run the next example or complete the report
    this.next()

    //! Return the Pending object
    return pending
    
  }

  return Example

}
