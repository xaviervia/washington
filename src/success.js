// Success
// =======
//
// Class representing a successful to complete the example.
//
// #### Properties
//
// - message: `String`
// - function: `Function`
// - original: `Washington`
//
// #### Constructor arguments
//
// - `Washington` original
//
"use strict";

var Success = function (original) {
  this.message  = original.message
  this.function = original.function
  this.original = original
}

// Success.prototype.duration()
// ----------------------------
//
// Returns an `Integer` with the duration of the original event, in 
// milliseconds
//
// #### Returns
//
// - `Integer` duration
//
Success.prototype.duration = function() {

  //! Defensive code never hurt anybody
  if (this.original)
    return this.original.duration

}

module.exports = Success
