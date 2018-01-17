var Category = require('../models/category');
var moment = require('moment')


exports.save = function (req, res) {
	var _category = req.body;
	Category.findOne({name: _category.name}, function (err, category) {
		if (err) {
			console.log(err)
		}
		if (!category) {
			category = new Category(_category);
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
	var categoryId = body.categoryId
	var categoryName = body.categoryName
	var editType = body.editType
	// editType : 01 更新 02删除
	if (editType === '01' && categoryName && categoryId) {
		Category.update({_id: categoryId}, {$set: {name: categoryName}}, function (err, category) {
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
	if (editType === '02' && categoryId) {
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