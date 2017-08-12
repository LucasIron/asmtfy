$(function () {
	const canvas_sizing = function () {
		$('.game').each(function () {
			$('.game').css('height', $(this).width() * 0.45 + 'px');
		});
	}
	canvas_sizing();
	$(window).resize(canvas_sizing);
});

$(function () {
	const socket = io();
	
	var arena;
	
	socket.on('arena', ring => arena = ring);
});