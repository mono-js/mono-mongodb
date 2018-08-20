const { MongoClient, ObjectID } = require('mongodb')

module.exports = async function ({ conf, log }) {
	const mongodb = conf.mono.mongodb

	if (!mongodb) throw new Error('No `mono.mongodb` configuration found')
	if (!mongodb.url) throw new Error('No `mono.mongodb.url` configuration found')
	if (!mongodb.dbName) throw new Error('No `mono.mongodb.dbName` configuration found')

	// Defaults
	mongodb.findLimitDefault = mongodb.findLimitDefault || 20
	mongodb.findLimitMax = mongodb.findLimitMax || 100

	log.info(`Connecting to ${mongodb.url}...`)
	const client = await MongoClient.connect(mongodb.url, { useNewUrlParser: true, ...mongodb.options })
	const db = client.db(mongodb.dbName)
	log.info(`Connected to ${mongodb.dbName} database`)

	/* istanbul ignore else */
	if (mongodb.dropDatabase === true) {
		log.info(`Dropping ${mongodb.dbName} database...`)
		await db.dropDatabase()
	}

	module.exports.db = db
	// Utils
	const utils = require('./utils')
	module.exports.getFindOptions = utils.getFindOptions
	module.exports.findValidation = utils.findValidation
	module.exports.FindStream = utils.FindStream
}

module.exports.oid = (id) => new ObjectID(id)

