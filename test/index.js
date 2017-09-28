const test = require('ava')

const stdMocks = require('std-mocks')

const { ObjectID, Db } = require('mongodb')

const start = require('../lib')
const { oid } = require('../lib')

/*
** Tests are run in serial
*/

test('db should be undefined when connection not opened', (t) => {
	t.true(typeof start.db === 'undefined')
	t.false(start.db instanceof Db)
})

test('oid should return and ObjectID', (t) => {
	const id = oid('123456789012345678901234')
	t.true(id instanceof ObjectID)
})

test('start() should log and error if no mongodb conf defined', async (t) => {
	stdMocks.use()
	const ctx = {
		conf: {},
		log: {
			module: () => ctx.log,
			error: console.error
		}
	}
	await start.call(ctx)
	stdMocks.restore()
	const { stdout, stderr } = stdMocks.flush()
	t.false(start.db instanceof Db)
	t.is(stdout.length, 0)
	t.is(stderr.length, 1)
	t.true(stderr[0].includes('No mongodb configuration found'))
})

test('start() should open a mongodb connection', async (t) => {
	stdMocks.use()
	const ctx = {
		conf: {
			mongodb: {
				url: 'mongodb://localhost:27017/mono-mongodb'
			}
		},
		log: {
			module: () => ctx.log,
			info: console.log
		}
	}
	await start.call(ctx)
	stdMocks.restore()
	const { stdout, stderr } = stdMocks.flush()
	t.true(start.db instanceof Db)
	t.is(stderr.length, 0)
	t.is(stdout.length, 2)
	t.true(stdout[0].includes('Connecting to'))
	t.true(stdout[1].includes('Connected to'))
	// Add documents for next test
	await start.db.collection('users').insertOne({ username: 'TerraJS' })
})

test('start() should open a mongodb connection and flush the DB', async (t) => {
	stdMocks.use()
	const ctx = {
		conf: {
			mongodb: {
				url: 'mongodb://localhost:27017/mono-mongodb',
				dropDatabase: true
			}
		},
		log: {
			module: () => ctx.log,
			info: console.log
		}
	}
	await start.call(ctx)
	stdMocks.restore()
	const { stdout, stderr } = stdMocks.flush()
	t.true(start.db instanceof Db)
	t.is(stderr.length, 0)
	t.is(stdout.length, 3)
	t.true(stdout[0].includes('Connecting to'))
	t.true(stdout[1].includes('Connected to'))
	t.true(stdout[2].includes('Dropping mono-mongodb database...'))
	// Add documents for next test
	const nbUsers = await start.db.collection('users').count()
	t.is(nbUsers, 0)
})

