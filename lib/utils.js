const Joi = require('joi')
const { Transform } = require('stream')

const { conf } = require('@terrajs/mono')

exports.findValidation = {
	limit: Joi.number().integer().min(1).max(conf.mono.mongodb.findLimitMax).optional(),
	offset: Joi.number().integer().min(0).optional(),
	sort: Joi.string().replace(/\s/g, '').optional(),
	fields: Joi.string().replace(/\s/g, '').optional()
}

// Generate options for mongo find()
exports.getFindOptions = (query) => {
	// query should be req.query
	const options = {
		limit: conf.mono.mongodb.findLimitDefault,
		offset: 0,
		fields: {},
		sort: {}
	}

	// Limit (?limit=5)
	if (query.limit) options.limit = Number(query.limit)
	// Offset (?offset=10)
	if (query.offset) options.offset = Number(query.offset)
	// Fields (?fields=name,ean)
	if (query.fields) query.fields.split(',').filter((_) => _).forEach((field) => options.fields[field] = 1)
	// Sort (?sort=position:asc)
	if (query.sort) {
		query.sort.split(',').filter((_) => _).forEach((sort) => {
			const [key, order] = sort.split(':')
			options.sort[key] = (order === 'desc' ? -1 : 1)
		})
	}

	return options
}

exports.FindStream = class FindStream extends Transform {
	constructor(options = {}) {
		// options: { total, limit, offset, res?, key = 'items' }
		super({
			readableObjectMode: true,
			writableObjectMode: true
		})

		const requiredKeys = ['limit', 'offset', 'total']
		requiredKeys.forEach((key) => {
			if (typeof options[key] === 'undefined') {
				throw new Error(`'${key}' property is required to FindStream class`)
			}
		})
		if (options.res) {
			options.res.setHeader('Content-Type', 'application/json; charset=utf-8')
		}
		this.first = true
		this.base = {
			total: options.total,
			limit: options.limit,
			offset: options.offset,
			count: 0
		}
		this.key = options.key || 'items'
		this.push(`{"${this.key}":[`)
	}

	_transform(item, encoding, next) {
		if (!this.first) this.push(',')
		else this.first = false

		this.push(JSON.stringify(item))
		this.base.count++

		return next()
	}

	_flush(next) {
		const keys = ['limit', 'offset', 'total', 'count']

		this.push('],')
		keys.forEach((key, i) => {
			this.push(`"${key}": ${this.base[key]}`)
			if (i < keys.length - 1) this.push(',')
		})
		this.push('}')

		return next()
	}
}
