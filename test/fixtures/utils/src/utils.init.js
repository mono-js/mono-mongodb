const mongoUtils = require('mongodb-utils')
const { db } = require('../../../../')

const collection = mongoUtils(db.collection('docs'))

module.exports = async function ({ log }) {
	const nbDocs = 47
	log.info(`Inserting ${nbDocs} documents into docs collection...`)

	for (let i = 1; i <= 47; i++) {
		await collection.utils.create({
			num: i
		})
	}
}
