# mono-mongodb

MongoDB module for [Mono](https://github.com/terrajs/mono).

## Installation

```bash
npm install --save @terrajs/mono-mongodb
```

Then, in your configuration file of your Mono application (example: `conf/application.js`):

```js
module.exports = {
  mono: {
    modules: ['@terrajs/mono-mongodb']
  }
}
```

## Configuration

Mono-MongoDB will use the `mongodb` property of your configuration (example: `conf/development.js`):

```js
module.exports = {
  mongodb: {
    url: 'mongodb://localhost:27017/my-db',
    // options property is optional
    options: {
      // See http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect
    }
  }
}
```

## Usage

In your modules files, you can access `db` instance and `oid(id)` helper like this:

```js
const { db, oid } = require('@terrajs/mono-mongodb')

const users = db.collection('users')

users.findOne({ _id: oid('554ab...' }))
```

With [TypeScript](https://github.com/Microsoft/TypeScript):

```ts
import { db, oid } from '@terrajs/mono-mongodb'
```

