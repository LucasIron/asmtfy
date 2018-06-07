'use strict';

$(function () {
	$('.frame').hide();
	$('.popup').hide();

	if (!sessionStorage.getItem('front')) {
		$('.front').find('img').hide();
		$('.front').show();
		$('.front').find('img').first().fadeIn(2500, function fadeLoop() {
			$(this).fadeOut(2500, function () {
				if ($(this).next('img').length) return $(this).next('img').fadeIn(2500, fadeLoop);
				$('.front').hide(function () {
					$('.menu').fadeIn(2500);
				});
			});
		});
	} else $('.menu').fadeIn(2500);
	sessionStorage.setItem('front', true);

	$('button.options').click(function () {
		$('.popup.options').stop().fadeIn(250);
	});

	$('.close').click(function () {
		$(this).closest('.popup').stop().fadeOut(250);
	});

	if (localStorage.getItem('lang') === null) localStorage.setItem('lang', 'pt-br');

	$('html').attr('lang', localStorage.getItem('lang'));

	$('.btn.portugues').click(function () {
		$(this).addClass('active').siblings('.btn').removeClass('active');
		$('html').attr('lang', 'pt-br');
		localStorage.setItem('lang', 'pt-br');
	});

	$('.btn.english').click(function () {
		$(this).addClass('active').siblings('.btn').removeClass('active');
		$('html').attr('lang', 'en');
		localStorage.setItem('lang', 'en');
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
		'src': './mp3/s_button.mp3'
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
			var form = this;
			return $.ajax({
				'data': {
					'name': $(this).find('input[name="name"]').val(),
					'pass': $(this).find('input[name="pass"]').val()
				},
				'url': $(this).attr('action'),
				'method': $(this).attr('method'),
				'success': function success(data) {
					if (data == 0) return $(form).find('input[name="name"]').val('').end().find('input[name="pass"]').val('');

					$(form).closest('.popup').stop().fadeOut(250);
				}
			});
		});
	});

	$('button.newgame').click(function () {
		$('.frame.menu').stop().fadeOut(250);
		$('.frame.arenas').find('.grande, .pequeno').append(['flat', 'wall'].map(function (arena) {
			return $('<li>').append($('<img>', {
				'src': './assets/arenas/' + arena + '/' + arena + '.jpg'
			})).data('name', arena);
		})).end().stop().fadeIn(250, function () {
			$(this).find('.grande').slick({
				'arrows': false,
				'fade': true,
				'infinite': true,
				'dots': false,
				'asNavFor': '.pequeno'
			}).end().find('.pequeno').slick({
				'slidesToShow': 1,
				'asNavFor': '.grande',
				'infinite': true,
				'dots': false,
				'centerMode': true
			});
		});
	});

	$('.frame.arenas').find('.btn.prev').click(function () {
		$(this).closest('.frame').stop().fadeOut(250);
		$('.frame.menu').fadeIn(250, function () {
			$('.frame.arenas').find('.grande, .pequeno').slick('unslick');
		});
	});

	$('.frame.arenas').find('.btn.next').click(function () {
		location = './game.html?arena=' + $('.frame.arenas').find('.slick-active').data('name');
	});
});