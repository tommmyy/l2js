(function(l2js) {
	var env = l2js.compiler.env, ctx = {};
	var funcs = {
		__color : function(r, g, b) {
			var rgb = r;
			rgb = rgb << 8;
			rgb |= g;
			rgb = rgb << 8;
			rgb |= b;
			return rgb / 16581375;
		}
	};
	var Turtle2D, Brushes;
	Turtle2D = new env.Alphabet('Turtle2D', []);
	Brushes = (function(_super, ctx) {
		l2js.utils.extend(Brushes, _super);
		function Brushes() {
			Brushes.__super__.constructor.apply(this, arguments);
			this.self = Brushes;
			var S1, B1, KochFlake, Position;
			S1 = (function(_super, ctx) {
				l2js.utils.extend(S1, _super);
				function S1() {
					S1.__super__.constructor.apply(this, arguments);
					this.self = S1;
					this._init();
				}


				S1.prototype._init = function() {
				};
				S1.alphabet = Turtle2D;
				S1.id = 'S1';
				S1.prototype.rules = {};
				S1.prototype.rules['-@11_I'] = [];
				S1.prototype.rules['-@1_A'] = [];
				S1.prototype.rules['-@1_L'] = [];
				S1.prototype.rules['-@1_L'] = [];
				S1.prototype.rules['h@1_PU'] = [];
				S1.prototype.rules['-@11_I'].push({
					probability : 1,
					successor : function(scale, color) {
						return [env.LSystem.getModule('PU', [color], S1.alphabet)].concat([env.LSystem.getModule('V', [], S1.alphabet)], [env.LSystem.getModule('A', [scale * 2], S1.alphabet)], [env.LSystem.getModule('PS', [], S1.alphabet)]);
					}
				});
				S1.prototype.rules['-@1_A'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('L', [45], S1.alphabet)].concat([new env.Stack(env.LSystem.getModule('[', [], S1.alphabet), env.LSystem.getModule(']', [], S1.alphabet), [env.LSystem.getModule('f', [a / 2], S1.alphabet)].concat([env.LSystem.getModule('V', [], S1.alphabet)]))], [env.LSystem.getModule('A', [a], S1.alphabet)]);
					}
				});
				S1.prototype.rules['-@1_L'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('L', [a + 1], S1.alphabet)].concat();
					}
				});
				S1.prototype.rules['-@1_L'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('L', [a - 2], S1.alphabet)].concat();
					}
				});
				S1.prototype.rules['h@1_PU'].push({
					probability : 1,
					successor : function(color) {
						return [env.LSystem.getModule('PU', [color, 0], S1.alphabet)].concat();
					}
				});
				S1.prototype.axiom = function() {
					return [env.LSystem.getModule('I', [1, funcs.__color(5, 5, 5)], S1.alphabet)].concat();
				};
				S1.prototype.maxIterations = 4;
				return S1;
			})(env.LSystem, this.ctx);
			B1 = (function(_super, ctx) {
				l2js.utils.extend(B1, _super);
				function B1() {
					B1.__super__.constructor.apply(this, arguments);
					this.self = B1;
					this._init();
				}


				B1.prototype._init = function() {
				};
				B1.alphabet = Turtle2D;
				B1.id = 'B1';
				B1.prototype.rules = {};
				B1.prototype.rules['-@1_f'] = [];
				B1.prototype.rules['-@1_f'] = [];
				B1.prototype.rules['h@1_G'] = [];
				B1.prototype.rules['h@1_G'] = [];
				B1.prototype.rules['-@1_f'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('f', [a / 2], B1.alphabet)].concat([new env.Stack(env.LSystem.getModule('[', [], B1.alphabet), env.LSystem.getModule(']', [], B1.alphabet), [env.LSystem.getModule('L', [90], B1.alphabet)].concat([env.LSystem.getModule('G', [a / 4], B1.alphabet)]))], [new env.Stack(env.LSystem.getModule('[', [], B1.alphabet), env.LSystem.getModule(']', [], B1.alphabet), [env.LSystem.getModule('R', [90], B1.alphabet)].concat([env.LSystem.getModule('G', [a / 4], B1.alphabet)]))], [env.LSystem.getModule('f', [a / 2], B1.alphabet)]);
					}
				});
				B1.prototype.rules['-@1_f'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('f', [a / 2], B1.alphabet)].concat([new env.Stack(env.LSystem.getModule('[', [], B1.alphabet), env.LSystem.getModule(']', [], B1.alphabet), [env.LSystem.getModule('R', [60], B1.alphabet)].concat([env.LSystem.getModule('G', [a / 4], B1.alphabet)]))], [new env.Stack(env.LSystem.getModule('[', [], B1.alphabet), env.LSystem.getModule(']', [], B1.alphabet), [env.LSystem.getModule('L', [70], B1.alphabet)].concat([env.LSystem.getModule('G', [a / 4], B1.alphabet)]))], [env.LSystem.getModule('f', [a / 2], B1.alphabet)]);
					}
				});
				B1.prototype.rules['h@1_G'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('f', [a], B1.alphabet)].concat([new env.SubLSystem(this.ctx, S1, [env.LSystem.getModule('I', [a, funcs.__color(0, 255)], S1.alphabet)].concat(), 5).derive()]);
					}
				});
				B1.prototype.rules['h@1_G'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('f', [a], B1.alphabet)].concat([new env.SubLSystem(this.ctx, S1, [env.LSystem.getModule('I', [a, funcs.__color(255)], S1.alphabet)].concat(), 6).derive()]);
					}
				});
				B1.prototype.axiom = function() {
					return [env.LSystem.getModule('f', [1], B1.alphabet)].concat();
				};
				B1.prototype.maxIterations = 2;
				return B1;
			})(env.LSystem, this.ctx);
			KochFlake = (function(_super, ctx) {
				l2js.utils.extend(KochFlake, _super);
				function KochFlake() {
					KochFlake.__super__.constructor.apply(this, arguments);
					this.self = KochFlake;
					this._init();
				}


				KochFlake.prototype._init = function() {
					this.ctx.$angle = 60;
				};
				KochFlake.alphabet = Turtle2D;
				KochFlake.id = 'KochFlake';
				KochFlake.prototype.rules = {};
				KochFlake.prototype.rules['-@1_I'] = [];
				KochFlake.prototype.rules['-@1_F'] = [];
				KochFlake.prototype.rules['h@1_F'] = [];
				KochFlake.prototype.rules['-@1_I'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('F', [a / 3], KochFlake.alphabet)].concat([env.LSystem.getModule('R', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('R', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('F', [a / 3], KochFlake.alphabet)], [env.LSystem.getModule('R', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('R', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('F', [a / 3], KochFlake.alphabet)]);
					}
				});
				KochFlake.prototype.rules['-@1_F'].push({
					probability : 1,
					successor : function(a) {
						return [env.LSystem.getModule('F', [a / 2], KochFlake.alphabet)].concat([env.LSystem.getModule('L', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('F', [a / 2], KochFlake.alphabet)], [env.LSystem.getModule('R', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('R', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('F', [a / 2], KochFlake.alphabet)], [env.LSystem.getModule('L', [this.ctx.$angle], KochFlake.alphabet)], [env.LSystem.getModule('F', [a / 2], KochFlake.alphabet)]);
					}
				});
				KochFlake.prototype.rules['h@1_F'].push({
					probability : 1,
					successor : function(a) {
						return [new env.SubLSystem(this.ctx, B1, [env.LSystem.getModule('f', [a], B1.alphabet)].concat()).derive()].concat();
					}
				});
				KochFlake.prototype.axiom = function() {
					return [env.LSystem.getModule('I', [1], KochFlake.alphabet)].concat();
				};
				KochFlake.prototype.maxIterations = 3;
				return KochFlake;
			})(env.LSystem, this.ctx);
			Position = (function(_super, ctx) {
				l2js.utils.extend(Position, _super);
				function Position() {
					Position.__super__.constructor.apply(this, arguments);
					this.self = Position;
					this._init();
				}


				Position.prototype._init = function() {
				};
				Position.alphabet = Turtle2D;
				Position.id = 'Position';
				Position.prototype.rules = {};
				Position.prototype.rules['-@_A'] = [];
				Position.prototype.rules['-@_A'].push({
					probability : 1,
					successor : function() {
						return [new env.SubLSystem(this.ctx, KochFlake, [env.LSystem.getModule('I', [0.7], KochFlake.alphabet)].concat() ).derive()].concat();
					}
				});
				Position.prototype.axiom = function() {
					return [env.LSystem.getModule('R', [90], Position.alphabet)].concat([env.LSystem.getModule('f', [0.1], Position.alphabet)], [env.LSystem.getModule('L', [90], Position.alphabet)], [env.LSystem.getModule('A', [], Position.alphabet)]);
				};
				Position.prototype.maxIterations = 1;
				return Position;
			})(env.LSystem, this.ctx);
			this.main = Position;
		}


		Brushes.id = 'Brushes';
		return Brushes;
	})(env.LScript, ctx);
	return new Brushes(ctx).derive();
})(l2js); 