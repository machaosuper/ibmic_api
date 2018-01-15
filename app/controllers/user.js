var User = require('../models/user');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// 开启一个 SMTP 连接池
var transport = nodemailer.createTransport(smtpTransport({
    // 主机
    host: "smtp.qq.com",
    // 使用 SSL
    secure: true,
    // 使用 SSL
    secureConnection: true,
    // SMTP 端口
    port: 465,
    auth: {
        // 账号
        user: "272110541@qq.com",
        // 密码
        pass: "zsedcftgb311211"
    }
}));

exports.signup = function (req, res) {
    console.log('-------------')
    console.log(req.body);
    console.log('-------------')
    var _user = req.body;
    if (!_user.name || !_user.password || !_user.email) {
        return res.json({
            code: '000001',
            msg: '请求参数不能为空'
        })
    }
    if (!(/^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})$/.test(_user.email))) {
        return res.json({
            code: '000005',
            msg: '请输入正确的邮箱！'
        })
    }
	// req.param('user')
	User.findOne({name: _user.name}, function (err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			// console.log(user);
			// return res.redirect('/signin');
			return res.json({
				code: '000002',
				msg: '用户名已存在'
			});
		} else {
			User.findOne({email: _user.email}, function (err, user) {
				if (user) {
					return res.json({
						code: '000003',
						msg: '用户邮箱已存在'
					});
				} else {
					// 设置邮件内容
					user = new User(_user);
					user.save(function (err, user) {
						if (err) {
							console.log(err);
						}
						req.session.user = user;
						var mailOptions = {
                            // 发件地址
						    from: "ibmic<272110541@qq.com>", 
						  to: _user.email, // 收件列表
						  subject: "请激活您的账号", // 标题
						  text:"hello请激活您的账号",
						  html: `<div style="max-width: 550px; background: #f8f8f8; padding: 20px; font-size: 13px;">
						  			<div style="padding: 10px 0px 10px 0px;">
						  				请点击以下链接，激活帐号:
						  			</div>
						  			<a style="color: #6093bb;" href="http://localhost:3000/blog/activation/${user.password}" target="_blank">http://localhost:3000/blog/activation/${user.password}</a>
						  		</div>` // html 内容
						}
						// 发送邮件
						transport.sendMail(mailOptions, function(error, response) {
						  if (error) {
						    console.error(error);
						    return res.json({
						    	code: '000004',
						    	msg: error
						    })
						  } else {
						    console.log(response);
							// res.redirect('/');
							// console.log(user)
							res.json({
								code: '000000',
								msg: '注册成功, 请查收邮件激活！',
                                data: user
							});
						
						  }
						  transport.close(); // 如果没用，关闭连接池
						});
					})

					
				}
			})

			
		}
	})	
}


exports.activation = function (req, res) {
	var verify = req.params.verify;
	var user = req.session.user;
	console.log('session.user------------------')
	console.log(user)
	console.log('session.user------------------')
	if (verify == user.password) {
		// user.role = 2;
		// _user = new User(user);
		User.update({_id: user._id}, {role: 2}, function (err, user) {
			if (err) {
				console.log(err);
			}
			res.redirect('http://localhost:8080/#/')
		})
	}
}

exports.info = function (req, res) {
    var user = req.session.user;
    if (user) {
        res.json({
            code: '000000',
            msg: '成功',
            data: user
        })
    } else {
        res.json({
            code: '000007',
            msg: '用户未登录'
        })
    }
}


/*
 * 登录
 * @param name 用户名
 * @param password 密码
 */
exports.signin = function (req, res) {
	console.log('-------------')
	console.log(req.body);
	console.log('-------------')
	var _user = req.body;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name}, function (err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			return res.redirect('/signup');
		}
		user.comparePassword(password, function (err, isMatch) {
			if (err) {
				console.log(err);
			}
			if (isMatch) {
				req.session.user = user;
				// return res.redirect('/');
				return res.json({
					code: '000000',
					msg: '成功',
					data: user
				});
			} else {
				return res.redirect('/signin');
			}
		})
	})
}

/*
 * 登出
 * @param name 用户名
 * @param password 密码
 */
exports.logout = function (req, res) {
	delete req.session.user;
	// delete app.locals.user;
	res.json({
        code: '000000',
        msg: '成功'
    });
}


exports.list = function (req, res) {
	User.fetch(function (err, users) {
		if (err) {
			console.log(err);
		}
		res.render('userlist', {
			title: '用户列表页',
			users: users
		})
	})
}
// 登录
exports.signinRequired = function (req, res, next) {
	var user = req.session.user;
	if (!user) {
		// return res.redirect('/signin')
		return res.json({
			code: '000011',
			msg: '用户未登录'
		})
	}
	next ()
}
// 权限
exports.adminRequired = function (req, res, next) {
	var user = req.session.user;
	if (user.role <= 50) {
		// return res.redirect('/signin')
		return res.json({
			code: '000010',
			msg: '用户权限不够'
		})
	}
	next ()
}
