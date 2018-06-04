'use strict';

/*
precisamos fazer:
fazer os cooldowns
arrumar os creditos eo os nomes dos professores e as instruções!!!!!
*/
var pause;

$(function () {
	var canvas = $('.asmtfy').get(0);
	var ctx = canvas.getContext('2d');
	$(window).on('resize', function () {
		$(canvas).each(function () {
			$(this).css('height', $(this).width() * (45 / 100) + 'px');
			if ($(window).width() * (45 / 100) < $(window).height()) {
				$(this).width($(window).width()).height($(window).width() * (45 / 100));
			} else {
				$(this).width($(window).height() * (100 / 45)).height($(window).height());
			}
			this.width = $(this).width();
			this.height = $(this).height();
		});
	}).resize();

	var IntervalDosPontinhos;
	var game = new function () {

		//char red

		function Red(molde) {
			//char RED
			var char = this;
			var state;
			var x = molde.x;
			var y = 0;
			var name = molde.name;
			var path = './assets/chars/' + molde.name + '/';
			var fx = 0;
			var fy = 0;
			var w = molde.w; //0.035
			this.w = w;
			var h;
			var speed = molde.speed;
			var dir = -1;
			this.dir = function (rid) {
				dir = rid;
			};
			this.x = function () {
				return x;
			};
			this.y = function () {
				return y;
			};
			this.h = function () {
				return h;
			};
			var tiros = [];

			this.conflict = function (box_2) {
				var box_1 = {
					x1: red.x(),
					x2: red.x() + red.w,
					y1: red.y(),
					y2: red.y() + red.h() / canvas.height
				};

				function overlap(x1, x2, y1, y2) {
					return Math.max(x1, y1) < Math.min(x2, y2);
				}

				return overlap(box_1.x1, box_1.x2, box_2.x1, box_2.x2) && overlap(box_1.y1, box_1.y2, box_2.y1, box_2.y2);
			};

			function Animation(images, length) {
				length = length * 1000;
				var zero = Date.now();
				var atual;
				this.start = function () {
					zero = Date.now();
					atual = 0;
				};
				this.update = function () {
					atual = Math.floor((Date.now() - zero) / (length / images.length));
					if (atual >= images.length) return false;
					h = images[atual].height / images[atual].width * (w * canvas.width);
					return true;
				};
				this.draw = function () {
					ctx.save();
					ctx.translate(canvas.width * x, canvas.height * y);
					ctx.scale(dir, 1);
					ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
					ctx.restore();
				};
			}
			var power = 0;
			var max_power = 1;
			var mouseup;

			function Tiro(x, y, w) {
				var tiro = this;
				var dir = 1;
				var h = 0;
				var fy = 0;
				var state;

				function Animation(images, length) {
					length = length * 1000;
					var zero = Date.now();
					var atual;
					this.start = function () {
						zero = Date.now();
						atual = 0;
					};
					this.update = function () {
						atual = Math.floor((Date.now() - zero) / (length / images.length));
						if (atual >= images.length) return false;
						h = images[atual].height / images[atual].width * (w * canvas.width);
						return true;
					};
					this.draw = function () {
						ctx.save();
						ctx.translate(canvas.width * x, canvas.height * y);
						ctx.scale(dir, 1);
						ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
						ctx.restore();
					};
				}
				this.state = function (estado) {
					if (estado) {
						if (state) state.end();
						state = estado;
						state.start();
					}
				};
				this.x = function () {
					return x;
				};
				this.y = function () {
					return y;
				};
				this.h = function () {
					return h;
				};
				this.w = w;
				var adj = gamepads()[0].axes[2]; //troquei parar testar a yellow
				var opo = gamepads()[0].axes[3];
				var ang = Math.atan2(opo, adj);
				var fx = Math.cos(ang) * power * 0.5;
				var fy = Math.sin(ang) * power * 0.5;
				this.update = function () {
					state.update();
				};
				this.draw = function () {
					state.draw();
				};
				var fly = new function Fly() {
					var images = [];
					for (var i = 0; i < molde.tiro; i++) {
						images[i] = $('<img>', {
							'src': path + 'tiro/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 0.3);
					this.update = function () {
						if (!animation.update()) {
							animation.start();
						}

						fy += arena.g;
						y += fy * delta;
						x += fx * delta;
						if (arena.conflict(tiro)) tiro.state(explosion);else if (yellow.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) tiro.state(explosion);else if (!overlap(tiro.x(), tiro.x() + tiro.w, 0, 1)) tiro.state(explosion);
					};

					this.draw = function () {
						animation.draw();
					};

					this.start = function () {
						animation.start();
						/*if ($('#som').prop('checked')) s_fly_fireball.play();*/
					};

					this.end = function () {
						/*	s_fly_fireball.pause();
                         s_fly_fireball.currentTime = 0;*/
					};
				}();

				var explosion = new function Explosion() {
					var s_explosion = $('<audio>', {
						'id': 'audio-btn',
						'preload': 'auto',
						'src': './mp3/s_explosion.mp3'
					}).get(0);
					var images = [];
					for (var i = 0; i < 8; i++) {
						images[i] = $('<img>', {
							'src': './assets/explosion/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 1);
					this.update = function () {
						//		arena.destroy(tiro);
					};

					this.draw = function () {
						if (animation.update()) return animation.draw();
						this.end();
					};

					this.start = function () {
						if ($('#som').prop('checked')) s_explosion.play();

						w *= 5;
						tiro.w = w;
						x -= w / 2;
						y -= w / 2;
						animation.start();

						arena.destroy(tiro);

						if (yellow.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) {
							//true
							yellow.hit();
							$('.red_points').text(+$('.red_points').text() > 800 ? 1000 : +$('.red_points').text() + 200);
							$('.red_inner_score_bar').css('width', +$('.red_points').text() / 10 + '%');
							if (+$('.red_points').text() >= 1000) {}
						}; //verifica colisao e da pontos
					};

					this.end = function () {
						tiros.shift(); //deveria tirar a si proprio
					};
				}();
				this.state(fly);
			}

			function Tiro2(x, y, w) {
				var tiro = this;
				var dir = 1;
				var h = 0;
				var fy = 0;
				var state;

				function Animation(images, length) {
					length = length * 1000;
					var zero = Date.now();
					var atual;
					this.start = function () {
						zero = Date.now();
						atual = 0;
					};
					this.update = function () {
						atual = Math.floor((Date.now() - zero) / (length / images.length));
						if (atual >= images.length) return false;
						h = images[atual].height / images[atual].width * (w * canvas.width);
						return true;
					};
					this.draw = function () {
						ctx.save();
						ctx.translate(canvas.width * x, canvas.height * y);
						ctx.scale(dir, 1);
						ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
						ctx.restore();
					};
				}
				this.state = function (estado) {
					if (estado) {
						if (state) state.end();
						state = estado;
						state.start();
					}
				};
				this.x = function () {
					return x;
				};
				this.y = function () {
					return y;
				};
				this.h = function () {
					return h;
				};
				this.w = w;
				var adj = gamepads()[0].axes[2]; //troquei parar testar a yellow
				var opo = gamepads()[0].axes[3];
				var ang = Math.atan2(opo, adj);
				var fx = Math.cos(ang) * power * 0.5;
				var fy = Math.sin(ang) * power * 0.5;
				this.update = function () {
					state.update();
				};
				this.draw = function () {
					state.draw();
				};
				var fly = new function Fly() {
					var images = [];
					for (var i = 0; i < molde.tiro; i++) {
						images[i] = $('<img>', {
							'src': path + 'tiro/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 0.3);
					this.update = function () {
						if (!animation.update()) {
							animation.start();
						}

						fy += arena.g;
						y += fy * delta;
						x += fx * delta;
						if (arena.conflict(tiro)) tiro.state(explosion);else if (yellow.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) tiro.state(explosion);else if (!overlap(tiro.x(), tiro.x() + tiro.w, 0, 1)) tiro.state(explosion);
					};

					this.draw = function () {
						animation.draw();
					};

					this.start = function () {
						animation.start();
						/*if ($('#som').prop('checked')) s_fly_fireball.play();*/
					};

					this.end = function () {
						/*	s_fly_fireball.pause();
                         s_fly_fireball.currentTime = 0;*/
					};
				}();

				var explosion = new function Explosion() {
					var s_explosion = $('<audio>', {
						'id': 'audio-btn',
						'preload': 'auto',
						'src': './mp3/s_explosion.mp3'
					}).get(0);
					var images = [];
					for (var i = 0; i < 8; i++) {
						images[i] = $('<img>', {
							'src': './assets/explosion/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 1);
					this.update = function () {
						//		arena.destroy(tiro);
					};

					this.draw = function () {
						if (animation.update()) return animation.draw();
						this.end();
					};

					this.start = function () {
						if ($('#som').prop('checked')) s_explosion.play();

						w *= 5;
						tiro.w = w;
						x -= w / 2;
						y -= w / 2;
						animation.start();

						arena.destroy(tiro);

						if (yellow.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) {
							//true
							yellow.hit();
							$('.red_points').text(+$('.red_points').text() > 800 ? 1000 : +$('.red_points').text() + 300);
							$('.red_inner_score_bar').css('width', +$('.red_points').text() / 10 + '%');
							if (+$('.red_points').text() >= 1000) {}
						}; //verifica colisao e da pontos
					};

					this.end = function () {
						tiros.shift(); //deveria tirar a si proprio
					};
				}();
				this.state(fly);
			}

			//-------------------estados do RED-------------------------------------------------------------------------------			
			var attack = new function Attack() {
				var images = [];
				for (var i = 0; i < molde.attack; i++) {
					images[i] = $('<img>', {
						'src': path + 'attack/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) {
						tiros.push(new Tiro(char.x() + char.w / 2, char.y() + char.w, char.w * 0.3));
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
			}();

			var attack2 = new function Attack2() {
				//copia, deletar depois
				var images = [];
				for (var i = 0; i < molde.attack; i++) {
					images[i] = $('<img>', {
						'src': path + 'attack/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) {
						tiros.push(new Tiro(char.x() + char.w / 2, char.y() + char.w, char.w * 0.45));
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
			}();

			var charge = new function Charge() {
				var images = [];
				var sizing = 1;
				var atk_btn_press;

				var s_cast_magic = $('<audio>', {
					'id': 'audio-btn',
					'preload': 'auto',
					'src': './mp3/s_cast_magic.mp3',
					'loop': true
				}).get(0);
				for (var i = 0; i < molde.charge; i++) {
					images[i] = $('<img>', {
						'src': path + 'charge/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) animation.start();
					power += 0.75 * delta * sizing;
					if (power >= max_power || power <= 0) {
						sizing *= -1;
						power += 1.5 * delta * sizing;
					}
					$('.red_inner_power_bar').css({
						'width': power / max_power * 100 + '%'
					});

					if (atk_btn_press == 5 && !gamepads()[0].buttons[atk_btn_press].pressed) {
						char.state(attack);
					}
					if (atk_btn_press == 7 && !gamepads()[0].buttons[atk_btn_press].pressed) {
						char.state(attack2);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					power = 0;
					animation.start();
					if (gamepads()[0].buttons[5].pressed) {
						atk_btn_press = 5;
					} else {
						atk_btn_press = 7;
					}
					//console.log(atk_btn_press);

					/*$(canvas).on("mouseup.red", function (event) {
     	mouseup = event;
     	if (event.button == 0){
     		char.state(attack);
     	}else if (event.button == 2){
     		char.state(attack2);
     	}
     });*/
					if ($('#som').prop('checked')) s_cast_magic.play();

					$(canvas).on('contextmenu', function (event) {
						event.preventDefault();
					});
				};
				// alterar aqui com o gamepad
				this.end = function () {
					//$(canvas).off('mouseup.red');
					s_cast_magic.pause();
					s_cast_magic.currentTime = 0;
				};
			}();

			var fall = new function Fall() {
				var images = [];
				for (var i = 0; i < molde.fall; i++) {
					images[i] = $('<img>', {
						'src': path + 'fall/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy += arena.g;
					y += fy * delta;
					x += fx * delta;
					if (!overlap(red.y(), red.y() + red.h() / canvas.height, -300, 1) || !overlap(red.x(), red.x() + red.w, 0, 1)) {
						$('.yellow_points').text(1000);
						$('.yellow_inner_score_bar').css('width', +$('.yellow_points').text() / 10 + '%');
					}

					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					$(window).on("keyup.red", function (event) {
						keys = keys.filter(function (key) {
							return key !== event.key;
						});
					});
					animation.start();
				};
				this.end = function () {
					$(window).off('keyup.red');
				};
			}();

			var hit = new function Hit() {
				var images = [];
				for (var i = 0; i < molde.hit; i++) {
					images[i] = $('<img>', {
						'src': path + 'hit/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.3);
				this.update = function () {
					if (!animation.update()) {
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
			}();

			var jump = new function Jump() {
				var images = [];
				for (var i = 0; i < molde.jump; i++) {
					images[i] = $('<img>', {
						'src': path + 'jump/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy += arena.g;
					y += fy * delta;
					x += fx * delta;
					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}
					}
					if (fy > 0) char.state(fall);
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					fy = -0.35;
					/*$(window).on("keyup.yellow", function (event) {
     	keys = keys.filter(function (key) {
     		return key !== event.key;
     	});
     });*/

					animation.start();
				};
				this.end = function () {};
			}();

			var keys = [];

			var run = new function Run() {
				var s_running = $('<audio>', {
					'id': 'audio-btn',
					'preload': 'auto',
					'src': './mp3/s_running.mp3',
					'loop': true
				}).get(0);
				var images = [];
				for (var i = 0; i < molde.run; i++) {
					images[i] = $('<img>', {
						'src': path + 'run/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy = 0;
					dir = gamepads()[0].axes[0] > 0 ? 1 : -1;
					fx = speed * gamepads()[0].axes[0];
					x += fx * delta;
					fy += arena.g;
					y += fy;
					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}
					} else char.state(fall);

					if (gamepads()[0].buttons[5].pressed || gamepads()[0].buttons[7].pressed) {
						red.state(charge);
					}
					if (gamepads()[0].axes[0] > -0.2 && gamepads()[0].axes[0] < 0.2) {
						red.state(idle);
					}
					if (gamepads()[0].buttons[0].pressed) {
						red.state(jump);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
					if ($('#som').prop('checked')) s_running.play();
				};
				this.end = function () {
					s_running.pause();
				};
			}();

			var idle = new function Idle() {
				var images = [];
				for (var i = 0; i < molde.idle; i++) {
					images[i] = $('<img>', {
						'src': path + 'idle/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				//				var sound = $('<audio>', {
				//					'loop': true,
				//					'preload': 'auto',
				//					'src': 
				//				}).data('load', false).on('canplaythrough', function () {
				//					$(this).data('load', true).get(0);
				//				});
				this.update = function () {
					if (!animation.update()) animation.start();
					fy = 0;
					fx = 0;
					fy += arena.g;
					y += fy;
					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}
						if (gamepads()[0].buttons[5].pressed || gamepads()[0].buttons[7].pressed) {
							red.state(charge);
						}
						if (gamepads()[0].axes[0] >= 0.2 || gamepads()[0].axes[0] <= -0.2) {
							red.state(run);
						}
						if (gamepads()[0].buttons[0].pressed) {
							red.state(jump);
						}
					} else char.state(fall);
				};

				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
				this.load = function () {
					return !images.find(function (image) {
						return !image.width; /* && !$(sound).data('load')*/
					});
				};
			}();

			//-------------------------------------fim dos estados do RED-------------------------------------------------------------------
			state = idle;
			state.start();

			this.name = molde.name;
			this.update = function () {
				state.update();
				tiros.forEach(function (tiro) {
					tiro.update();
				});
			};

			this.draw = function () {
				state.draw();
				tiros.forEach(function (tiro) {
					tiro.draw();
				});
			};

			this.load = function () {
				return idle.load();
			};

			this.state = function (estado) {
				if (estado) {
					state.end();
					state = estado;
					state.start();
				}
			};

			this.attack = function () {
				this.state(attack);
			};
			this.charge = function () {
				this.state(charge);
			};
			this.idle = function () {
				this.state(idle);
			};
			this.fall = function () {
				this.state(fall);
			};
			this.hit = function () {
				this.state(hit);
			};
			this.jump = function () {
				this.state(jump);
			};
			this.run = function () {
				this.state(run);
			};
		} //fim do char red

		//-- fim dos estados do red-------------------------------------------------------------------------------


		//char yellow

		function Yellow(molde) {
			//char YELLOW
			var char = this;
			var state;
			var x = molde.x;
			var y = 0;
			var name = molde.name;
			var path = './assets/chars/' + molde.name + '/';
			var fx = 0;
			var fy = 0;
			var w = molde.w; //0.035
			this.w = w;
			var h;
			var speed = molde.speed;
			var dir = -1;
			this.dir = function (rid) {
				dir = rid;
			};
			this.x = function () {
				return x;
			};
			this.y = function () {
				return y;
			};
			this.h = function () {
				return h;
			};
			var tiros = [];

			this.conflict = function (box_2) {
				var box_1 = {
					x1: yellow.x(),
					x2: yellow.x() + yellow.w,
					y1: yellow.y(),
					y2: yellow.y() + yellow.h() / canvas.height
				};

				function overlap(x1, x2, y1, y2) {
					return Math.max(x1, y1) < Math.min(x2, y2);
				}

				return overlap(box_1.x1, box_1.x2, box_2.x1, box_2.x2) && overlap(box_1.y1, box_1.y2, box_2.y1, box_2.y2);
			};

			function Animation(images, length) {
				length = length * 1000;
				var zero = Date.now();
				var atual;
				this.start = function () {
					zero = Date.now();
					atual = 0;
				};
				this.update = function () {
					atual = Math.floor((Date.now() - zero) / (length / images.length));
					if (atual >= images.length) return false;
					h = images[atual].height / images[atual].width * (w * canvas.width);
					return true;
				};
				this.draw = function () {
					ctx.save();
					ctx.translate(canvas.width * x, canvas.height * y);
					ctx.scale(dir, 1);
					ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
					ctx.restore();
				};
			}
			var power = 0;
			var max_power = 1;
			var mouseup;

			function Tiro(x, y, w) {
				var tiro = this;
				var dir = 1;
				var h = 0;
				var fy = 0;
				var state;

				function Animation(images, length) {
					length = length * 1000;
					var zero = Date.now();
					var atual;
					this.start = function () {
						zero = Date.now();
						atual = 0;
					};
					this.update = function () {
						atual = Math.floor((Date.now() - zero) / (length / images.length));
						if (atual >= images.length) return false;
						h = images[atual].height / images[atual].width * (w * canvas.width);
						return true;
					};
					this.draw = function () {
						ctx.save();
						ctx.translate(canvas.width * x, canvas.height * y);
						ctx.scale(dir, 1);
						ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
						ctx.restore();
					};
				}
				this.state = function (estado) {
					if (estado) {
						if (state) state.end();
						state = estado;
						state.start();
					}
				};

				this.x = function () {
					return x;
				};
				this.y = function () {
					return y;
				};
				this.h = function () {
					return h;
				};
				this.w = w;
				var adj = gamepads()[0].axes[2]; // trocar para gamepad 1
				var opo = gamepads()[0].axes[3]; // trocar para gamepad 1
				var ang = Math.atan2(opo, adj);
				var fx = Math.cos(ang) * power * 0.5;
				var fy = Math.sin(ang) * power * 0.5;
				this.update = function () {
					state.update();
				};
				this.draw = function () {
					state.draw();
				};
				var fly = new function Fly() {
					var images = [];
					for (var i = 0; i < molde.tiro; i++) {
						images[i] = $('<img>', {
							'src': path + 'tiro/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 0.5);
					this.update = function () {
						if (!animation.update()) {
							animation.start();
						}

						fy += arena.g;
						y += fy * delta;
						x += fx * delta;
						if (arena.conflict(tiro)) tiro.state(explosion);else if (red.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) tiro.state(explosion);else if (!overlap(tiro.x(), tiro.x() + tiro.w, 0, 1)) tiro.state(explosion);
					};

					this.draw = function () {
						animation.draw();
					};

					this.start = function () {
						animation.start();
					};

					this.end = function () {};
				}();

				var explosion = new function Explosion() {
					var images = [];
					for (var i = 0; i < 8; i++) {
						images[i] = $('<img>', {
							'src': './assets/explosion/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 1);
					this.update = function () {
						//		arena.destroy(tiro);
					};

					this.draw = function () {
						if (animation.update()) return animation.draw();
						this.end();
					};

					this.start = function () {
						w *= 5;
						tiro.w = w;
						x -= w / 2;
						y -= w / 2;
						animation.start();
						//console.log('w do char', char.w);
						//console.log('x y w do tiro', tiro.x(), tiro.y(), tiro.w);
						arena.destroy(tiro);
						if (red.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) {
							red.hit();
							$('.yellow_points').text(+$('.yellow_points').text() > 800 ? 1000 : +$('.yellow_points').text() + 200);
							$('.yellow_inner_score_bar').css('width', +$('.yellow_points').text() / 10 + '%');
							if (+$('.yellow_points').text() >= 1000) {}
						};
					};

					this.end = function () {
						tiros.shift(); //deveria tirar a si proprio
					};
				}();
				this.state(fly);
			}

			function Tiro2(x, y, w) {
				var tiro = this;
				var dir = 1;
				var h = 0;
				var fy = 0;
				var state;

				function Animation(images, length) {
					length = length * 1000;
					var zero = Date.now();
					var atual;
					this.start = function () {
						zero = Date.now();
						atual = 0;
					};
					this.update = function () {
						atual = Math.floor((Date.now() - zero) / (length / images.length));
						if (atual >= images.length) return false;
						h = images[atual].height / images[atual].width * (w * canvas.width);
						return true;
					};
					this.draw = function () {
						ctx.save();
						ctx.translate(canvas.width * x, canvas.height * y);
						ctx.scale(dir, 1);
						ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
						ctx.restore();
					};
				}
				this.state = function (estado) {
					if (estado) {
						if (state) state.end();
						state = estado;
						state.start();
					}
				};

				this.x = function () {
					return x;
				};
				this.y = function () {
					return y;
				};
				this.h = function () {
					return h;
				};
				this.w = w;
				var adj = gamepads()[0].axes[2]; // trocar para gamepad 1
				var opo = gamepads()[0].axes[3]; // trocar para gamepad 1
				var ang = Math.atan2(opo, adj);
				var fx = Math.cos(ang) * power * 0.5;
				var fy = Math.sin(ang) * power * 0.5;
				this.update = function () {
					state.update();
				};
				this.draw = function () {
					state.draw();
				};
				var fly = new function Fly() {
					var images = [];
					for (var i = 0; i < molde.tiro; i++) {
						images[i] = $('<img>', {
							'src': path + 'tiro/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 0.5);
					this.update = function () {
						if (!animation.update()) {
							animation.start();
						}

						fy += arena.g;
						y += fy * delta;
						x += fx * delta;
						if (arena.conflict(tiro)) tiro.state(explosion);else if (red.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) tiro.state(explosion);else if (!overlap(tiro.x(), tiro.x() + tiro.w, 0, 1)) tiro.state(explosion);
					};

					this.draw = function () {
						animation.draw();
					};

					this.start = function () {
						animation.start();
					};

					this.end = function () {};
				}();

				var explosion = new function Explosion() {
					var images = [];
					for (var i = 0; i < 8; i++) {
						images[i] = $('<img>', {
							'src': './assets/explosion/' + i + '.png'
						}).get(0);
					}
					images.forEach(function (image) {
						image.crossOrigin = "Anonymous";
					});
					var animation = new Animation(images, 1);
					this.update = function () {
						//		arena.destroy(tiro);
					};

					this.draw = function () {
						if (animation.update()) return animation.draw();
						this.end();
					};

					this.start = function () {
						w *= 5;
						tiro.w = w;
						x -= w / 2;
						y -= w / 2;
						animation.start();
						//console.log('w do char', char.w);
						//console.log('x y w do tiro', tiro.x(), tiro.y(), tiro.w);
						arena.destroy(tiro);
						if (red.conflict({
							x1: tiro.x(),
							x2: tiro.x() + tiro.w,
							y1: tiro.y(),
							y2: tiro.y() + tiro.w
						})) {
							red.hit();
							$('.yellow_points').text(+$('.yellow_points').text() > 800 ? 1000 : +$('.yellow_points').text() + 100);
							$('.yellow_inner_score_bar').css('width', +$('.yellow_points').text() / 10 + '%');
							if (+$('.red_points').text() >= 1000) {}
						};
					};

					this.end = function () {
						tiros.shift(); //deveria tirar a si proprio
					};
				}();
				this.state(fly);
			}

			//-------------------estados do personagen-------------------------------------------------------------------------------			
			var attack = new function Attack() {
				var images = [];
				for (var i = 0; i < molde.attack; i++) {
					images[i] = $('<img>', {
						'src': path + 'attack/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) {
						tiros.push(new Tiro(char.x() + char.w / 2, char.y() + char.w, char.w * 0.3));
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
			}();

			//ataque especial da yellow
			var attack2 = new function Attack2() {
				var images = [];
				for (var i = 0; i < molde.attack; i++) {
					images[i] = $('<img>', {
						'src': path + 'attack/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) {
						var x = char.x() + char.w / 2;
						var y = char.y() + char.w;
						var w = char.w * 0.3;
						tiros.push(new Tiro2(x + 0.01, y, w));
						tiros.push(new Tiro2(x, y, w));
						tiros.push(new Tiro2(x - 0.01, y, w));
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
			}();

			var charge = new function Charge() {
				var images = [];
				var sizing = 1;
				var atk_btn_press;
				for (var i = 0; i < molde.charge; i++) {
					images[i] = $('<img>', {
						'src': path + 'charge/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) animation.start();
					power += 0.75 * delta * sizing;
					if (power >= max_power || power <= 0) {
						sizing *= -1;
						power += 1.5 * delta * sizing;
					}
					$('.yellow_inner_power_bar').css({
						'width': power / max_power * 100 + '%'
					});
					if (atk_btn_press == 5 && !gamepads()[0].buttons[atk_btn_press].pressed) {
						char.state(attack);
					}
					if (atk_btn_press == 7 && !gamepads()[0].buttons[atk_btn_press].pressed) {
						char.state(attack2);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					power = 0;
					animation.start();
					if (gamepads()[0].buttons[5].pressed) {
						atk_btn_press = 5;
					} else {
						atk_btn_press = 7;
					}

					$(canvas).on('contextmenu', function (event) {
						event.preventDefault();
					});
				};
				//mudar com o gamepad
				this.end = function () {
					//$(canvas).off('mouseup.yellow');
				};
			}();
			//---------------------------------------------
			var fall = new function Fall() {
				var images = [];
				for (var i = 0; i < molde.fall; i++) {
					images[i] = $('<img>', {
						'src': path + 'fall/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy += arena.g;
					y += fy * delta;
					x += fx * delta;
					if (!overlap(yellow.y(), yellow.y() + yellow.h() / canvas.height, -300, 1) || !overlap(yellow.x(), yellow.x() + yellow.w, 0, 1)) {
						$('.red_points').text(1000);
						$('.red_inner_score_bar').css('width', +$('.red_points').text() / 10 + '%');
					}
					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					$(window).on("keyup.yellow", function (event) {
						keys = keys.filter(function (key) {
							return key !== event.key;
						});
					});
					animation.start();
				};
				this.end = function () {
					$(window).off('keyup.yellow');
				};
			}();

			var hit = new function Hit() {
				var images = [];
				for (var i = 0; i < molde.hit; i++) {
					images[i] = $('<img>', {
						'src': path + 'hit/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 0.5);

				this.update = function () {
					if (!animation.update()) {
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
			}();

			var jump = new function Jump() {
				var images = [];
				for (var i = 0; i < molde.jump; i++) {
					images[i] = $('<img>', {
						'src': path + 'jump/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy += arena.g;
					y += fy * delta;
					x += fx * delta;
					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}
					}
					if (fy > 0) char.state(fall);
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					fy = -0.35;
					/*$(window).on("keyup.yellow", function (event) {
     	keys = keys.filter(function (key) {
     		return key !== event.key;
     	});
     });*/
					animation.start();
				};
				this.end = function () {};
			}();
			var keys = [];

			var run = new function Run() {

				var images = [];
				for (var i = 0; i < molde.run; i++) {
					images[i] = $('<img>', {
						'src': path + 'run/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy = 0;
					dir = gamepads()[0].axes[0] > 0 ? 1 : -1; // se gamepad >0, entao 1 ,senao -1
					fx = speed * gamepads()[0].axes[0];
					x += fx * delta;
					fy += arena.g;
					y += fy;
					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}
					} else char.state(fall);

					if (gamepads()[0].buttons[5].pressed || gamepads()[0].buttons[7].pressed) {
						yellow.state(charge);
					}
					if (gamepads()[0].axes[0] > -0.2 && gamepads()[0].axes[0] < 0.2) {
						yellow.state(idle);
					}
					if (gamepads()[0].buttons[0].pressed) {
						yellow.state(jump);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
			}();

			var idle = new function Idle() {
				var images = [];
				for (var i = 0; i < molde.idle; i++) {
					images[i] = $('<img>', {
						'src': path + 'idle/' + i + '.png'
					}).get(0);
				}
				images.forEach(function (image) {
					image.crossOrigin = "Anonymous";
				});
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy = 0;
					fx = 0;
					fy += arena.g;
					y += fy;
					if (arena.conflict(char)) {
						var yInicial = y;
						while (arena.conflict(char)) {
							y -= arena.g;
							var yFim = y;
							if (yInicial - yFim > 0.05) {
								x -= fx * delta;
								y = yInicial;
								while (arena.conflict(char)) {
									y -= arena.g;
								}
							}
						}

						if (gamepads()[0].buttons[5].pressed || gamepads()[0].buttons[7].pressed) {
							yellow.state(charge);
						}
						if (gamepads()[0].axes[0] < -0.2 || gamepads()[0].axes[0] > 0.2) {
							yellow.state(run);
						}
						if (gamepads()[0].buttons[0].pressed) {
							yellow.state(jump);
						}
					} else char.state(fall);
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					animation.start();
				};
				this.end = function () {};
				this.load = function () {
					return !images.find(function (image) {
						return !image.width; /* && !$(sound).data('load')*/
					});
				};
			}();

			state = idle;
			state.start();

			this.name = molde.name;
			this.update = function () {
				state.update();
				tiros.forEach(function (tiro) {
					tiro.update();
				});
			};
			this.draw = function () {
				state.draw();
				tiros.forEach(function (tiro) {
					tiro.draw();
				});
			};
			this.load = function () {
				return idle.load();
			};

			this.state = function (estado) {
				if (estado) {
					state.end();
					state = estado;
					state.start();
				}
			};
			this.attack = function () {
				this.state(attack);
			};
			this.charge = function () {
				this.state(charge);
			};
			this.idle = function () {
				this.state(idle);
			};
			this.fall = function () {
				this.state(fall);
			};
			this.hit = function () {
				this.state(hit);
			};
			this.jump = function () {
				this.state(jump);
			};
			this.run = function () {
				this.state(run);
			};
		}

		//-- fim dos estados da yellow-------------------------------------------------------------------------------------------------------------


		//variaveis q ele carrega quando faz a conexao
		var partida;
		var red = new Red({
			x: 0.4,
			w: 0.035,
			name: 'red',
			idle: 6,
			fall: 1,
			jump: 1,
			hit: 1,
			run: 8,
			speed: 0.04,
			charge: 3,
			attack: 3,
			tiro: 3
		});

		var yellow = new Yellow({
			x: 0.6,
			w: 0.025,
			name: 'yellow',
			idle: 5,
			fall: 1,
			jump: 1,
			hit: 1,
			run: 8,
			speed: 0.04,
			charge: 4,
			attack: 3,
			tiro: 3
		});

		//propriedades da arena -------------------------------------------------------------------------------------------------------------------------
		var molde_arena;
		var arena_name = location.search.split('?')[1].split('arena=')[1].split('&')[0] || 'flat';
		switch (arena_name) {
			case 'flat':
				molde_arena = {
					'name': 'flat',
					'layers': 1,
					'prob': 0,
					'fx': 0,
					'fy': 0,
					'amax': 0,
					'amin': 0
				};
				break;
			case 'wall':
				molde_arena = {
					'name': 'wall',
					'layers': 1,
					'prob': 0,
					'fx': 0,
					'fy': 0,
					'amax': 0,
					'amin': 0
				};
				break;
		}
		var arena = new function Arena(molde) {
			var layers = [];
			for (var i = 0; i < molde.layers; i++) {
				layers[i] = $('<img>', {
					'src': './assets/arenas/' + molde.name + '/' + i + '.png'
				}).get(0);
			}
			layers.forEach(function (image) {
				image.crossOrigin = "Anonymous";
			});

			var ground = $('<img>', {
				'src': './assets/arenas/' + molde.name + '/ground.png'
			}).get(0);
			ground.crossOrigin = "Anonymous";

			var wind = {
				fx: molde.fx,
				fy: molde.fy,
				prob: molde.prob,
				amax: molde.amax, //aceleração max e min
				amin: molde.amin
			};

			var aux = $(canvas).clone().removeClass('asmtfy').addClass('aux').get(0);
			var aux_ctx = aux.getContext('2d');
			var pixel_index = function pixel_index(x, y, w) {
				return Math.floor(y * w * 4 + x * 4);
			};
			this.conflict = function (char) {
				aux_ctx.drawImage(ground, 0, -(canvas.width / ground.width * ground.height - canvas.height), canvas.width, canvas.width / ground.width * ground.height);

				char.x();
				var collision = false;
				for (var x = Math.floor(char.x() * canvas.width); x < Math.floor(char.x() * canvas.width + char.w * canvas.width); x++) {
					for (var y = Math.floor(char.y() * canvas.height + char.h() - 1); y < Math.floor(char.y() * canvas.height + char.h()); y++) {
						var collider_data = aux_ctx.getImageData(x, y, 1, 1);
						var data = collider_data.data;
						if (data[3] > 0) collision = true;
					}
				}
				return collision;
			};

			this.g = 0.01;
			this.destroy = function (tiro) {
				var x = tiro.x() * canvas.width;
				var y = tiro.y() * canvas.height;
				var w = tiro.w * canvas.width;
				var r = w / 2;

				var collider_data = aux_ctx.getImageData(0, 0, canvas.width, canvas.height);

				// otimizar essa função
				for (var _i = 0; _i < canvas.width; _i++) {
					for (var j = 0; j < canvas.height; j++) {
						var distancia = Math.sqrt(Math.pow(Math.abs(x + w / 2 - _i), 2) + Math.pow(Math.abs(y + w / 2 - j), 2));
						if (distancia < r) collider_data.data[pixel_index(_i, j, collider_data.width) + 3] = 0;
					}
				}
				aux_ctx.clearRect(0, 0, aux.width, aux.height);
				aux_ctx.putImageData(collider_data, 0, 0);
				ground.src = aux.toDataURL();
			};

			var update = function update() {
				return true;
			};

			var draw = function draw() {
				layers.concat(ground).map(function (layer) {
					ctx.drawImage(layer, 0, -(canvas.width / layer.width * layer.height - canvas.height), canvas.width, canvas.width / layer.width * layer.height);
				});
			};

			var load = function load() {
				var load = true;
				layers.concat(ground).forEach(function (layer) {
					if (!layer.width) load = false;
				});
				return load;
			};

			this.update = function () {
				update();
			};

			this.draw = function () {
				draw();
			};

			this.load = function () {
				return load();
			};
		}(molde_arena);
		//fim das prorpiedades da arena


		//inicio dos estados...-----------------------------------------------------------------------------------------------------------------------------
		var state;
		this.state = function (estado) {
			if (estado) {
				state.end();
				estado.start();
				return state = estado;
			} else {
				return state;
			}
		};

		state = new function Load() {
			var start = function start() {
				$('html').attr('lang', localStorage.getItem('lang'));

				$('body').append($('<p>', {
					'class': 'waiting'
				}).append($('<span>', {
					'lang': 'pt-br'
				}).append('Aperte START'), $('<span>', {
					'lang': 'en'
				}).append('Press START')).each(function () {
					var span = this;
					$(window).resize(function () {
						$(span).css({
							'top': $(canvas).offset().top + $(canvas).height() * 0.75 + 'px'
						});
					}).resize();
				}), $('<p>', {
					'class': 'loading'
				}).append($('<span>', {
					'lang': 'pt-br'
				}).append('Carregando'), $('<span>', {
					'lang': 'en'
				}).append('Loading'), $('<span>').each(function () {
					var tick = 0;
					var span = this;
					IntervalDosPontinhos = window.setInterval(function () {
						$(span).text('.'.repeat(++tick % 3 + 1));
					}, 1000);
				})).each(function () {
					var span = this;
					$(window).resize(function () {
						$(span).css({
							'top': $(canvas).offset().top + $(canvas).height() * 0.85 + 'px'
						});
					}).resize();
				}), $('<img>', {
					'class': 'arena',
					'src': './assets/arenas/' + location.search.split('?')[1].split('arena=')[1].split('&')[0] + '/' + location.search.split('?')[1].split('arena=')[1].split('&')[0] + '.jpg'
				}).each(function () {
					var img = this;
					$(window).resize(function () {
						$(img).css({
							'width': $(canvas).width() * 0.4 + 'px',
							'top': $(canvas).offset().top + $(canvas).height() * 0.1 + 'px'
						});
					}).resize();
				}));
			};
			var end = function end() {
				$('.loading, .waiting, .arena').remove();
			};

			//propriedades e alterações da HUD
			var update = function update() {
				//				if (red) $('.loading').remove();
				if (gamepads()[0] && gamepads()[0] && arena && red && yellow) game.state(new function Partida() {
					partida = this;
					var update = function update() {
						if (+$('.red_points').text() >= 1000) {
							$('#vencedor').text('red');
							$('#fim').show();
							return;
						}
						if (+$('.yellow_points').text() >= 1000) {
							$('#vencedor').text('yellow');
							$('#fim').show();
							return;
						}

						if (gamepads()[0] && gamepads()[0]) {
							$('#erro-controle').hide();
							if (!pause) {
								$('.options').hide();
								arena.update();
								red.update();
								yellow.update();
							} else {
								$('.options').show();
							}
						} else {
							$('#erro-controle').show();
						}
					};
					var draw = function draw() {
						arena.draw();
						red.draw();
						yellow.draw();
					};
					var start = function start() {
						clearInterval(IntervalDosPontinhos);
						//	if ($('#som').prop('checked')) battle_theme.play();
						$('<div id="erro-controle"><span lang="pt-br">conecte o controle</span><span lang="en">plug-in the gamepad</span></div>').css({
							width: '100vw',
							height: '100vh',
							position: 'absolute',
							top: 0,
							left: 0,
							display: 'flex',
							color: 'white',
							'justify-content': 'center',
							'align-items': 'center',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							'z-index': 4
						}).hide().appendTo("body");

						$('<div id="fim"><p style="text-transform: uppercase;font-size:50px;"><span id="vencedor"></span> <span lang="pt-br">venceu</span><span lang="en">wins</span></p><a href="/" class="btn"><span lang="pt-br">Nova Partida</span><span lang="en">New Game</span></a></div>').css({
							width: '100vw',
							height: '100vh',
							position: 'absolute',
							top: 0,
							left: 0,
							display: 'flex',
							'flex-direction': 'column',
							color: 'black',
							'justify-content': 'center',
							'align-items': 'center',
							backgroundColor: 'rgba(255, 255, 255, 0.5)',
							'z-index': 4
						}).hide().appendTo("body");

						var red_points;
						$('body').append(red_points = $('<p>', {
							'class': 'red_points'
						}).append('0000').each(function () {
							var points = this;
							$(window).resize(function () {
								$(points).css({
									'top': $(canvas).offset().top + $(canvas).height() * 0.025 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.025 + 'px'
								});
							}).resize();
						}).get(0));

						var red_points_bar;
						$('body').append(red_points_bar = $('<div>', {
							'class': 'red_points_bar'
						}).each(function () {
							var bar_frame = this;
							$(window).resize(function () {
								$(bar_frame).css({
									'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
									'left': $(red_points).offset().left + $(red_points).outerWidth() * 1.15 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() * 0.5 + 'px'
								});
							}).resize();
						}).append($('<div>', {
							'class': 'red_inner_score_bar'
						})));

						$('body').append($('<div>', {
							'class': 'red_team'
						}).append($('<img>', {
							src: './img/mini_portrait_red.png'
						})).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(red_points).outerWidth() * 0.9 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() + 'px',
									'left': $(red_points).offset().left + $(red_points).width() * 0.1 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'red_team_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('time azul'), $('<span>', {
							'lang': 'en'
						}).append('blue team')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'left': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top + $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'red_points_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('pontos'), $('<span>', {
							'lang': 'en'
						}).append('score')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'left': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top - $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						var yellow_points;
						$('body').append(yellow_points = $('<p>', {
							'class': 'yellow_points'
						}).append('0000').each(function () {
							var points = this;
							$(window).resize(function () {
								$(points).css({
									'top': $(canvas).offset().top + $(canvas).height() * 0.025 + 'px',
									'right': $(canvas).offset().left + $(canvas).width() * 0.025 + 'px'
								});
							}).resize();
						}).get(0));

						var yellow_points_bar;
						$('body').append(yellow_points_bar = $('<div>', {
							'class': 'yellow_points_bar'
						}).each(function () {
							var bar_frame = this;
							$(window).resize(function () {
								$(bar_frame).css({
									'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
									'right': $(red_points).offset().left + $(red_points).outerWidth() * 1.15 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() * 0.5 + 'px'
								});
							}).resize();
						}).append($('<div>', {
							'class': 'yellow_inner_score_bar'
						})));

						$('body').append($('<div>', {
							'class': 'yellow_team'
						}).append($('<img>', {
							src: './img/mini_portrait_yellow.png'
						})).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(red_points).outerWidth() * 0.9 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() + 'px',
									'right': $(red_points).offset().left + $(red_points).width() * 0.1 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'yellow_team_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('time vermelho'), $('<span>', {
							'lang': 'en'
						}).append('red team')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'right': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top + $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'yellow_points_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('pontos'), $('<span>', {
							'lang': 'en'
						}).append('score')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'right': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top - $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						var red_char_portrait;
						$('body').append(red_char_portrait = $('<img>', {
							'src': './assets/chars/red/skills/portrait.png',
							'class': 'red_char_portrait'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.06 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.125 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.0125 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<img>', {
							'src': './assets/chars/red/skills/0.png',
							'class': 'red_char_skill_1'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.02 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.017 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<img>', {
							'src': './assets/chars/red/skills/1.png',
							'class': 'red_char_skill_2'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.02 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.05 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<div>', {
							'class': 'red_power_bar'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'height': $(canvas).height() * 0.045 + 'px',
									'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.085 + 'px'
								});
							}).resize();
						}).append($('<div>', {
							'class': 'red_inner_power_bar'
						})));

						$('body').append($('<p>', {
							'class': 'red_power_bar_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('barra de força'), $('<span>', {
							'lang': 'en'
						}).append('power bar')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'top': $(red_char_portrait).offset().top + $(red_char_portrait).height() - 10 + 'px',
									'left': $(red_char_portrait).offset().left + $(red_char_portrait).width() + 10 + 'px'
								});
							}).resize();
						}));

						var yellow_char_portrait;
						$('body').append(yellow_char_portrait = $('<img>', {
							'src': './assets/chars/yellow/skills/portrait.png',
							'class': 'yellow_char_portrait'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.06 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.125 + 'px',
									'right': $(canvas).offset().left + $(canvas).width() * 0.0125 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<img>', {
							'src': './assets/chars/yellow/skills/0.png',
							'class': 'yellow_char_skill_1'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.02 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'right': $(canvas).offset().left + $(canvas).width() * 0.017 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<img>', {
							'src': './assets/chars/yellow/skills/1.png',
							'class': 'yellow_char_skill_2'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.02 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'right': $(canvas).offset().left + $(canvas).width() * 0.05 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<div>', {
							'class': 'yellow_power_bar'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'height': $(canvas).height() * 0.045 + 'px',
									'width': $(canvas).width() * 0.35 - $(yellow_points).outerWidth() + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'right': $(canvas).offset().left + $(canvas).width() * 0.085 + 'px'
								});
							}).resize();
						}).append($('<div>', {
							'class': 'yellow_inner_power_bar'
						})));

						$('body').append($('<p>', {
							'class': 'yellow_power_bar_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('barra de força'), $('<span>', {
							'lang': 'en'
						}).append('power bar')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'top': $(yellow_char_portrait).offset().top + $(yellow_char_portrait).height() - 10 + 'px',
									'right': $(canvas).width() - $(yellow_char_portrait).offset().left + 'px'
								});
							}).resize();
						}));
					};

					this.update = function () {
						update();
					};
					this.draw = function () {
						draw();
					};
					this.start = function () {
						start();
					};
					this.end = function (name) {};
				}());
			};
			var draw = function draw() {
				return true;
			};
			this.start = function () {
				start();
			};
			this.update = function () {
				update();
			};
			this.draw = function () {
				draw();
			};
			this.end = function () {
				end();
			};
		}();
		state.start();
	}();
	//fim dos estados -----------------------------------------------------------------------------------------------------------------------------

	//conexãoes dos comtroles, e configs de botões e css----------------------------------------------------------------------------------------------  
	var now;
	var delta;
	var before;

	var gamepads = function gamepads() {
		return navigator ? navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [] : [];
	};

	window.addEventListener("gamepadconnected", function (event) {
		console.log("pad conectado:", gamepads());
	});

	window.addEventListener("gamepaddisconnected", function (event) {
		console.log("pad desconectado:");
	});

	window.requestAnimationFrame(function loop() {
		now = Date.now();
		delta = (now - before) / 1000;
		before = now;

		game.state().update();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.state().draw();

		window.requestAnimationFrame(loop);
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
		if (battle_theme) battle_theme[$(this).prop('checked') ? 'play' : 'pause']();
	}).change();

	//variaveis dos sons--------------------------------------------------------------------------------------------------------------

	var audio_btn = $('<audio>', {
		'id': 'audio-btn',
		'preload': 'auto',
		'src': './mp3/s_button.mp3'
	}).get(0);

	var battle_theme = $('<audio>', {
		'id': 'audio-btn',
		'loop': true,
		'preload': 'auto',
		'src': './mp3/s_battle_theme.mp3'
	}).get(0);

	function overlap(x1, x2, y1, y2) {
		return Math.max(x1, y1) < Math.min(x2, y2);
	}

	$('.btn').click(function (event) {
		if (localStorage.getItem('som') === 'true') audio_btn.play();
	});
});

$(window).on('keyup', function (event) {
	console.log(event.key);
	if (event.key == 'Escape') pause = !pause;
});