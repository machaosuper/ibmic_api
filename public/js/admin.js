$(function () {
	$('.del').click(function (e) {
		// debugger;
		// var id = $(this).attr('data-id');
		// var id = $(this).data('id');
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id)
		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id=' + id
		}).done(function (res) {
			if (res.code === '000000') {
				if (tr.length > 0) {
					tr.remove()
				}
			}
		})
	})

	$('#douban').blur(function () {
		var douban = $(this);
		var id = douban.val();
		if (id) {
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function (data) {
					console.log(data);
					$('#inputTitle').val(data.title);
					$('#inputDoctor').val(data.directors[0].name);
					$('#inputCounty').val(data.countries[0]);
					// $('#inputLanguage').val(data.);
					$('#inputPoster').val(data.images.large);
					$('#inputYear').val(data.year);
					$('#inputSummary').val(data.summary);
				}		
			})
		}
		
	})
})