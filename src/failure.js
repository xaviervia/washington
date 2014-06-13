// Failure
// =======
//
// Class representing a failure to complete the example.
//
// #### Properties
//
// - message: `String`
// - function: `Function`
// - error: `Error`
// - original: `Washington`
//
// #### Constructor arguments
//
// - `Washington` original
// - `Error` error
//
"use strict"

var Failure = function (original, error) {
  this.message  = original.message
  this.function = original.function
  this.error    = error
  this.original = original
}

module.exports = Failure
