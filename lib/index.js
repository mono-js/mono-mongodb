const { MongoClient, ObjectID } = require('mongodb')

module.exports = async function () {
	const log = this.log.module('mono-mongodb')
	const mongodb = this.conf.mongodb

	if (!mongodb) return log.error('No mongodb configuration found')

	log.info(`Connecting to ${mongodb.url}...`)
	let db = await MongoClient.connect(mongodb.url, mongodb.options)
	log.info(`Connected to ${db.databaseName} database`)

	module.exports.db = db
}
module.exports.oid = (id) => new ObjectID(id)
