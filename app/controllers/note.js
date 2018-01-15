var Note = require('../models/note');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');



var fs = require('fs')
var path = require('path')


exports.detail = function (req, res) {
	var id = req.body.id;
	Note.update({_id: id}, {$inc: {pv: 1}}, function (err) {
		if (err) {
			console.log(err);
		}
	})
	Note.findById(id, function (err, note) {
		if (err) {
			console.log(err);
		}

		Comment.find({'note': id}).populate('from', 'name').populate('reply.from reply.to', 'name').exec(function (err, comments) {
			// console.log(comments[2].reply);
			if (err) {
				console.log(err);
			}
			// console.log(movie);
			// res.render('detail', {
			// 	title: movie.title + '详情页',
			// 	movie: movie,
			// 	comments: comments
			// })
			res.json({
				code: '000000',
				msg: '成功',
				data: {
					note: note,
					comments: comments
				}
			})
		})
		
	})
}

exports.new = function (req, res) {
	Category.fetch(function (err, categories) {
		if (err) {
			console.log(err);
		}
		res.render('admin', {
			title: '后台录入页',
			movie: {},
			categories: categories
		})
	})
	
}

exports.update = function (req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}
			Category.fetch(function (err, categories) {
				if (err) {
					console.log(err);
				}
				res.render('admin', {
					title: '后台更新页面',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}
// 存储图片
exports.savePoster = function (req, res, next) {
	console.log(req.files);
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	// var originalname = posterData.originalname;
	var originalname = posterData.originalname || posterData.originalFilename;
	if (originalname) {
		fs.readFile(filePath, function (err, data) {
			var timestamp = Date.now();
			// var type = posterData.extension;
			var type = posterData.extension || posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
			fs.writeFile(newPath, data, function (err) {
				req.poster = poster;
				next();
			})
		})
	} else {
		next();
	}
}

exports.save = function (req, res) {
	// console.log(req.body);
	var user = req.session.user;
	var id = req.body.note._id;
	var noteObj = req.body.note
	// console.log(noteObj);
	var _note

	noteObj.user = user._id

	var categoryId = noteObj.category;
	if (id) {
		Note.findById(id, function (err, note) {
			if (err) {
				console.log(err);
			}
			var oldCategoryId = note.category;


			_note = _.extend(note, noteObj);
			_note.save(function (err, note) {
				if (err) {
					console.log(err);
				}
				if (categoryId && (oldCategoryId !== categoryId)) {
					Category.update({_id: oldCategoryId}, {'$pull': {notes: note._id}}, function (err) {
						if (err) {
							console.log(err);
						}

						Category.findById(categoryId, function (err, category) {
							if (err) {
								console.log(err);
							}
							category.notes.push(note._id);
							category.save(function (err, category) {
								res.json({
									code: '000000',
									msg: '成功',
									data: note
								});
							})
						})
						
					})
				} else {
					res.json({
						code: '000000',
						msg: '成功',
						data: note
					});
				}
			})
		})
	} else {
		_note = new Note(noteObj);
		_note.save(function (err, note) {
			if (err) {
				console.log(err);
			}
			Category.findById(categoryId, function (err, category) {
				if (err) {
					console.log(err);
				}
				category.notes.push(note._id);
				category.save(function (err, category) {
					res.json({
						code: '000000',
						msg: '成功',
						data: note
					});
				})
			})	
		})	
	}
		
}

exports.list = function (req, res) {
	var pageNo = +req.body.pageNo
	var pageSize = +req.body.pageSize
	console.log('------------------')
	console.log(req.body)
	console.log('------------------')
	var index = pageNo * pageSize;
	// Note.find({}).select('createAt').exec(function (err, data) {
	// 	console.log('~~~~~~~~~~~~~~~~~~~~~~~~')
	// 	console.log(data)
	// 	console.log('~~~~~~~~~~~~~~~~~~~~~~~~')
	// })
	Note.find({}).populate({path: 'user', select: 'name'}).populate({path: 'category', select: 'name'}).limit(pageSize).skip(index).sort({'meta.createAt': -1}).exec(function (err, notes) {
		if (err) {
			console.log(err);
		}
		Note.count({}, function (err, count) {
			if (err) {
				console.log(err);
			}
			res.json({
				code: '000000',
				msg: '成功',
				data: {
					notes: notes,
					currentPage: pageNo,
					total: count
				}
			})
		})
		
	})
	// Note.fetch(function (err, notes) {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	res.json({
	// 		code: '000000',
	// 		msg: '成功',
	// 		data: notes
	// 	})
	// })
}

exports.del = function (req, res) {
	// console.log(req.query);
	var id = req.query.id;
	if (id) {
		Movie.remove({_id: id}, function (err) {
			if (err) {
				console.log(err);
			} else{
				res.json({
					code: '000000'
				})	
			}
			
		})
	}
}