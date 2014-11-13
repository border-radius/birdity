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
	$('.signin input').eq(0).focus();
	return false;
});

$('.signin .otherwise').click(function (e) {
	$('.signin').addClass('hide');
	$('.invite').removeClass('hide');
	$('.invite input').eq(0).focus();
	return false;
});

$('.invite input').eq(0).focus();