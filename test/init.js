const test = require('ava')
const { join } = require('path')

const { start, stop } = require('mono-test-utils')

const { ObjectID, Db } = require('mongodb')

const mongoModule = require('../lib')

/*
** Tests are run in serial
*/

test('db should be undefined when connection not opened', (t) => {
	t.true(typeof mongoModule.db === 'undefined')
	t.false(mongoModule.db instanceof Db)
})

test('start() should throw an error if no mono.mongodb conf defined', async (t) => {
	const error = await t.throws(start(join(__dirname, 'fixtures/ko/'), Error))

	t.true(error.message.includes('No `mono.mongodb` configuration found'))
})

test('start() should open a mongodb connection and give utils', async (t) => {
	const ctx = await start(join(__dirname, 'fixtures/ok/'))

	t.true(mongoModule.db instanceof Db)
	t.truthy(mongoModule.oid)
	t.true(mongoModule.oid('123456789012345678901234') instanceof ObjectID)
	t.truthy(mongoModule.findValidation)
	t.truthy(mongoModule.getFindOptions)
	t.truthy(mongoModule.FindStream)
	t.is(ctx.stderr.length, 0)
	t.true(ctx.stdout.join().includes('Connecting to'))
	t.true(ctx.stdout.join().includes('Connected to'))

	await stop(ctx.server)
})

test('start() with drop database should log', async (t) => {
	const ctx = await start(join(__dirname, 'fixtures/ok/'))

	t.true(ctx.stdout.join().includes('Dropping mono-mongodb database...'))

	await stop(ctx.server)
})
