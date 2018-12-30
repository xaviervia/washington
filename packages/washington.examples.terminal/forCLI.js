const add = x => y => x + y

const multiplication = x => y => x * y

module.exports = [
  {
    description: 'returns 2 when adding 1 and 1',
    test: () => add(1)(1),
    shouldEqual: 2
  },

  {
    description: 'returns 3 + 2 will be 5',
    test: () => add(3)(2),
    shouldEqual: 5
  },

  {
    description: 'returns 20 when multiplying 4 by 5',
    test: () => multiply(4)(5),
    shouldEqual: 20
  },

  {
    description: 'does not return 25 when multiplying 4 by 5',
    test: () => multiplication(4)(5),
    shouldEqual: 25
  },
 
  {
    description: 'complex nested object mismatch',
    test: () => ({
      alpha: [1, 2, 3],
      beta: [
        {
          gamma: 4
        }
      ]
    }),
    shouldEqual: [
      [ { alpha: 1 }, 2, 3],
      [
        {
          gamma: 4
        }, 
        {
          beta: []
        }
      ]
    ]
  },

  {
    description: 'very complex nested object mismatch',
    test: () => ([
      {
        _id: '5c292fba09538ec153476d17',
        index: 0,
        guid: 'bb827069-e0ff-4595-803e-df319cc2c98a',
        isActive: true,
        balance: '$2,822.79',
        age: 36,
        eyeColor: 'green',
        name: 'Lawson Clay',
        gender: 'male',
        company: 'KIOSK',
        email: 'lawsonclay@kiosk.com',
        phone: '+1 (945) 597-3084',
        address: '354 Catherine Street, Chical, Wisconsin, 3492',
        about: 'Minim occaecat tempor dolore ipsum cupidatat cupidatat deserunt consectetur. Magna laboris fugiat minim irure reprehenderit deserunt aliquip sint irure laborum commodo. Aute ullamco qui et exercitation aliquip. Dolore ut et exercitation ipsum ex pariatur fugiat esse labore aute. Aliqua ad nulla dolor commodo eu aliquip in minim tempor. Et elit dolor fugiat dolor dolore ut duis proident esse eu pariatur in. In qui duis nostrud ex adipisicing aliquip eiusmod incididunt sint dolore do irure commodo duis.\r\n',
        registered: '2017-02-01T12:47:14 -01:00',
        latitude: -57.139165,
        longitude: 171.522859,
        tags: [
          'pariatur',
          'exercitation',
          'nulla',
          'sint',
          'cillum',
          'dolor',
          'fugiat'
        ],
        friends: [
          {
            id: 0,
            name: 'Emilia Flynn'
          },
          {
            id: 1,
            name: 'Bradshaw Dickerson'
          },
          {
            id: 2,
            name: 'Cruz Hewitt'
          }
        ],
        greeting: 'Hello, Lawson Clay! You have 10 unread messages.',
        favoriteFruit: 'strawberry'
      },
    ]),
    shouldEqual: [
      {
        _id: '5c292fba297247e5bc6b960c',
        index: 1,
        guid: 'f397c826-f620-4d63-83e7-132b9e738721',
        isActive: true,
        balance: '$2,450.46',
        age: 24,
        eyeColor: 'green',
        name: 'Melendez Holder',
        gender: 'male',
        company: 'KATAKANA',
        email: 'melendezholder@katakana.com',
        phone: '+1 (888) 538-3271',
        address: '460 John Street, Fowlerville, Tennessee, 4034',
        about: 'Exercitation non aliqua voluptate non do. Duis duis officia sunt ullamco quis ad minim magna exercitation pariatur cillum. Id aute adipisicing sit occaecat ex exercitation adipisicing sint officia do velit ut ex eiusmod. Occaecat cupidatat eu sit tempor nostrud incididunt nostrud est magna ipsum sunt. Magna commodo nisi cillum laboris sit sint consectetur culpa.\r\n',
        registered: '2018-12-23T04:50:03 -01:00',
        latitude: -53.888673,
        longitude: -21.086638,
        tags: [
          'velit',
          'laborum',
          'quis',
          'nisi',
          'labore',
          'adipisicing',
          'deserunt'
        ],
        friends: [
          {
            id: 0,
            name: 'Kris Tyson'
          },
          {
            id: 1,
            name: 'Amber Rosales'
          },
          {
            id: 2,
            name: 'Jessie Baxter'
          }
        ],
        greeting: 'Hello, Melendez Holder! You have 10 unread messages.',
        favoriteFruit: 'apple'
      }
    ]
  },

  {
    description: 'is not defined yet'
  }
]
