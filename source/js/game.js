


$(function () {
	const canvas = $('.asmtfy').get(0);
	const ctx = canvas.getContext('2d');
	$(window).on('resize', function () {
		$(canvas).each(function () {
			$(this).css('height', $(this).width() * (45/100) + 'px');
			if ($(window).width() * (45/100) < $(window).height()) {
				$(this).width($(window).width()).height($(window).width() * (45/100));
			} else {
				$(this).width($(window).height() * (100/45)).height($(window).height());
			}
			this.width = $(this).width();
			this.height = $(this).height();
		});
	}).resize();

	var IntervalDosPontinhos;
	const socket = io();
	const game = new (function () {
		
		function Char(molde) {
			const char  = this;
			var state;
			var x = molde.x;
			var y = 0;
			var name = molde.name;
			var path = '/assets/chars/' + molde.name + '/'
			var fx = 0;
			var fy = 0;
			const w = molde.w;//0.035
			this.w = w;
			var h;
			var speed = molde.speed;
			var dir = -1;
			this.dir = function (rid) {
				dir = rid;
			}
			this.x = function () {return x};
			this.y = function () {return y};
			this.h = function () {return h};
			var tiros = [];

			function Animation(images, length) {
				length = length * 1000;
				var zero = Date.now();
				var atual;
				this.start = function () {
					zero = Date.now();
					atual = 0;
				}
				this.update = function () {
					atual = Math.floor((Date.now() - zero) / (length / images.length));
					if (atual >= images.length) return false;
					h = images[atual].height / images[atual].width * (w * canvas.width);
					return true;
				}
				this.draw = function () {
					ctx.save();
						ctx.translate(canvas.width * x, canvas.height * y);
						ctx.scale(dir, 1);
						ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
					ctx.restore();
				}
			}
				var power = 0;
				var max_power = 1;
				var mouseup;
			
			function Tiro (x, y, w) {
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
					}
					this.update = function () {
						atual = Math.floor((Date.now() - zero) / (length / images.length));
						if (atual >= images.length) return false;
						h = images[atual].height / images[atual].width * (w * canvas.width);
						return true;
					}
					this.draw = function () {
						ctx.save();
							ctx.translate(canvas.width * x, canvas.height * y);
							ctx.scale(dir, 1);
							ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
						ctx.restore();
					}
				}
				this.state = function (estado) {
					if (estado) {
						if (state) state.end();
						state = estado;
						state.start();
					}
				}
				this.x = () => x;
				this.y = () => y;
				this.h = () => h;
				this.w = w;
				var adj = x * canvas.width - mouseup.clientX + $(canvas).offset().left;
				var opo = y * canvas.height - mouseup.clientY + $(canvas).offset().top;
				var ang = Math.atan2(opo, adj);
				var fx = -Math.cos(ang) * power * 0.5;
				var fy = -Math.sin(ang) * power * 0.5;
				this.update = function () {
					state.update();
				}
				this.draw = function () {
					state.draw();
				}
				var fly = new (function Fly() {
					var images = [];
					for (let i = 0; i < molde.tiro; i++) {
						images[i] = $('<img>', {
							'src': path + 'tiro/' + i + '.png'
						}).get(0);
					}
					var animation = new Animation(images, 0.5);
					this.update = function () {
						if (!animation.update()) {
							animation.start();
						}

						fy += arena.g;
						y += fy * delta;
						x += fx * delta;
						if (arena.conflict(tiro)) tiro.state(explosion);
					}

					this.draw = function () {
						animation.draw();
					}

					this.start = function () {
						animation.start();
					}

					this.end = function () {
						
					}
				})();

				var explosion = new(function Explosion() {
					var images = [];
					for (let i = 0; i < 8; i++) {
						images[i] = $('<img>', {
							'src': '/assets/explosion/' + i + '.png'
						}).get(0);
					}
					var animation = new Animation(images, 1);
					this.update = function () {
					//		arena.destroy(tiro);
					}

					this.draw = function () {
						if (animation.update()) return animation.draw();
						this.end();
					}

					this.start = function () {
						w *= 5;
						tiro.w = w;
						x -= w / 2;
						y -= w / 2;
						animation.start();
						//console.log('w do char', char.w);
						//console.log('x y w do tiro', tiro.x(), tiro.y(), tiro.w);
						arena.destroy(tiro);
					}

					this.end = function () {
						tiros.shift();//deveria tirar a si proprio
					}
				})();
				this.state(fly);
			}
			
			function Tiro2 (x, y, w) {
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
					}
					this.update = function () {
						atual = Math.floor((Date.now() - zero) / (length / images.length));
						if (atual >= images.length) return false;
						h = images[atual].height / images[atual].width * (w * canvas.width);
						return true;
					}
					this.draw = function () {
						ctx.save();
							ctx.translate(canvas.width * x, canvas.height * y);
							ctx.scale(dir, 1);
							ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
						ctx.restore();
					}
				}
				this.state = function (estado) {
					if (estado) {
						if (state) state.end();
						state = estado;
						state.start();
					}
				}
				this.x = () => x;
				this.y = () => y;
				this.h = () => h;
				this.w = w;
				var adj = x * canvas.width - mouseup.clientX + $(canvas).offset().left;
				var opo = y * canvas.height - mouseup.clientY + $(canvas).offset().top;
				var ang = Math.atan2(opo, adj);
				var fx = -Math.cos(ang) * power * 0.5;
				var fy = -Math.sin(ang) * power * 0.5;
				var caindo = false;
				this.update = function () {
					state.update();
				}
				this.draw = function () {
					state.draw();
				}
				var fly = new (function Fly() {
					var images = [];
					for (let i = 0; i < molde.tiro; i++) {
						images[i] = $('<img>', {
							'src': path + 'tiro/' + i + '.png'
						}).get(0);
					}
					var animation = new Animation(images, 0.5);
					this.update = function () {
						if (!animation.update()) {
							animation.start();
						}

						fy += arena.g;
						y += fy * delta;
						x += fx * delta;
					
						if (char.name == 'yellow' && caindo == false & fy > 0) {
							caindo = true;
							tiros.push(new Tiro3(tiro.x(), tiro.y(), tiro.w, fx * 1.1, fy));
							tiros.push(new Tiro3(tiro.x(), tiro.y(), tiro.w, fx * 0.9, fy));	
						
						}
						
						if (arena.conflict(tiro)) tiro.state(explosion);
					}

					this.draw = function () {
						animation.draw();
					}

					this.start = function () {
						animation.start();
					}

					this.end = function () {
						
					}
				})();

				var explosion = new(function Explosion() {
					var images = [];
					for (let i = 0; i < 8; i++) {
						images[i] = $('<img>', {
							'src': '/assets/explosion/' + i + '.png'
						}).get(0);
					}
					var animation = new Animation(images, 1);
					this.update = function () {
					//		arena.destroy(tiro);
					}

					this.draw = function () {
						if (animation.update()) return animation.draw();
						this.end();
					}

					this.start = function () {
						w *= 5;
						tiro.w = w;
						x -= w / 2;
						y -= w / 2;
						animation.start();
						arena.destroy(tiro);
					}

					this.end = function () {
						tiros.shift();//deveria tirar a si proprio
					}
				})();
				this.state(fly);
			}

			//tiro3 é um tiro auxiliar do tiro 1
			function Tiro3 (x, y, w, fx, fy) {
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
					}
					this.update = function () {
						atual = Math.floor((Date.now() - zero) / (length / images.length));
						if (atual >= images.length) return false;
						h = images[atual].height / images[atual].width * (w * canvas.width);
						return true;
					}
					this.draw = function () {
						ctx.save();
							ctx.translate(canvas.width * x, canvas.height * y);
							ctx.scale(dir, 1);
							ctx.drawImage(images[atual], 0, 0, w * canvas.width * dir, h);
						ctx.restore();
					}
				}
				this.state = function (estado) {
					if (estado) {
						if (state) state.end();
						state = estado;
						state.start();
					}
				}
				
				this.x = () => x;
				this.y = () => y;
				this.h = () => h;
				this.w = w;
				this.update = function () {
					state.update();
				}
				this.draw = function () {
					state.draw();
				}
				var fly = new (function Fly() {
					var images = [];
					for (let i = 0; i < molde.tiro; i++) {
						images[i] = $('<img>', {
							'src': path + 'tiro/' + i + '.png'
						}).get(0);
					}
					var animation = new Animation(images, 0.5);
					this.update = function () {
						if (!animation.update()) {
							animation.start();
						}

						fy += arena.g;
						y += fy * delta;
						x += fx * delta;
						if (arena.conflict(tiro)) tiro.state(explosion);
					}

					this.draw = function () {
						animation.draw();
					}

					this.start = function () {
						animation.start();
					}

					this.end = function () {
						
					}
				})();

				var explosion = new(function Explosion() {
					var images = [];
					for (let i = 0; i < 8; i++) {
						images[i] = $('<img>', {
							'src': '/assets/explosion/' + i + '.png'
						}).get(0);
					}
					var animation = new Animation(images, 1);
					this.update = function () {
					//		arena.destroy(tiro);
					}

					this.draw = function () {
						if (animation.update()) return animation.draw();
						this.end();
					}

					this.start = function () {
						w *= 5;
						tiro.w = w;
						x -= w / 2;
						y -= w / 2;
						animation.start();
						//console.log('w do char', char.w);
						//console.log('x y w do tiro', tiro.x(), tiro.y(), tiro.w);
						arena.destroy(tiro);
					}

					this.end = function () {
						tiros.shift();//deveria tirar a si proprio
					}
				})();
				this.state(fly);
			}			

			
