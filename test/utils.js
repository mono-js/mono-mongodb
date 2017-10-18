const test = require('ava')
const { join } = require('path')

const { start, stop, $get } = require('mono-test-utils')

let ctx

test.before('Start mono', async () => {
	ctx = await start(join(__dirname, 'fixtures/utils/'))
})

test('GET /options', async (t) => {
	const { body } = await $get(`/options`)

	t.is(body.limit, ctx.conf.mono.mongodb.findLimitDefault)
	t.is(body.offset, 0)
	t.deepEqual(body.fields, {})
	t.deepEqual(body.sort, {})
})

test('GET /options?limit=3&offset=2&sortBy=foo:desc,bar:asc,baz&fields=foo,bar', async (t) => {
	const { body } = await $get(`/options?limit=3&offset=2&sortBy=foo:desc,bar:asc,baz&fields=foo,bar`)

	t.is(body.limit, 3)
	t.is(body.offset, 2)
	t.deepEqual(body.fields, {
		foo: 1,
		bar: 1
	})
	t.deepEqual(body.sort, {
		foo: -1,
		bar: 1,
		baz: 1
	})
})

test('GET /options?limit=0 -> FAIL', async (t) => {
	const { statusCode, body } = await $get(`/options?limit=0`)

	t.is(statusCode, 400)
	t.is(body.code, 'validation-error')
	t.is(body.context[0].field[0], 'limit')
})

test('GET /options?limit=1000 -> FAIL', async (t) => {
	const { statusCode, body } = await $get(`/options?limit=1000`)

	t.is(statusCode, 400)
	t.is(body.code, 'validation-error')
	t.is(body.context[0].field[0], 'limit')
})

test('GET /', async (t) => {
	const { body } = await $get(`/`)

	t.is(body.length, 5)
})

test('GET /stream', async (t) => {
	const { body, headers } = await $get(`/stream`)

	t.is(body.limit, 5)
	t.is(body.offset, 0)
	t.is(body.total, 47)
	t.is(body.count, 5)
	t.is(body.items.length, 5)
	t.is(headers['content-type'], 'application/json; charset=utf-8')
})

test('GET /stream?key=foo', async (t) => {
	const { body } = await $get(`/stream?key=results`)

	t.falsy(body.items)
	t.is(body.results.length, 5)
})

test('GET /stream?res=false', async (t) => {
	const { headers } = await $get(`/stream?res=false`)

	t.falsy(headers['content-type'])
})

test('Check FindStream errors on constructor', async (t) => {
	const { FindStream } = require('../')

	let error = t.throws(() => new FindStream(), Error)
	t.true(error.message.includes("limit' property is required to FindStream class"))
	error = t.throws(() => new FindStream({ limit: 5 }), Error)
	t.true(error.message.includes("offset' property is required to FindStream class"))
	error = t.throws(() => new FindStream({ limit: 5, offset: 0 }), Error)
	t.true(error.message.includes("total' property is required to FindStream class"))

	const stream = new FindStream({ limit: 5, offset: 0, total: 100 })
	t.true(stream instanceof FindStream)
})


test.after('Stop mono', async () => {
	await stop(ctx.server)
})
