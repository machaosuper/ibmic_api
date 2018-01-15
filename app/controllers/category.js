// var Movie = require('../models/movie');
var Category = require('../models/category');
var moment = require('moment')

// exports.new = function (req, res) {
// 	res.render('category_admin', {
// 		title: '后台分类录入页',
// 		category: {}
// 	})
// }

exports.save = function (req, res) {
	console.log('---------------')
	console.log(req.body)
	console.log('---------------')
	var _category = req.body;
	Category.findOne({name: _category.name}, function (err, category) {
		if (err) {
			console.log(err)
		}
		if (!category) {
			var category = new Category(_category);
			category.save(function (err, category) {
				if (err) {
					console.log(err);
				}
				res.json({
					code: '000000',
					msg: '成功',
					data: category
				});		
			})
		} else {
			res.json({
				code: '000020',
				msg: '改分类已经存在',
				data: category
			});	
		}
	})
	
}

exports.list = function (req, res) {
	Category.fetch(function (err, categories) {
		if (err) {
			console.log(err);
		}
		// console.log(categories);
		var _categories = []
		categories.forEach((val) => {
			let category = {}
			category.name = val.name
			category.count = val.notes.length || 0
			category.creatDate = moment(val.meta.createAt).format('YYYY-MM-DD')
			category._id = val._id
			_categories.push(category)
		})
		res.json({
			code: '000000',
			msg: '成功',
			data: _categories
		})
	})
}

exports.edit = function (req, res) {
	var body = req.body
	console.log('---------------')
	console.log(body)
	console.log('---------------')
	var categoryId = body.categoryId
	var categoryName = body.categoryName
	var editType = body.editType
	// editType : 01 更新 02删除
	if (editType == '01' && categoryName && categoryId) {
		Category.update({_id: categoryId}, {$set: {name: category.name}}, function (err, category) {
			if (err) {
				console.log(err)
			}
			res.json({
				code: '000000',
				msg: '成功',
				data: category
			})
		})
	}
	if (editType == '02' && categoryId) {
		Category.remove({_id: categoryId}, function (err, category) {
			if (err) {
				console.log(err)
			}
			res.json({
				code: '000000',
				msg: '成功',
				data: category
			})
		})
	}


}