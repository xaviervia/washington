// Example
// =======
//
// Properties
// ----------
//
// - message: `String` the description of the example
// - function: `Function` the actual example
//
"use strict"

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
  // Returns the next example on the list or undefined if this is the last
  // example.
  //
  // #### Returns
  //
  // - `Washington.Example` next
  Example.prototype.next = function () {

    return Washington
        .list
        .filter(
          (function (example, index, collection) {
            if (index > 0)
              return collection[index - 1].original === this
            else
              return false
          }).bind(this)
        )[0]

  }

  // ### promise()
  //
  // Starts a [`Washington.Promise`](promise.md) pointing to the TODO
  Example.prototype.promise = function () {
    var promise = new Washington.Promise(this, Washington.timeout)
    var current = this
    Washington.list = Washington.list.map(function (example) {
      return example === current ? promise : example
    })
    Washington.trigger('promise', [promise, Washington])
    return promise
  }

  Example.prototype.succeeded = function () {
    var success = new Washington.Success(this)
    var current = this
    Washington.list = Washington.list.map(function (example) {
      return example instanceof Washington.Promise ?
        (example.original === current ? success : example ) :
        (example === current ? success : example )
    })
    Washington.trigger('success', [success, Washington])
    Washington.trigger('example', [success, Washington])

    this.next() ?
      this.next().run() :
      Washington.complete()

    return success
  }

  Example.prototype.failed = function (error) {
    var failure = new Washington.Failure(this, error)
    var current = this
    Washington.list = Washington.list.map(function (example) {
      return example instanceof Washington.Promise ?
        (example.original === current ? failure : example ) :
        (example === current ? failure : example )
    })
    Washington.trigger('failure', [failure, Washington])
    Washington.trigger('example', [failure, Washington])

    this.next() ?
      this.next().run() :
      Washington.complete()

    return failure
  }

  Example.prototype.pending = function () {
    var pending = new Washington.Pending(this)
    var current = this
    Washington.list = Washington.list.map(function (example) {
      return example === current ? pending : example
    })
    Washington.trigger('pending', [pending, Washington])
    Washington.trigger('example', [pending, Washington])

    this.next() ?
      this.next().run() :
      Washington.complete()

    return pending
  }

  return Example

}
