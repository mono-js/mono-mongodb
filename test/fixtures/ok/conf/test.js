const { join } = require('path')

module.exports = {
	mono: {
		modules: [
			join(__dirname, '../../../..')
		],
		mongodb: {
			url: 'mongodb://localhost:27017',
			dbName: 'mono-mongodb',
			dropDatabase: true
		}
	}
}
