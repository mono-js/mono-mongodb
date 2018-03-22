const { join } = require('path')

module.exports = {
	mono: {
		modules: [
			join(__dirname, '../../../..')
		],
		mongodb: {
			url: 'mongodb://localhost:27017/mono-mongodb',
			dbName: 'mono-mongodb',
			dropDatabase: true
		}
	}
}
