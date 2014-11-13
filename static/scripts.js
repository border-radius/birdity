$('.invite button').click(function () {
	var that = this;
	$(this).prop('disabled', true);
	$(this).text('Записываю...');
	$.post('/mail', {
		mail: $('.invite input').val()
	}).success(function () {
		$(that).addClass('done').text('Записан!');
	});
});

$('.invite .otherwise').click(function (e) {
	$('.invite').addClass('hide');
	$('.signin').removeClass('hide');
	return false;
});

$('.signin .otherwise').click(function (e) {
	$('.signin').addClass('hide');
	$('.invite').removeClass('hide');
	return false;
});