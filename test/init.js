const test = require('ava')
const { join } = require('path')

const { start, stop } = require('@terrajs/mono-test-utils')

const { ObjectID, Db } = require('mongodb')

const mongoModule = require('../lib')
const { oid } = require('../lib')

/*
** Tests are run in serial
*/

test('db should be undefined when connection not opened', (t) => {
	t.true(typeof mongoModule.db === 'undefined')
	t.false(mongoModule.db instanceof Db)
})

test('oid should return and ObjectID', (t) => {
	const id = oid('123456789012345678901234')
	t.true(id instanceof ObjectID)
})

test('start() should log and error if no mongodb conf defined', async (t) => {
	const ctx = await start(join(__dirname, 'fixtures/ko/'))

	t.false(mongoModule.db instanceof Db)
	t.is(ctx.stderr.length, 1)
	t.true(ctx.stderr.join().includes('No mongodb configuration found'))
	await stop(ctx.server)
})

test('start() should open a mongodb connection', async (t) => {
	const ctx = await start(join(__dirname, 'fixtures/ok/'))

	t.true(mongoModule.db instanceof Db)
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
