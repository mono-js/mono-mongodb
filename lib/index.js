const { MongoClient, ObjectID } = require('mongodb')

module.exports = async function ({ conf, log }) {
	const mongodb = conf.mono.mongodb

	if (!mongodb) throw new Error('No `mono.mongodb` configuration found')

	// Defaults
	mongodb.findLimitDefault = mongodb.findLimitDefault || 20
	mongodb.findLimitMax = mongodb.findLimitMax || 100

	log.info(`Connecting to ${mongodb.url}...`)
	let db = await MongoClient.connect(mongodb.url, mongodb.options)
	log.info(`Connected to ${db.databaseName} database`)

	/* istanbul ignore else */
	if (mongodb.dropDatabase === true) {
		log.info(`Dropping ${db.databaseName} database...`)
		await db.dropDatabase()
	}

	module.exports.db = db
	// Utils
	const utils = require('./utils')
	module.exports.getFindOptions = utils.getFindOptions
	module.exports.findValidation = utils.findValidation
	module.exports.FindStream = utils.FindStream
}

exports.oid = (id) => new ObjectID(id)

