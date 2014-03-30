(function(l2js) {
	var ctx = {};
	var flower;
	ctx.$_step = 3;
	ctx.$_angle = 45;
	flower = (function(_super, ctx) {
		l2js.utils.extend(flower, _super);
		function flower() {
			flower.__super__.constructor.apply(this, arguments);
			this.self = flower;
			var Alphabet2D, root, leaf;
			Alphabet2D = new l2js.Alphabet('Alphabet2D', ['F', 'f', 'A1', 'B1', 'B2']);
			root = (function(_super, ctx) {
				l2js.utils.extend(root, _super);
				function root() {
					root.__super__.constructor.apply(this, arguments);
					this.self = root;
				}


				root.alphabet = Alphabet2D;
				root.id = 'root';
				root.prototype.rules = {};
				root.prototype.rules['-@1_A1'] = [];
				root.prototype.rules['-@1_B1'] = [];
				root.prototype.rules['-@1_F'] = [];
				root.prototype.rules['h@1_F'] = [];
				root.prototype.rules['-@1_A1'].push({
					probability : 1,
					successor : function(a) {
						return [l2js.LSystem.getModule('F', [a], root.alphabet)].concat([new l2js.SubLSystem(this.ctx, leaf, [l2js.LSystem.getModule('A1', [a], leaf.alphabet)].concat(), 0).derive()], [l2js.LSystem.getModule('F', [a], root.alphabet)]);
					}
				});
				root.prototype.rules['-@1_B1'].push({
					probability : 1,
					successor : function(a) {
						return [l2js.LSystem.getModule('F', [a], root.alphabet)].concat(new leaf(this.ctx).derive([l2js.LSystem.getModule('A1', [a], leaf.alphabet)].concat(), 0), [l2js.LSystem.getModule('F', [a], root.alphabet)]);
					}
				});
				root.prototype.rules['-@1_F'].push({
					probability : 1,
					successor : function(a) {
						return [l2js.LSystem.getModule('F', [a / 2], root.alphabet)].concat();
					}
				});
				root.prototype.rules['h@1_F'].push({
					probability : 1,
					successor : function(a) {
						return [l2js.LSystem.getModule('F', [a / 2], root.alphabet)].concat();
					}
				});
				root.prototype.axiom = [l2js.LSystem.getModule('B1', [ctx.$_step], root.alphabet)].concat();
				root.prototype.maxIterations = 1;
				return root;
			})(l2js.LSystem, this.ctx);
			leaf = (function(_super, ctx) {
				l2js.utils.extend(leaf, _super);
				function leaf() {
					leaf.__super__.constructor.apply(this, arguments);
					this.self = leaf;
				}


				leaf.alphabet = Alphabet2D;
				leaf.id = 'leaf';
				leaf.prototype.rules = {};
				leaf.prototype.rules['-@1_A1'] = [];
				leaf.prototype.rules['-@1_A1'].push({
					probability : 1,
					successor : function(a) {
						return [l2js.LSystem.getModule('f', [a], leaf.alphabet)].concat([l2js.LSystem.getModule('A1', [a / 2], leaf.alphabet)]);
					}
				});
				leaf.prototype.axiom = [l2js.LSystem.getModule('A1', [ctx.$_step / 2], leaf.alphabet)].concat();
				leaf.prototype.maxIterations = 2;
				return leaf;
			})(l2js.LSystem, this.ctx);
			this.main = root;
			this.maxIterations = 1;
		}


		flower.id = 'flower';
		return flower;
	})(l2js.LScript, ctx);
	return new flower(ctx).derive();
})(l2js); 