const Joi = require('joi')
const mongoUtils = require('mongodb-utils')
const { db, findValidation, getFindOptions, FindStream } = require('../../../..')

const collection = mongoUtils(db.collection('docs'))

module.exports = [
	{
		method: 'get',
		path: '/options',
		validate: {
			query: Joi.object().keys(findValidation)
		},
		handler: (req, res) => res.json(getFindOptions(req.query))
	},
	{
		method: 'get',
		path: '/',
		validate: {
			query: Joi.object().keys(findValidation)
		},
		async handler(req, res) {
			const options = getFindOptions(req.query)
			const docs = await collection.utils.find({}, options).toArray()

			res.json(docs)
		}
	},
	{
		method: 'get',
		path: '/stream',
		validate: {
			query: Joi.object().keys({
				res: Joi.boolean().default(true),
				key: Joi.string().alphanum().optional(),
				...findValidation
			})
		},
		async handler(req, res) {
			const options = getFindOptions(req.query)
			const total = await collection.count({})
			const stream = collection.utils.find({}, options)
			const findStream = new FindStream({
				total,
				res: (req.query.res ? res : undefined),
				key: (req.query.key ? req.query.key : undefined),
				...options
			})

			stream.pipe(findStream).pipe(res)
		}
	}
]
