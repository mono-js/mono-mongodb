const test = require('ava')
const { join } = require('path')

const { start, stop, $post, $get, $put, $delete } = require('@terrajs/mono-test-utils')

let ctx
let user = {
	username: 'test'
}

test.before('Start mono', async () => {
	ctx = await start(join(__dirname, 'fixtures/ok/'))
})

test('$delete', async (t) => {
	const error = await $delete(`/mongodb/59ce504fa1280c6990c03890`)

	t.is(error.body.code, 'no-document-found')
})

test('$post', async (t) => {
	const { body } = await $post('/mongodb', {
		body: user
	})

	user = body
	t.deepEqual(body, user)
})

test('$get', async (t) => {
	const { body } = await $get(`/mongodb/${user._id}`)

	t.deepEqual(body, user)
})

test('$put', async (t) => {
	user.username = 'test2'

	const { body } = await $put(`/mongodb/${user._id}`, {
		body: { username: user.username }
	})

	t.deepEqual(body, { ok: true })
})

test.after('Stop mono', async () => {
	await stop(ctx.server)
})
