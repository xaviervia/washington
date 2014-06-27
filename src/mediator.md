Mediator
========

This is basically an EventEmitter. There are two main reasons for the
reimplementation:

- I don't know if EventEmitter methods are designed for swiss inheritance
  and Washington will implement the methods without inheriting from
  Mediator
- I want a bulk add and remove listener feature, which I call the `bind` and
  `release` methods.

on( event, callback ) | on( eventHash )
---------------------------------------

### on( event, callback )

Stores the `callback` function as a listener for the specified `event`.
If the callback was already present, does nothing.

Chainable.

#### Arguments

- `String` event
- `Function` callback

#### Returns

- `Mediator` this

### on( eventHash )

Binds all property methods of the `eventHash` as listeners in their
respective events. For example, if `on` is called with the hash:

```javascript
{
  hear: function (something) { console.log(something); },
  see: function (something) { console.log(something); },
}
```

the effect will be the same as if `on` had been called with `('hear',
function (...) {...})` and `('see', function (...) {...})`.

Chainable.

#### Arguments

- `Object` eventHash

#### Returns

- `Mediator` this

trigger( event, args )
----------------------

Fires all the listener callbacks associated with the `event`. Chainable.

#### Arguments

- `String` event
- `Array` args

#### Returns

- `Mediator` this

off( event, callback ) | off( eventHash )
-----------------------------------------

### off(event, callback)

Removes the `callback` function from the listener list to the `event`.
Does nothing if the callback was not in the list.

Chainable.

#### Arguments

- `String` event
- `Function` callback

#### Returns

- `Mediator` this

### off( eventHash )

Releases all property methods of the `eventHash` from their
respective events. For example, if `off` is called with the hash:

```javascript
{
  hear: function (something) { console.log(something); },
  see: function (something) { console.log(something); },
}
```

the effect will be the same as if `off` had been called with `('hear',
function (...) {...})` and `('see', function (...) {...})`.

Chainable.

#### Arguments

- `Object` eventHash

#### Returns

- `Mediator` this
