import test from 'ava'

import * as stdMock from 'std-mocks'
import { ObjectID, Db } from 'mongodb'

import start, { oid, db } from '../src'

/*
** Tests are run in serial
*/

test('db should be undefined when connection not opened', (t) => {
	t.true(typeof db === 'undefined')
	t.false(db instanceof Db)
})

test('oid should return and ObjectID', (t) => {
	const id = oid('123456789012345678901234')
	t.true(id instanceof ObjectID)
})

test('start() should log and error if no mongodb conf defined', async (t) => {
	stdMock.use()
	const ctx = {
		conf: {},
		log: {
			module: () => ctx.log,
			error: console.error
		}
	}
	await start.call(ctx)
	stdMock.restore()
	const { stdout, stderr } = stdMock.flush()
	t.false(db instanceof Db)
	t.is(stdout.length, 0)
	t.is(stderr.length, 1)
	t.true(stderr[0].includes('No mongodb configuration found'))
})

test('start() should open a mongodb connection', async (t) => {
	stdMock.use()
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
	stdMock.restore()
	const { stdout, stderr } = stdMock.flush()
	t.true(db instanceof Db)
	t.is(stderr.length, 0)
	t.is(stdout.length, 2)
	t.true(stdout[0].includes('Connecting to'))
	t.true(stdout[1].includes('Connected to'))
})

