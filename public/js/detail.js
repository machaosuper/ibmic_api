$(function () {
	$('.comment').click(function (e) {
		// debugger;
		// var id = $(this).attr('data-id');
		// var id = $(this).data('id');
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');
		if ($('#toId').length > 0) {
			$('#toId').val(toId);
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');	
		}
		
		if ($('#commentId').length > 0) {
			$('#commentId').val(commentId);
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm');	
		}
		
	})
})