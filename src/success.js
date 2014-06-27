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

module.exports = Success
