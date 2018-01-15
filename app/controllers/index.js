var Movie = require('../models/note');
var Category = require('../models/category');

exports.index = function (req, res) {
	Category.find({}).populate({path: 'movies', options: {limit: 6}}).exec(function (err, categories) {
		if (err) {
			console.log(err);
		}
		// console.log(categories);
		res.render('index', {
			title: '首页',
			categories: categories
		})
	})
	// Movie.fetch(function (err, movies) {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	res.render('index', {
	// 		title: '首页',
	// 		movies: movies
	// 	})
	// })
}

exports.search = function (req, res) {
	var PAGESIZE = 2;
	var catId = req.query.cat;
	var page = parseInt(req.query.p, 10) || 0;
	var index = page * PAGESIZE;

	var q =req.query.q;
	// Category.findOne({_id: catId}).populate({path: 'movies',select: 'title poster', options: {limit: PAGESIZE, skip: index}}).exec(function (err, category) {
	if (catId) {
		Category.findOne({_id: catId}).populate({path: 'movies',select: 'title poster'}).exec(function (err, category) {
			if (err) {
				console.log(err);
			}
			// console.log(category);
			
			var movies = category.movies || [];
			// console.log(catId);
			var results = movies.slice(index, (index + PAGESIZE));

			res.render('results', {
				title: '结果列表页',
				keyword: category.name,
				currentPage: (page + 1),
				totalPage: Math.ceil(movies.length / PAGESIZE),
				// category: category,
				query: 'cat=' + catId,
				movies: results
			})
		})	
	} else if (q) {
		Movie.find({title: new RegExp(q + '.*', 'i')}).exec(function (err, movies) {
			if (err) {
				console.log(err);
			}
			var results = movies.slice(index, (index + PAGESIZE));

			res.render('results', {
				title: '结果列表页',
				keyword: q,
				currentPage: (page + 1),
				totalPage: Math.ceil(movies.length / PAGESIZE),
				// category: category,
				query: 'q=' + q,
				movies: results
			})
		})
		
	}
	
}
