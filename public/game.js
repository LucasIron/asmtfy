$(function () {
	const canvas_sizing = function () {
		$('.game').each(function () {
			$('.game').css('height', $(this).width() * 0.45 + 'px');
		});
		$('.game')[0].width = $('.game').width();
		$('.game')[0].height = $('.game').height();
	}
	canvas_sizing();
	$(window).resize(canvas_sizing);
});

$(function () {
	'use strict';

	var before = Date.now();

	const game = new (function Game(canvas) {
		var socket;
		var actual_state;
		var arena;

		const ctx = canvas.getContext('2d');

		const Arena = function (arena) {
			const collider = new Image();

			collider.src = arena.src + '/collider.png';
			this.complete = () => {
				if (
					collider.complete
				) {
					return true;
				} else {
					return false;
				}
			}

			this.collide = () => {
				console.log(collider);
			};
			this.collider = function () {
				if (arguments[0]) {
					collider.src = arguments[0];
				} else {
					return collider;
				}
			};
			this.draw = function () {
				ctx.clearRect(0, 0, canvas.width, canvas.height)
				ctx.drawImage(collider, 0, -(canvas.width / collider.width * collider.height - canvas.height), canvas.width, canvas.width / collider.width * collider.height);
			};
		}

		const State = function State() {
			if (arguments[0] instanceof Object) {
				const parameters = arguments[0];

				if (parameters.update) {
					this.update = function (delta) {
						parameters.update(delta);
					}
				}
				if (parameters.draw) {
					this.draw = function (delta) {
						parameters.draw(delta);
					}
				}
				if (parameters.start) {
					this.start = function () {
						parameters.start.apply(this, arguments);
					}
				}
				if (parameters.end) {
					this.end = function () {
						parameters.end.apply(this, arguments);
					}
				}
			} else {
				console.log('state argument must be object');
			}
		};

		this.state = function state(new_state) {
			if (new_state) {
				if (actual_state && actual_state.end) actual_state.end();
				actual_state = new_state;
				if (new_state.start) new_state.start();
			} else {
				return actual_state;
			}
		}

		this.state(new (function Loading() {
			State.call(this, {
				start: function () {
					socket = io();
					socket.on('arena', function (ring) {
						arena = new Arena(ring);
					});
				},

				update: function () {
					if (
						arena &&
						arena.complete()
					) {
						game.state(new (function Match() {
							State.call(this, {
								update: function () {

								},

								draw: function () {
									arena.draw();
									
								},

								start: function () {
									const explode = function (x, y) {
										const pixel_index = (x, y, w) => y * w * 4 + x * 4;

										const collider_old = arena.collider();
										const collider_canvas = document.createElement('canvas');
										const collider_ctx = collider_canvas.getContext('2d');

										collider_canvas.width = collider_old.width;
										collider_canvas.height = collider_old.height;
										collider_ctx.drawImage(collider_old, 0, 0);
										const collider_data = collider_ctx.getImageData(0, 0, collider_old.width, collider_old.height);

										for (let i = x - 20; i < x + 20; i++) {
											for (let j = y - 20; j < y + 20; j++) {
												collider_data.data[pixel_index(i, j, collider_data.width)] = 255;
												collider_data.data[pixel_index(i, j, collider_data.width) + 1] = 255;
												collider_data.data[pixel_index(i, j, collider_data.width) + 2] = 255;
												collider_data.data[pixel_index(i, j, collider_data.width) + 3] = 0;
											}
										}

										collider_ctx.putImageData(collider_data, 0, 0);
										arena.collider(collider_canvas.toDataURL());
									}
									console.log('start play');

									

									socket.on('explode', function (center) {
										explode(center.x, center.y);
									});

									canvas.addEventListener('click', function destroy(mouse) {
										mouse.canvasX = mouse.clientX - $(canvas).offset().left;
										mouse.canvasY = mouse.clientY - $(canvas).offset().top;
										mouse.imageX = Math.floor(mouse.canvasX / canvas.width * arena.collider().width);
										mouse.imageY = Math.floor(mouse.canvasY / canvas.height * arena.collider().height);

										socket.emit('explode', {
											x: mouse.imageX,
											y: mouse.imageY
										});
									}, false);
								}
							});
						})());
					}
				},

				draw: function () {
					
				},

				end: function () {
					console.log('loading complete');
				}
			});
		})());
	})($('.asmtfy')[0]);

	window.requestAnimationFrame(function loop() {
		const now = Date.now();
		const delta = now - before;
		before = now;

		game.state().update(delta);
		game.state().draw(delta);

		window.requestAnimationFrame(() => loop());
	});
});