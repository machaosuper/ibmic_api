var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId
var moment = require('moment')

var NoteSchema = new mongoose.Schema({
	title: String,
	describe: String,
	content: String,
	pv: {
		type: Number,
		default: 0
	},
	user: {
		type: ObjectId,
		ref: 'User'
	},
	category: {
		type: ObjectId,
		ref: 'Category'
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

NoteSchema.virtual('createAt').get(function() {
    return moment(this.meta.createAt).format('YYYY-MM-DD');
});

NoteSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
})

NoteSchema.statics = {
	fetch: function (cb) {
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById: function (id, cb) {
		return this.findOne({_id: id}).sort('meta.updateAt').exec(cb)
	}
}

module.exports = NoteSchema;