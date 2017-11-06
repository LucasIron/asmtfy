'use strict';

$(function () {
	$('.frame').hide();
	$('.popup').hide();
	$('.front').find('img').hide();
	$('.front').show();
	$('.front').find('img').first().fadeIn(0, function fadeLoop() {
		$(this).fadeOut(0, function () {
			if ($(this).next('img').length) return $(this).next('img').fadeIn(0, fadeLoop);
			$('.front').hide(function () {
				$('.menu').fadeIn(0);
			});
		});
	});
	//	$('.menu').fadeIn();

	$('button.options').click(function () {
		$('.popup.options').stop().fadeIn(250);
	});

	$('.close').click(function () {
		$(this).closest('.popup').stop().fadeOut(250);
	});

	$('.btn.portugues').click(function () {
		$(this).addClass('active').siblings('.btn').removeClass('active');
		$('html').attr('lang', 'pt-br');
	});

	$('.btn.english').click(function () {
		$(this).addClass('active').siblings('.btn').removeClass('active');
		$('html').attr('lang', 'en');
	});

	if (localStorage.getItem('som') === null) localStorage.setItem('som', true);

	if (localStorage.getItem('som') === 'true') {
		$('#som').prop('checked', true);
	} else {
		$('#som').prop('checked', false);
	}

	$('#som').change(function () {
		localStorage.setItem('som', $(this).prop('checked'));
	}).change();

	var audio_btn = $('<audio>', {
		'id': 'audio-btn',
		'preload': 'auto',
		'src': '/mp3/s_button.mp3'
	}).get(0);

	$('.btn').click(function (event) {
		if (localStorage.getItem('som') === 'true') audio_btn.play();
	});

	$('button.howto').click(function () {
		$('.popup.howto').stop().fadeIn(250).find('ul.howto').slick({
			'infinite': false,
			'adaptiveHeight': true
		});
	});

	$('.caixa.howto').find('.close').click(function () {
		$('ul.howto').slick('unslick');
	});

	$('button.credits').click(function () {
		$('.popup.credits').stop().fadeIn(250);
	});

	$('.popup.login.signin').find('form').each(function () {
		$(this).on('submit', function (event) {
			event.preventDefault();
			console.log($(this).serializeArray());
			console.log($(this).attr('action'));
			console.log($(this).attr('method'));
			$.ajax({
				'data': $(this).serializeArray(),
				'url': $(this).attr('action'),
				'method': $(this).attr('method'),
				'success': function success(data) {
					console.log(data);
					// if (data == true) {
					// if (data == true) {
					// if (data == true) {
					// 	console.log(true);
					// } else {
					// 	alert('login inválido');
					// }
				}
			});
		});
	});

	$('button.newgame').click(function () {
		$('.popup.login.signin').stop().fadeIn(250);
	});
});