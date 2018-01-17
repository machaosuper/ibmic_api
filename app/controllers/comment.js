var Comment = require('../models/comment');


exports.save = function (req, res) {
	var _comment = req.body;
	var user = req.session.user;
	_comment.from = user._id;
	if (!_comment.content) {
		res.json({
			code: '000030',
			msg: '评价内容不能为空'
		})
	} else {
	// console.log(comment);
	// var noteId = _comment.note;
	// if (_comment.cid) {
	// 	Comment.findById(_comment.cid, function (err, comment) {
	// 		var reply = {
	// 			from: _comment.from,
	// 			to: _comment.tid,
	// 			content: _comment.content
	// 		}
	// 		comment.reply.push(reply);
	// 		comment.save(function (err, comment) {
	// 		if (err) {
	// 				console.log(err);
	// 			}
	// 			res.redirect('/movie/' + movieId);
	// 		})	
	// 	})
	// } else {
		var comment = new Comment(_comment);
		comment.save(function (err, comment) {
			if (err) {
				console.log(err);
			}
			res.json({
				code: '000000',
				msg: '成功',
				data: comment
			})
		})	
	// }
	}
}