(function(l2js) {
	var env = l2js.compiler.env, getModule = env.LSystem.getModule, getParamModule = env.LSystem.getParamModule, stats = {
		numberOfDerivedSymbols : 0
	}, ctx = {
		stats : stats
	};
	var funcs = {
		__rgb : function(r, g, b, a) {
			return l2js.utils.RGBToInt({
				model : 'rgb',
				r : r,
				g : g,
				b : b,
				a : a
			});
		},
		__hsv : function(h, s, v, a) {
			return l2js.utils.RGBToInt(l2js.utils.HSVToRGB({
				model : 'hsv',
				h : h,
				s : s,
				v : v,
				a : a
			}));
		}
	};
	var Turtle2D, Cloud1Script;
	Turtle2D = new env.Alphabet('Turtle2D', []);
	ctx.$black = funcs.__rgb(0, 0, 0, 255);
	Cloud1Script = (function(_super, ctx) {
		l2js.utils.extend(Cloud1Script, _super);
		function Cloud1Script() {
			Cloud1Script.__super__.constructor.apply(this, arguments);
			this.self = Cloud1Script;
			var Square, B1, Start;
			Square = (function(_super, ctx) {
				l2js.utils.extend(Square, _super);
				function Square() {
					Square.__super__.constructor.apply(this, arguments);
					this.self = Square;
					this._init();
				}
				Square.prototype._init = function() {
					this.ctx.$angle = 90;
				};
				Square.alphabet = Turtle2D;
				Square.id = 'Square';
				Square.prototype.rules = {};
				Square.prototype.rules['-@11_A'] = [];
				Square.prototype.rules['h@1_vertex'] = [];
				Square.prototype.rules['-@11_A'].push({
					probability : 1,
					successor : function(step, color) {
						return [getModule('R', [45], Square.alphabet)].concat([getModule('PU', [color], Square.alphabet)], [getModule('vertex', [step], Square.alphabet)], [getModule('vertex', [step], Square.alphabet)], [getModule('vertex', [step], Square.alphabet)], [getModule('vertex', [step], Square.alphabet)], [getModule('PS', [], Square.alphabet)], [getModule('L', [45], Square.alphabet)]);
					}
				});
				Square.prototype.rules['h@1_vertex'].push({
					probability : 1,
					successor : function(a) {
						return [getModule('R', [this.ctx.$angle], Square.alphabet)].concat([new env.Stack(getModule('[', [], Square.alphabet), getModule(']', [], Square.alphabet), [getModule('f', [a / 1.414, 0.01], Square.alphabet)].concat([getModule('V', [], Square.alphabet)]))]);
					}
				});
				Square.prototype.axiom = function() {
					return [getModule('A', [0.1, funcs.__rgb(180, 1, 1, 255)], Square.alphabet)].concat();
				};
				Square.prototype.maxIterations = 1;
				return Square;
			})(env.LSystem, this.ctx);
			B1 = (function(_super, ctx) {
				l2js.utils.extend(B1, _super);
				function B1() {
					B1.__super__.constructor.apply(this, arguments);
					this.self = B1;
					this._init();
				}
				B1.prototype._init = function() {
					this.ctx.$color = funcs.__hsv(180, 0, 0.5, 255);
				};
				B1.alphabet = Turtle2D;
				B1.id = 'B1';
				B1.prototype.rules = {};
				B1.prototype.rules['-@1_A'] = [];
				B1.prototype.rules['h@1_s'] = [];
				B1.prototype.rules['-@1_A'].push({
					probability : 1,
					successor : function(step) {
						return [getModule('s', [step], B1.alphabet)].concat([getModule('L', [60], B1.alphabet)], [getModule('f', [step], B1.alphabet)], [getModule('s', [step], B1.alphabet)], [getModule('L', [30], B1.alphabet)], [getModule('f', [step], B1.alphabet)], [getModule('L', [30], B1.alphabet)], [getModule('s', [step], B1.alphabet)]);
					}
				});
				B1.prototype.rules['h@1_s'].push({
					probability : 1,
					successor : function(a) {
						return [new env.SubLSystem(this.ctx, Square, [getModule('A', [a * 1, funcs.__hsv(180, 0, 0.5, 255)], Square.alphabet)].concat()).derive()].concat();
					}
				});
				B1.prototype.axiom = function() {
					return [getModule('A', [0.1], B1.alphabet)].concat();
				};
				B1.prototype.maxIterations = 1;
				return B1;
			})(env.LSystem, this.ctx);
			Start = (function(_super, ctx) {
				l2js.utils.extend(Start, _super);
				function Start() {
					Start.__super__.constructor.apply(this, arguments);
					this.self = Start;
					this._init();
				}
				Start.prototype._init = function() {
				};
				Start.alphabet = Turtle2D;
				Start.id = 'Start';
				Start.prototype.rules = {};
				Start.prototype.rules['-@1_A'] = [];
				Start.prototype.rules['-@1_A'] = [];
				Start.prototype.rules['-@1_A'] = [];
				Start.prototype.rules['-@1_U'] = [];
				Start.prototype.rules['-@1_W'] = [];
				Start.prototype.rules['-@1_W'] = [];
				Start.prototype.rules['h@_L'] = [];
				Start.prototype.rules['h@_R'] = [];
				Start.prototype.rules['h@_R'] = [];
				Start.prototype.rules['h@_V'] = [];
				Start.prototype.rules['h@1_F'] = [];
				Start.prototype.rules['h@1_F'] = [];
				Start.prototype.rules['h@1_F'] = [];
				Start.prototype.rules['-@1_A'].push({
					probability : 1,
					successor : function(step) {
						return [getModule('U', [step], Start.alphabet)].concat([getModule('F', [step], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('L', [], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('L', [], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('U', [step], Start.alphabet)]);
					}
				});
				Start.prototype.rules['-@1_A'].push({
					probability : 1,
					successor : function(step) {
						return [getModule('U', [step], Start.alphabet)].concat([getModule('F', [step], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('W', [step], Start.alphabet)]);
					}
				});
				Start.prototype.rules['-@1_A'].push({
					probability : 0.5,
					successor : function(step) {
						return [getModule('U', [step], Start.alphabet)].concat([getModule('F', [step * step], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('W', [step * step], Start.alphabet)]);
					}
				});
				Start.prototype.rules['-@1_U'].push({
					probability : 1,
					successor : function(step) {
						return [getModule('R', [], Start.alphabet)].concat([getModule('W', [step], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('L', [], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('L', [], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('W', [step], Start.alphabet)], [getModule('R', [], Start.alphabet)]);
					}
				});
				Start.prototype.rules['-@1_W'].push({
					probability : 1,
					successor : function(step) {
						return [getModule('L', [], Start.alphabet)].concat([getModule('U', [step], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('R', [], Start.alphabet)], [getModule('W', [step], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('W', [step], Start.alphabet)], [getModule('R', [], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('L', [], Start.alphabet)]);
					}
				});
				Start.prototype.rules['-@1_W'].push({
					probability : 0.5,
					successor : function(step) {
						return [getModule('L', [], Start.alphabet)].concat([getModule('A', [(step)], Start.alphabet)], [getModule('W', [step * step], Start.alphabet)], [getModule('U', [step + step], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('R', [], Start.alphabet)], [getModule('W', [step], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('W', [step], Start.alphabet)], [getModule('R', [], Start.alphabet)], [getModule('F', [step], Start.alphabet)], [getModule('U', [step], Start.alphabet)], [getModule('L', [], Start.alphabet)]);
					}
				});
				Start.prototype.rules['h@_L'].push({
					probability : 1,
					successor : function() {
						return [getModule('L', [90], Start.alphabet)].concat();
					}
				});
				Start.prototype.rules['h@_R'].push({
					probability : 1,
					successor : function() {
						return [getModule('R', [90], Start.alphabet)].concat();
					}
				});
				Start.prototype.rules['h@_R'].push({
					probability : 0.5,
					successor : function() {
						return [new env.Stack(getModule('[', [], Start.alphabet), getModule(']', [], Start.alphabet), undefined.concat())].concat([getModule('R', [90], Start.alphabet)]);
					}
				});
				Start.prototype.rules['h@_V'].push({
					probability : 1,
					successor : function() {
						return [getModule('v', [], Start.alphabet)].concat();
					}
				});
				Start.prototype.rules['h@1_F'].push({
					probability : 1,
					successor : function(step) {
						return [getModule('f', [step], Start.alphabet)].concat([new env.SubLSystem(this.ctx, Square, [getModule('A', [step, funcs.__hsv(100, 0, 0.5, 255)], Square.alphabet)].concat(), 2).derive()]);
					}
				});
				Start.prototype.rules['h@1_F'].push({
					probability : 1,
					successor : function(step) {
						return [getModule('f', [step], Start.alphabet)].concat([new env.SubLSystem(this.ctx, Square, [getModule('A', [step, funcs.__hsv(100, 0, 0.5, 100)], Square.alphabet)].concat(), 2).derive()]);
					}
				});
				Start.prototype.rules['h@1_F'].push({
					probability : 2,
					successor : function(step) {
						return [getModule('f', [step], Start.alphabet)].concat();
					}
				});
				Start.prototype.axiom = function() {
					return [getModule('A', [0.01], Start.alphabet)].concat();
				};
				Start.prototype.maxIterations = 3;
				return Start;
			})(env.LSystem, this.ctx);
			this.main = Start;
		}
		Cloud1Script.id = 'Cloud1Script';
		return Cloud1Script;
	})(env.LScript, ctx);
	return new Cloud1Script(ctx).derive();
})(l2js); 