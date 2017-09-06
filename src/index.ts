import { MongoClient, MongoClientOptions, ObjectID, Db, Cursor } from 'mongodb'

export namespace MonoMongo {
	export interface Options {
		url: string
		options?: MongoClientOptions
	}
}

export { ObjectID, Cursor }
export let db: Db
export const oid = (id) => new ObjectID(id)

export default async function () {
	const log = this.log.module('mono-mongodb')
	const mongodb: MonoMongo.Options = this.conf.mongodb
	if (!mongodb) return log.error('No mongodb configuration found')
	log.info(`Connecting to ${mongodb.url}...`)
	db = await MongoClient.connect(mongodb.url, mongodb.options)
	log.info(`Connected to ${db.databaseName} database`)
}
