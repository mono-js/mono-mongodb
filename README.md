<h1 align="center"><img src="https://user-images.githubusercontent.com/904724/31045645-b07f9efa-a5e8-11e7-920a-5d82282dc166.png" width="350" alt="Mono"/></h1>

> MongoDB module for [Mono](https://github.com/terrajs/mono)

[![npm version](https://img.shields.io/npm/v/mono-mongodb.svg)](https://www.npmjs.com/package/mono-mongodb)
[![Travis](https://img.shields.io/travis/terrajs/mono-mongodb/master.svg)](https://travis-ci.org/terrajs/mono-mongodb)
[![Coverage](https://img.shields.io/codecov/c/github/terrajs/mono-mongodb/master.svg)](https://codecov.io/gh/terrajs/mono-mongodb.js)
[![license](https://img.shields.io/github/license/terrajs/mono-mongodb.svg)](https://github.com/terrajs/mono-mongodb/blob/master/LICENSE)

## Installation

```bash
npm install --save mono-mongodb
```

Then, in your configuration file of your Mono application (example: `conf/application.js`):

```js
module.exports = {
  mono: {
    modules: ['mono-mongodb']
  }
}
```

## Configuration

Mono-MongoDB will use the `mongodb` property of your configuration (example: `conf/development.js`):

```js
module.exports = {
  mono: {
    mongodb: {
      // url is required
      url: 'mongodb://localhost:27017',
      dbName: 'my-db',
      // Drop database at launch (default: false)
      dropDatabase: true,
      // Used in utils find
      findLimitDefault: 20, // default value
      findLimitMax: 100, // default value
      // options property for node mongodb driver
      options: {
        // See http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect
      }
    }
  }
}
```

You can set `mongodb.dropDatabase: true` to drop the database when connected (useful for tests).

## Usage

In your modules files, you can access `db` instance like this:

```js
const { db, oid } = require('mono-mongodb')

const collection = db.collection('users')

collection.findOne({ _id: oid('554ab...' }))
```

## Utils

```js
const { oid, findValidation, getFindOptions, FindStream } = require('mono-mongodb')
```

- `oid(id: string): ObjectID`
- `findValidation: Object`: Joi object used for route validation inside Mono
- `getFindOptions(req.query): Object`: Method to transform `req.query` into a compatible object for MongoDB `find`
- `new FindStream({ total, limit, offset, res?, key = 'items' }): TransformStream`: Used for streaming MongoDB find cursor back to the server response

The last 3 methods are useful to create easily listing routes with pagination, sorting and fields restriction, best used in combination with [mongodb-utils find()](https://github.com/terrajs/mongodb-utils#find).

You can see an example of how to use it in `test/fixtures/utils/src/utils.routes.js`.