//-------------------estados do personagen-------------------------------------------------------------------------------			
			const attack = new (function Attack() {
				var images = [];
				for (let i = 0; i < molde.attack; i++) {
					images[i] = $('<img>', {
						'src': path + 'attack/' + i + '.png'
					}).get(0);
				}
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) {
						tiros.push(new Tiro(char.x() + char.w / 2, char.y() + char.w, char.w * 0.3));
						char.state(idle);
					}
				}
				this.draw = function () {
					animation.draw();
				}
				this.start = function () {
					animation.start();
				}
				this.end = function () {
				}
			})();
			
			//ataque especial do red
			const attack2 = new (function Attack2() {
				var images = [];
				for (let i = 0; i < molde.attack2; i++) {
					images[i] = $('<img>', {
						'src': path + 'attack/' + i + '.png'
					}).get(0);
				}
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) {
						var x = char.x() + char.w / 2;
						var y = char.y() + char.w;
						var w = char.w * 0.3;
						if (char.name == 'red') w = char.w * 0.45
						tiros.push(new Tiro2(x, y, w));
						char.state(idle);
					}
				}
				this.draw = function () {
					animation.draw();
				}
				this.start = function () {
					animation.start();
				}
				this.end = function () {
				}
			})();
			const charge = new (function Charge() {
				var images = [];
				var sizing = 1;
				for (let i = 0; i < molde.charge; i++) {
					images[i] = $('<img>', {
						'src': path + 'charge/' + i + '.png'
					}).get(0);
				}
				var animation = new Animation(images, 0.5);
				this.update = function () {
					if (!animation.update()) animation.start();
					power += 0.75 * delta * sizing;
					if (power >= max_power || power <= 0) {
						sizing *= -1;
						power += 1.5 * delta * sizing;
					}
					$('.inner_power_bar').css({
						'width': power / max_power * 100 + '%'
					})
				}
				this.draw = function () {
					animation.draw();
				}
				this.start = function () {
					power = 0;
					animation.start();
					$(canvas).mouseup(function (event) {
						mouseup = event;
						if (event.button == 0){
							char.state(attack);
						}else if (event.button == 2){
							char.state(attack2);
						}
					});
					
					$(canvas).on('contextmenu', function (event) {
						event.preventDefault();
					});
				}
				this.end = function () {
					$(canvas).off('mouseup');
				}
			})();
			const fall = new (function Fall() {
				var images = [];
				for (let i = 0; i < molde.fall; i++) {
					images[i] = $('<img>', {
						'src': path + 'fall/' + i + '.png'
					}).get(0);
				}
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
						char.state(idle);
					}
				};
				this.draw = function () {
					animation.draw();
				};
				this.start = function () {
					$(window).keyup(function (event) {
						keys = keys.filter(function (key) {
							return key !== event.key;
						});
					});
					animation.start();
				};
				this.end = function () {
					$(window).off('keyup');
				};
			})();
			const hit = new (function Hit() {
				this.update = function () {
					
				}
				this.draw = function () {
					
				}
				this.start = function () {
					
				}
				this.end = function () {
					
				}
			})();
			const jump = new (function Jump() {
				var images = [];
				for (let i = 0; i < molde.jump; i++) {
					images[i] = $('<img>', {
						'src': path + 'jump/' + i + '.png'
					}).get(0);
				}
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
				}
				this.draw = function () {
					animation.draw();
				}
				this.start = function () {
					fy = -0.35;
					$(window).keyup(function (event) {
						keys = keys.filter(function (key) {
							return key !== event.key;
						});
					});
				}
				this.end = function () {
					
				}
			})();
			var keys = [];
			
			const run = new (function Run() {
				var dir;
				var images = [];
				for (let i = 0; i < molde.run; i++) {
					images[i] = $('<img>', {
						'src': path + 'run/' + i + '.png'
					}).get(0);
				}
				var animation = new Animation(images, 1);
				this.update = function () {
					if (!animation.update()) animation.start();
					fy = 0;
					fx = speed * dir;
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
				}
				this.draw = function () {
					animation.draw();
				}
				this.start = function () {
					animation.start();
					if (keys[keys.length - 1] === 'd') {
						dir = 1
					} else {
						dir = -1
					}
					char.dir(dir);
					$(window).keydown(function (event) {
						if (event.key === keys[keys.length - 1]) return;
						if (event.key === 'w') me.state(jump);
						if (event.key === 'd' || event.key === 'a') {
							keys.push(event.key);
							me.state(run);
						}
					});
					$(window).keyup(function (event) {
						keys = keys.filter(function (key) {
							return key !== event.key;
						})
						me.state(idle);
					});
					$(canvas).mousedown(function (event) {
						keys.pop();
						me.state(charge);
						$(canvas).mousedown();
					});
				}
				this.end = function () {
					$(window).off('keydown');
					$(window).off('keyup');
					$(canvas).off('mousedown');
				}
			})();
			const idle = new (function Idle() {
				var images = [];
				for (let i = 0; i < molde.idle; i++) {
					images[i] = $('<img>', {
						'src': path + 'idle/' + i + '.png'
					}).get(0);
				}
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
					} else char.state(fall);
				}
				this.draw = function () {
					animation.draw();
				}
				this.start = function () {
					animation.start();
					if (keys.length) {
						if (keys[keys.length - 1] === 'w') me.state(jump);
						if (keys[keys.length - 1] === 'd' || keys[keys.length - 1] === 'a') {
							keys.push(keys[keys.length - 1]);
							me.state(run);
						}
					}
					$(window).keydown(function 	idle(event) {
						if (event.key === 'w') me.state(jump);
						if (event.key === 'd' || event.key === 'a') {
							keys.push(event.key);
							me.state(run);
						}
					})
					$(canvas).mousedown(function (event) {
						me.state(charge);
						$(canvas).mousedown();
					});
				}
				this.end = function () {
					$(window).off('keydown');
					$(canvas).off('keyup');
					$(canvas).off('mousedown');
				}
				this.load = function () {
					return !images.find(function (image) {
						return !image.width /* && !$(sound).data('load')*/
					})
				}
			})();
			
			state = idle;
			state.start();

			this.name = molde.name;
			this.update = function () {
				state.update();
				tiros.forEach(function (tiro) {
					tiro.update();
				});
				
			}
			this.draw = function () {
				state.draw();
				tiros.forEach(function (tiro) {
					tiro.draw();
				});
			}
			this.load = function () {
				return idle.load();
			}

			this.state = function (estado) {
				if (estado) {
					state.end();
					state = estado;
					state.start();
				}
			}
			this.attack = function () {
				this.state(attack);
			}
			this.charge = function () {
				this.state(charge);
			}
			this.idle = function () {
				this.state(idle);
			}
			this.fall = function () {
				this.state(fall);
			}
			this.hit = function () {
				this.state(hit);
			}
			this.jump = function () {
				this.state(jump);
			}
			this.run = function () {
				this.state(run);
			}
		}
