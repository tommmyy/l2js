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
	var LeafScript;
	ctx.$_step = 0.05;
	LeafScript = (function(_super, ctx) {
		l2js.utils.extend(LeafScript, _super);
		function LeafScript() {
			LeafScript.__super__.constructor.apply(this, arguments);
			this.self = LeafScript;
			var Turtle2D, HTree, Position;
			Turtle2D = new env.Alphabet('Turtle2D', ['F', 'f', 'L', 'R']);
			HTree = (function(_super, ctx) {
				l2js.utils.extend(HTree, _super);
				function HTree() {
					HTree.__super__.constructor.apply(this, arguments);
					this.self = HTree;
					this._init();
				}


				HTree.prototype._init = function() {
					this.ctx.$_R = 0.707;
				}
				HTree.alphabet = Turtle2D;
				HTree.id = 'HTree';
				HTree.prototype.rules = {};
				HTree.prototype.rules['-@1_F'] = [];
				HTree.prototype.rules['h@_PU'] = [];
				HTree.prototype.rules['h@1_F'] = [];
				HTree.prototype.rules['h@1_H'] = [];
				this.ctx.$_angle = 90;
				HTree.prototype.rules['-@1_F'].push({
					probability : 1,
					successor : function(L) {
						return [env.LSystem.getModule('H', [this.ctx.$l], HTree.alphabet)].concat([env.LSystem.getModule('SU', [], HTree.alphabet)], [env.LSystem.getModule('R', [this.ctx.$_angle], HTree.alphabet)], [env.LSystem.getModule('F', [this.ctx.$l * this.ctx.$_R], HTree.alphabet)], [env.LSystem.getModule('SS', [], HTree.alphabet)], [env.LSystem.getModule('SU', [], HTree.alphabet)], [env.LSystem.getModule('L', [this.ctx.$_angle], HTree.alphabet)], [env.LSystem.getModule('F', [this.ctx.$l * this.ctx.$_R], HTree.alphabet)], [env.LSystem.getModule('SS', [], HTree.alphabet)]);
					}
				});
				HTree.prototype.rules['h@_PU'].push({
					probability : 1,
					successor : function() {
						return [env.LSystem.getModule('PU', [funcs.__color(0, 255), 0.01, funcs.__color(255)], HTree.alphabet)].concat();
					}
				});
				HTree.prototype.rules['h@1_F'].push({
					probability : 1,
					successor : function(len) {
						return [env.LSystem.getModule('F', [len, 0.01, funcs.__color(255)], HTree.alphabet)].concat();
					}
				});
				HTree.prototype.rules['h@1_H'].push({
					probability : 1,
					successor : function(len) {
						return [env.LSystem.getModule('F', [len, 0.01, funcs.__color(0, 255)], HTree.alphabet)].concat();
					}
				});
				HTree.prototype.axiom = function() {
					return [env.LSystem.getModule('F', [0.1], HTree.alphabet)].concat();
				};
				HTree.prototype.maxIterations = 3;
				return HTree;
			})(env.LSystem, this.ctx);
			Position = (function(_super, ctx) {
				l2js.utils.extend(Position, _super);
				function Position() {
					Position.__super__.constructor.apply(this, arguments);
					this.self = Position;
					this._init();
				}


				Position.prototype._init = function() {
				}
				Position.alphabet = Turtle2D;
				Position.id = 'Position';
				Position.prototype.rules = {};
				Position.prototype.axiom = function() {
					return [env.LSystem.getModule('R', [90], Position.alphabet)].concat([env.LSystem.getModule('f', [0.5], Position.alphabet)], [env.LSystem.getModule('L', [90], Position.alphabet)], [env.LSystem.getModule('f', [0.5], Position.alphabet)], [env.LSystem.getModule('L', [90], Position.alphabet)], [new env.SubLSystem(this.ctx, HTree).derive()]);
				};
				Position.prototype.maxIterations = 0;
				return Position;
			})(env.LSystem, this.ctx);
			this.main = Position;
		}


		LeafScript.id = 'LeafScript';
		return LeafScript;
	})(env.LScript, ctx);
	return new LeafScript(ctx).derive();
})(l2js); 