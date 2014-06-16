// Mediator
// ========
//
// This is basically an EventEmitter. There are two main reasons for the
// reimplementation:
//
// - I don't know if EventEmitter methods are designed for swiss inheritance
//   and Washington will implement the methods without inheriting from
//   Mediator
// - I want a bulk add and remove listener feature, which I call the `bind` and
//   `release` methods.
var Mediator = {

  // on( event, callback ) | on( eventHash )
  // ---------------------------------------
  //
  // ### on( event, callback )
  //
  // Stores the `callback` function as a listener for the specified `event`.
  // If the callback was already present, does nothing.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `String` event
  // - `Function` callback
  //
  // #### Returns
  //
  // - `Mediator` this
  //
  // ### on( eventHash )
  //
  // Binds all property methods of the `eventHash` as listeners in their
  // respective events. For example, if `on` is called with the hash:
  //
  // ```javascript
  // {
  //   hear: function (something) { console.log(something); },
  //   see: function (something) { console.log(something); },
  // }
  // ```
  //
  // the effect will be the same as if `on` had been called with `('hear',
  // function (...) {...})` and `('see', function (...) {...})`.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `Object` eventHash
  //
  // #### Returns
  //
  // - `Mediator` this
  on: function (event, callback) {

    //! If no callback, event hash assumed
    if (!callback) {

      //! Store this
      var mediator = this

      //! For each key in the hash
      Object.keys(event).forEach(function (key) {

      //! If the property named with the key is a function
      if (event[key] instanceof Function)

        //! ...add the function as a listener to the event named after the key
        mediator.on(key, event[key]) })

    }

    //! If there is a callback this is setting a single event listener
    else {

      //! Create the event listeners hash if there wasn't one
      this.listeners = this.listeners || {}

      //! Create the listeners array for the event if there wasn't one
      this.listeners[event] = this.listeners[event] || []

      //! If the given callback was not present
      if (this.listeners[event].indexOf(callback) == -1)

        //! Store the callback
        this.listeners[event].push(callback)

    }

    //! Return this for chainability
    return this

  },

  // trigger( event, args )
  // ----------------------
  //
  // Fires all the listener callbacks associated with the `event`. Chainable.
  //
  // #### Arguments
  //
  // - `String` event
  // - `Array` args
  //
  // #### Returns
  //
  // - `Mediator` this
  trigger: function (event, args) {

    //! If there is a listeners hash
    if (this.listeners && this.listeners instanceof Object &&

        //! ...and there is an array for the event
        this.listeners[event] instanceof Array)

        //! Iterate the listeners
        this.listeners[event].forEach(function (listener) {

          //! ...and run 'em!
          listener.apply(null, args) })

    //! Return this for chainability
    return this

  },

  // off( event, callback ) | off( eventHash )
  // -----------------------------------------
  //
  // ### off(event, callback)
  //
  // Removes the `callback` function from the listener list to the `event`.
  // Does nothing if the callback was not in the list.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `String` event
  // - `Function` callback
  //
  // #### Returns
  //
  // - `Mediator` this
  //
  // ### off( eventHash )
  //
  // Releases all property methods of the `eventHash` from their
  // respective events. For example, if `off` is called with the hash:
  //
  // ```javascript
  // {
  //   hear: function (something) { console.log(something); },
  //   see: function (something) { console.log(something); },
  // }
  // ```
  //
  // the effect will be the same as if `off` had been called with `('hear',
  // function (...) {...})` and `('see', function (...) {...})`.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `Object` eventHash
  //
  // #### Returns
  //
  // - `Mediator` this
  off: function (event, callback) {

    //! If there is no callback assumed to be an eventHash
    if (!callback) {

      //! Store this
      var mediator = this

      //! For each key in the hash
      Object.keys(event).forEach(function (key) {

        //! If the property named with the key is a function
        if (event[key] instanceof Function)

          //! ...remove the function from the listeners' list of the event
          //! named after the key
          mediator.off(key, event[key]) })

    }

    //! If there is a callback this is removing a single event listener
    else

      //! You can't be to careful. Check everything is in place.
      if (this.listeners && this.listeners instanceof Object &&
          this.listeners[event] instanceof Array)

          //! Filter out the callback
          this.listeners[event] =
            this.listeners[event]
              .filter(function (listener) {
                return listener !== callback })

    //! Returns this for chainability
    return this

  }

}

module.exports = Mediator
