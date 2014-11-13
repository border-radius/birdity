$('button').click(function () {
	var that = this;
	$(this).prop('disabled', true);
	$(this).text('Записываю...');
	$.post('/mail', {
		mail: $('input').val()
	}).success(function () {
		$(that).addClass('done').text('Записан!');
	});
});