// var Movie = require('../models/movie');
// var User = require('../models/user');
// var _ = require('underscore');
var Index = require('../app/controllers/index');
var Note = require('../app/controllers/note');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {
	// 拦截器
	app.use(function (req, res, next) {
		// console.log('拦截器');
		// console.log(req.session.user);
		var _user = req.session.user;
		// console.log(_user)
		// if (_user) {
		app.locals.user = _user;
		// }
		return next();
	})

	/*
	 * 注册
	 * @param name 用户名
	 * @param password 密码
	 */
	app.post('/blog/user/signup', User.signup)


	/*
	 * 登录
	 * @param name 用户名
	 * @param password 密码
	 */
	app.post('/blog/user/signin', User.signin)

	/*
	 * 激活用户
	 */
	app.get('/blog/activation/:verify', User.activation)


	/*
	 * 获取用户信息
	 */
	app.get('/blog/user/info', User.info)

	

	// app.get('/signup', User.showSignup)
	// app.get('/signin', User.showSignin)

	app.get('/blog/user/list', User.signinRequired, User.adminRequired, User.list)


	app.post('/blog/user/update', User.signinRequired, User.adminRequired, User.update)


	app.post('/blog/user/del', User.signinRequired, User.adminRequired, User.del)

	/*
	 * 登出
	 * @param name 用户名
	 * @param password 密码
	 */
	app.get('/blog/user/logout', User.logout)

	// app.get('/', Index.index);

	// app.get('/movie/:id', Movie.detail)

	// app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)

	// app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)

	// app.post('/admin/movie/save', User.signinRequired, User.adminRequired, multipartMiddleware, Movie.savePoster, Movie.save)

	// app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)

	// app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)	


	// Note
	app.post('/blog/save', User.signinRequired, Note.save)

	app.post('/blog/detail', Note.detail)

	app.post('/blog/list', Note.list)

	app.post('/blog/del', User.signinRequired, User.adminRequired, Note.del)


	// Comment
	app.post('/blog/comment', User.signinRequired, Comment.save)



	// Category
	// app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)

	app.post('/blog/admin/category/save', User.signinRequired, User.adminRequired, Category.save)

	app.get('/blog/category/list', Category.list)

	app.post('/blog/admin/category/edit', User.signinRequired, User.adminRequired, Category.edit)


	// // results
	// app.get('/results', Index.search);

}
	