//-- fim dos estados dos personagens-------------------------------------------------------------------------------

//variaveis q ele carrega quando faz a conexao
		var me;
		socket.on('me', function (molde) {
			me = new Char(molde);
		});
		
		var oponent;
		socket.on('oponent', function (molde) {
			oponent = new Char(molde);
		});
		
//propriedades da arena -------------------------------------------------------------------------------------------------------------------------
		var arena;
		socket.on('arena', function (molde) {
			arena = new (function Arena() {
				const layers = [];
				for (let i = 0; i < molde.layers; i++) {
					layers[i] = $('<img>', {
						'src': '/assets/arenas/' + molde.name + '/' + i + '.png'
					}).get(0);
				}

				const ground = $('<img>', {
					'src': '/assets/arenas/' + molde.name + '/ground.png'
				}).get(0);

				const wind = {
					fx: molde.fx,
					fy: molde.fy,
					prob: molde.prob,
					amax: molde.amax, //aceleração max e min
					amin: molde.amin
				};
				
				const aux = $(canvas).clone().removeClass('asmtfy').addClass('aux').get(0);
				const aux_ctx = aux.getContext('2d');
				const pixel_index = (x, y, w) => Math.floor(y * w * 4 + x * 4);
				this.conflict = function (char) {
					aux_ctx.drawImage(
						ground,
						0,
						-(canvas.width / ground.width * ground.height - canvas.height),
						canvas.width,
						canvas.width / ground.width * ground.height
					);

					char.x();
					var collision = false;
					for (let x = Math.floor(char.x() * canvas.width); x < Math.floor(char.x() * canvas.width + char.w * canvas.width); x++) {
						for (let y = Math.floor(char.y() * canvas.height + char.h() - 1); y < Math.floor(char.y() * canvas.height + char.h()); y++) {
							var collider_data = aux_ctx.getImageData(x, y, 1, 1);
							var data = collider_data.data;
							if (data[3] > 0) collision = true;
						}
					}
					return collision;
				}
				
				this.g = 0.01;
				this.destroy = function (tiro) {
					var x = tiro.x() * canvas.width;
					var y = tiro.y() * canvas.height;
					var w = tiro.w * canvas.width;
					var r = w / 2;
					
					var collider_data = aux_ctx.getImageData(0, 0, canvas.width, canvas.height);
		
					// otimizar essa função
					for (let i = 0; i < canvas.width; i++) {
						for (let j = 0; j < canvas.height; j++) {
							var distancia = Math.sqrt((Math.abs((x + (w / 2)) - i)**2) + (Math.abs((y + (w / 2)) - j)**2));
							if (distancia < r) collider_data.data[pixel_index(i, j, collider_data.width) + 3] = 0;
							//collider_data.data[pixel_index(i, j, collider_data.width) + 3] = 0
						}
					}
					aux_ctx.clearRect(0, 0, aux.width, aux.height);
					aux_ctx.putImageData(collider_data, 0, 0);
					ground.src = aux.toDataURL();
				}

				const update = function () {
					return true;
				};
	
				const draw = function () {
					layers.concat(ground).map(function (layer) {
						ctx.drawImage(
							layer,
							0,
							-(canvas.width / layer.width * layer.height - canvas.height),
							canvas.width,
							canvas.width / layer.width * layer.height
						);
					});
				};
	
				const load = function () {
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
			});
		});

		
		//alteramos aqui, para resolver o ploblema da conexão multipla
		socket.on('connect', function() {
			var cookies = {
				'arena': Cookies.get('arena'),
				'char': Cookies.get('char')
			}
			socket.emit('cookies', cookies);
		});
		
		
		//inicio dos estados...
		var state;
		this.state = function (estado) {
			if (estado) {
				state.end();
				estado.start();
				return state = estado;
			} else {
				return state;
			}
		}

		state = new (function Load() {
			const start = function () {
				$('html').attr('lang', localStorage.getItem('lang'));

				$('body').append(
					$('<p>', {
						'class': 'waiting'
					}).append(
						$('<span>', {
							'lang': 'pt-br'
						}).append('Esperando oponente'),
	
						$('<span>', {
							'lang': 'en'
						}).append('Waiting opponent'),
	
						$('<span>').each(function () {
							var tick = 0;
							const span = this;
							IntervalDosPontinhos = window.setInterval(function () {
								$(span).text('.'.repeat(++tick % 3 + 1));
							}, 1000);
						})
					).each(function () {
						const span = this;
						$(window).resize(function () {
							$(span).css({
								'top': $(canvas).offset().top + $(canvas).height() * 0.75 + 'px'
							});
						}).resize();
					}),
	
					$('<p>', {
						'class': 'loading'
					}).append(
						$('<span>', {
							'lang': 'pt-br'
						}).append('Carregando'),
	
						$('<span>', {
							'lang': 'en'
						}).append('Loading'),
	
					 	$('<span>').each(function () {
							var tick = 0;
							const span = this
							IntervalDosPontinhos = window.setInterval(function () {
								$(span).text('.'.repeat(++tick % 3 + 1));
							}, 1000);
						})
					).each(function () {
						const span = this;
						$(window).resize(function () {
							$(span).css({
								'top': $(canvas).offset().top + $(canvas).height() * 0.85 + 'px'
							});
						}).resize();
					}),

					$('<img>', {
						'class': 'arena',
						'src': '/assets/arenas/' + Cookies.get('arena') + '/' + Cookies.get('arena') + '.jpg'
					}).each(function () {
						const img = this;
						$(window).resize(function () {
							$(img).css({
								'width': $(canvas).width() * 0.4 + 'px',
								'top': $(canvas).offset().top + $(canvas).height() * 0.1 + 'px'
							})
						}).resize();
					})
				);

				
			}
			const end = function () {
				$('.loading, .waiting, .arena').remove();
			}
			
			socket.on('found', function (id, char) {
				socket.emit('found', id, char);
			})
			
//propriedades e alterações da HUD			
			const update = function () {
//				if (me) $('.loading').remove();
				if (arena && me) game.state(new function Partida() {
					const update = function () {
						arena.update();
						me.update();
					};
					const draw = function () {
						arena.draw();
						me.draw();
					};
					const start = function () {
						clearInterval(IntervalDosPontinhos);
						var red_points;
						$('body').append(
							red_points = $('<p>', {
								'class': 'red_points'
							}).append(
								'0000'
							).each(function () {
								var points = this;
								$(window).resize(function () {
									$(points).css({
										'top': $(canvas).offset().top + $(canvas).height() * 0.025 + 'px',
										'left': $(canvas).offset().left + $(canvas).width() * 0.025 + 'px'
									});
								}).resize();
							}).get(0)
						);

						var red_points_bar;
						$('body').append(
							red_points_bar = $('<div>', {
								'class': 'red_points_bar'
							}).each(function () {
								var bar_frame = this;
								$(window).resize(function () {
									$(bar_frame).css({
										'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
										'left': $(red_points).offset().left + $(red_points).outerWidth() * 1.15 + 'px', 
										'top': $(red_points).offset().top + $(red_points).outerHeight() * 0.5 + 'px'
									})
								}).resize();
							}).append(
								$('<div>', {
									'class': 'red_inner_score_bar'
								})
							)
						);

						$('body').append(
							$('<div>', {
								'class': 'red_team'
							}).append(
								$('<img>', {
									src: '/img/mini_portrait_red.png'
								})
							).each(function () {
								var portrait = this;
								$(window).resize(function () {
									$(portrait).css({
										'width': $(red_points).outerWidth() * 0.9 + 'px',
										'top': $(red_points).offset().top + $(red_points).outerHeight() + 'px',
										'left': $(red_points).offset().left + $(red_points).width() * 0.1 + 'px'
									});
								}).resize();
							})
						);

						$('body').append(
							$('<p>', {
								'class': 'red_team_label'
							}).append(
								$('<span>',{
									'lang': 'pt-br'
								}).append('time azul'),
								
								$('<span>',{
									'lang': 'en'
								}).append('blue team'),
							).each(function () {
								var time = this;
								$(window).resize(function () {
									$(time).css({
										'left': $(red_points_bar).offset().left - 30 + 'px',
										'top': $(red_points_bar).offset().top + $(red_points_bar).outerHeight() + 5 + 'px'
									})
								}).resize();
							})
						)

						$('body').append(
							$('<p>', {
								'class': 'red_points_label'
							}).append(
								$('<span>',{
									'lang': 'pt-br'
								}).append('pontos'),
								
								$('<span>',{
									'lang': 'en'
								}).append('score'),
							).each(function () {
								var time = this;
								$(window).resize(function () {
									$(time).css({
										'left': $(red_points_bar).offset().left - 30 + 'px',
										'top': $(red_points_bar).offset().top - $(red_points_bar).outerHeight() + 5 + 'px'
									})
								}).resize();
							})
						)

						var yellow_points;
						$('body').append(
							yellow_points = $('<p>', {
								'class': 'yellow_points'
							}).append(
								'0000'
							).each(function () {
								var points = this;
								$(window).resize(function () {
									$(points).css({
										'top': $(canvas).offset().top + $(canvas).height() * 0.025 + 'px',
										'right': $(canvas).offset().left + $(canvas).width() * 0.025 + 'px'
									});
								}).resize();
							}).get(0)
						);

						var yellow_points_bar;
						$('body').append(
							yellow_points_bar = $('<div>', {
								'class': 'yellow_points_bar'
							}).each(function () {
								var bar_frame = this;
								$(window).resize(function () {
									$(bar_frame).css({
										'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
										'right': $(red_points).offset().left + $(red_points).outerWidth() * 1.15 + 'px', 
										'top': $(red_points).offset().top + $(red_points).outerHeight() * 0.5 + 'px'
									})
								}).resize();
							}).append(
								$('<div>', {
									'class': 'yellow_inner_score_bar'
								})
							)
						);

						$('body').append(
							$('<div>', {
								'class': 'yellow_team'
							}).append(
								$('<img>', {
									src: '/img/mini_portrait_yellow.png'
								})
							).each(function () {
								var portrait = this;
								$(window).resize(function () {
									$(portrait).css({
										'width': $(red_points).outerWidth() * 0.9 + 'px',
										'top': $(red_points).offset().top + $(red_points).outerHeight() + 'px',
										'right': $(red_points).offset().left + $(red_points).width() * 0.1 + 'px'
									});
								}).resize();
							})
						);

						$('body').append(
							$('<p>', {
								'class': 'yellow_team_label'
							}).append(
								$('<span>',{
									'lang': 'pt-br'
								}).append('time vermelho'),
								
								$('<span>',{
									'lang': 'en'
								}).append('red team'),
							).each(function () {
								var time = this;
								$(window).resize(function () {
									$(time).css({
										'right': $(red_points_bar).offset().left - 30 + 'px',
										'top': $(red_points_bar).offset().top + $(red_points_bar).outerHeight() + 5 + 'px'
									})
								}).resize();
							})
						)

						$('body').append(
							$('<p>', {
								'class': 'yellow_points_label'
							}).append(
								$('<span>',{
									'lang': 'pt-br'
								}).append('pontos'),
								
								$('<span>',{
									'lang': 'en'
								}).append('score'),
							).each(function () {
								var time = this;
								$(window).resize(function () {
									$(time).css({
										'right': $(red_points_bar).offset().left - 30 + 'px',
										'top': $(red_points_bar).offset().top - $(red_points_bar).outerHeight() + 5 + 'px'
									})
								}).resize();
							})
						)
						
						var char_portrait;
						$('body').append(
							char_portrait = $('<img>', {
								'src': '/assets/chars/' + Cookies.get('char')  + '/skills/portrait.png',
								'class': 'char_portrait'
							}).each(function () {
								var portrait = this;
								$(window).resize(function () {
									$(portrait).css({
										'width': $(canvas).width() * 0.06 + 'px',
										'bottom': $(canvas).offset().top + $(canvas).height() * 0.125 + 'px',
										'left': $(canvas).offset().left + $(canvas).width() * 0.0125 + 'px'
									});
								}).resize();
							})
						)

						$('body').append(
							$('<img>', {
								'src': '/assets/chars/' + Cookies.get('char')  + '/skills/0.png',
								'class': 'char_skill_1'
							}).each(function () {
								var portrait = this;
								$(window).resize(function () {
									$(portrait).css({
										'width': $(canvas).width() * 0.02 + 'px',
										'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
										'left': $(canvas).offset().left + $(canvas).width() * 0.017 + 'px'
									});
								}).resize();
							})
						)

						$('body').append(
							$('<img>', {
								'src': '/assets/chars/' + Cookies.get('char')  + '/skills/1.png',
								'class': 'char_skill_2'
							}).each(function () {
								var portrait = this;
								$(window).resize(function () {
									$(portrait).css({
										'width': $(canvas).width() * 0.02 + 'px',
										'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
										'left': $(canvas).offset().left + $(canvas).width() * 0.05 + 'px'
									});
								}).resize();
							})
						)

						$('body').append(
							$('<div>', {
								'class': 'power_bar'
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
							}).append(
								$('<div>', {
									'class': 'inner_power_bar'
								})
							)
						)

						$('body').append(
							$('<p>', {
								'class': 'power_bar_label'
							}).append(
								$('<span>',{
									'lang': 'pt-br'
								}).append('barra de força'),
								
								$('<span>',{
									'lang': 'en'
								}).append('power bar'),
							).each(function () {
								var time = this;
								$(window).resize(function () {
									$(time).css({
										'top': $(char_portrait).offset().top + $(char_portrait).height() - 10 + 'px',
										'left': $(char_portrait).offset().left + $(char_portrait).width() + 10 + 'px'
									})
								}).resize();
							})
						)
					};
					const end = function () {
						$('*').not(canvas).remove();
					};

					this.update = function () {
						update();
					}
					this.draw = function () {
						draw();
					}
					this.start = function () {
						start();
					}
					this.end = function () {
						end();
					}
				}());
			}
			const draw = function () {
				return true;
			}
			this.start = function () {
				start();
			}
			this.update = function () {
				update();
			}
			this.draw = function () {
				draw();
			}
			this.end = function () {
				end();
			}
		})();
		state.start();
	})();

	var now;
	var delta;
	var before;
	window.requestAnimationFrame(function loop() {
		now = Date.now();
		delta = (now - before) / 1000;
		before = now;

		game.state().update();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.state().draw();

		window.requestAnimationFrame(loop);
	});
});