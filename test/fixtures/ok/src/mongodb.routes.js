const { db, oid } = require('../../../..')

module.exports = [
	{
		method: 'get',
		path: '/mongodb/:value',
		async handler(req, res) {
			const value = req.params.value

			const user = await db.collection('users').findOne({
				_id: oid(value)
			})

			res.json(user)
		}
	},
	{
		method: 'post',
		path: '/mongodb',
		async handler(req, res) {
			await db.collection('users').insertOne(req.body)

			res.json(req.body)
		}
	},
	{
		method: 'put',
		path: '/mongodb/:value',
		async handler(req, res) {
			const value = req.params.value
			const set = { $set: req.body }

			await db.collection('users').updateOne({ _id: oid(value) }, set, { upsert: true })

			res.json({ ok: true })
		}
	},
	{
		method: 'delete',
		path: '/mongodb/:value',
		async handler(req, res) {
			const value = req.params.value

			const result = await db.collection('users').deleteOne({ _id: oid(value) })
			if (!result.deletedCount) throw new HttpError('no-document-found', 404)
			res.json({ ok: true })
		}
	}
]
