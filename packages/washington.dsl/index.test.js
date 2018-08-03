const { example, suite } = require('./')

const testFunc = () => {}

module.exports = [
  {
    description: 'example: create an example object',
    test: () => example(
      'Some description',
      testFunc,
      true
    ),
    shouldEqual: {
      description: 'Some description',
      test: testFunc,
      shouldEqual: true,
    }
  },

  {
    description: 'suite: prepend title to description of all examples',
    test: () => suite(
      'prefix',
      {
        description: 'hello'
      },
      {
        description: 'test'
      }
    ),
    shouldEqual: [
      {
        description: 'prefix: hello'
      },
      {
        description: 'prefix: test'
      }
    ]
  }
]
