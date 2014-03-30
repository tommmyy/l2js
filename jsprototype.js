var o = (function() {
	var ctx, Alphabet, Alphabet2D, LScript, LSystem, SubLSystem, Example, LEx2;

	ctx = {};
	ctx.$_Global = 3;

	/** utils */

	function __copy(obj) {
		if (__isUndefined(obj) || typeof obj !== "object") {
			return obj;
		}

		var out = new obj.constructor();

		for (var key in obj) {
			out[key] = __copy(obj[key]);
		}
		return out;
	}

	var __hasProp = {}.hasOwnProperty;

	// coffeescript
	function __extend(child, parent) {
		for (var key in parent) {
			if (__hasProp.call(parent, key))
				child[key] = parent[key];
		}
		function ctor() {
			this.constructor = child;
		}


		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	}

	// prototype
	function __indexOf(arr, item, i) {
		i || ( i = 0);
		var length = arr.length;
		if (i < 0)
			i = length + i;
		for (; i < length; i++)
			if (arr[i] === item)
				return i;
		return -1;
	}

	function __isUndefined(v) {
		return typeof v === 'undefined';
	}

	Alphabet = (function() {
		function Alphabet(name, symbols) {
			this.name = name;
			this.symbols = symbols;
		}


		Alphabet.prototype.hasSymbol = function(symbol) {
			if (!this.symbols && !symbol) {
				return false;
			}
			return (this.symbols && symbol) && __indexOf(this.symbols, symbol) !== -1;
		};

		return Alphabet;
	})();

	Alphabet2D = new Alphabet("Alphabet2D", ["F", "f", "A"]);



	LSystem = (function() {

		function LSystem() {
			this.self = LSystem;
			
			this.ctx = __copy(ctx);
			this.axiom = [];
			this.maxIterations = 1;
			

			this.rules = {
				"-" : {},
				"h" : {}
			};
			this.rulesProbabilities = {
				"-" : {},
				"h" : {}
			};

		}
		
		LSystem.name = "";
		LSystem.alphabet = {};


		LSystem.prototype.addRule = function(symbol, successors, type) {

			__isUndefined(type) && ( type = "-");

			this.checkAlphabetSymbol(symbol.symbol);

			var hash = this.makeHash(symbol);

			var i;
			for ( i = 0; i < successors.length; i++) {
				if (!successors[i].probability) {
					successors[i].probability = 1;
				}

				if (__isUndefined(this.rules[type][hash])) {
					this.rules[type][hash] = [];
					this.rulesProbabilities[type][hash] = 0;
				}

				this.rules[type][hash].push(successors[i]);
				this.rulesProbabilities[type][hash] += successors[i].probability;

			}
		};

		LSystem.prototype.checkAlphabetSymbol = function(symbol) {
			if (!this.self.alphabet.hasSymbol(symbol)) {
				throw Error("Alphabet '" + this.self.alphabet.name + "' (used in '" + this.name + "') does not contain symbol '" + symbol + "'.");
			}
		};

		// derive() derive([]) derive(2) derive([], 2)
		LSystem.prototype.derive = function(axiom, maxIterations) {


			if (arguments.length === 0) {
				axiom = this.axiom;
				maxIterations = this.maxIterations;
			} else if (arguments.length === 1) {
				if ( typeof axiom === "number") {
					maxIterations = arguments[0];
					axiom = this.axiom;
				} else {
					maxIterations = this.maxIterations;
				}
			}

			var out = {
				axiom : axiom,
				derivations : [],
				interpretations : []
			};

			var i, max = maxIterations + 1;
			for ( i = 0; i < max; i++) {

				out.derivation = out.derivation ? this.deriveModule(out.derivation, "-") : axiom;
				out.interpretation = this.deriveModule(out.derivation, "h");

				// add to history
				if (i !== 0) {
					out.derivations.push(__copy(out.derivation));
					out.interpretations.push(__copy(out.interpretation));
				}
			}

			return out;
		};

		LSystem.prototype.deriveModule = function derive(ancestor, type) {
			var successor = [], j;
			for ( j = 0; j < ancestor.length; j++) {

				if (__isUndefined(ancestor[j])) {
					throw Error("Undefined ancestor.");
				}

				// Sub-L-systems should be derived only in main derivation
				if (ancestor[j] instanceof SubLSystem) {
					type === "-" && successor.push(__copy(ancestor[j]).derive()) || successor.push(__copy(ancestor[j]));
				} else {
					var symbol = ancestor[j];
					this.checkAlphabetSymbol(symbol.symbol);
					successor = successor.concat(this.findDerivation(symbol, type));
				}
			}
			return successor;
		};

		LSystem.prototype.findDerivation = function(toDerive, ruleType) {
			var hash = this.makeHash(toDerive);
			if (!__isUndefined(this.rules[ruleType][hash]) && !__isUndefined(this.rulesProbabilities[ruleType][hash])) {

				var threshold = Math.random() * this.rulesProbabilities[ruleType][hash], rules = this.rules[ruleType][hash], i, sum = 0;

				for ( i = 0; i < rules.length; i++) {
					var rule = rules[i];

					sum += rule.probability;
					if (threshold <= sum) {
						
						return rule.successor.apply(this, toDerive.arguments );
					}
				}
				throw Error("No rule founded.");
			} else {
				return [toDerive];
			}
		};

		LSystem.prototype.makeHash = function(module) {
			var args = module.arguments || module.params, hash = "";

			var i;
			for ( i = 0; i < args.length; i++) {
				hash += __isUndefined(args[i]) ? 0 : 1;
			}

			return "@" + hash + "_" + module.symbol;
		};

		LSystem.prototype.getModule = function(symbol, args, alphabet){
			return {
				alphabet : alphabet || this.self.alphabet.name,
				symbol : symbol,
				arguments : args
			};
		};
		
		LSystem.prototype.getParamModule = function(symbol, params, alphabet){
			return {
				alphabet : alphabet || this.self.alphabet.name,
				symbol : symbol,
				params : params
			};
		};

		return LSystem;

	})();

	/** SubSystem calls L-system derivation after steps  */
	SubLSystem = (function() {

		function SubLSystem(lsystem, axiom, maxIterations) {
			this.lsystem = lsystem;
			this.axiom = axiom;
			this.maxIterations = maxIterations || 1;
		}


		SubLSystem.prototype.derive = function() {

			var result;
			if (this.derivation) {
				result = new this.lsystem().derive(this.derivation, this.maxIterations);
			} else {
				result = new this.lsystem().derive(this.axiom, 0);
			}

			this.derivation = result.derivation;
			this.interpretation = result.interpretation;

			return this;

		};

		return SubLSystem;

	})();

	Example = (function(_super) {
		__extend(Example, _super);


		function Example() {

			Example.__super__.constructor.apply(this, arguments);
			this.self = Example;

			this.axiom = [this.getModule("A", [])];

			this.ctx.$A = 2;


			this.addRule(this.getParamModule("A", []), [{
				probability : 1,
				successor : function() {
					var o = [];
					o.push(this.getModule("A", []));
					o.push(this.getModule("A", []));
					
					return o;
				}
			}]);
		}
		
		Example.name = "Example";
		Example.alphabet = Alphabet2D;

		return Example;

	})(LSystem);

	LEx2 = (function(_super) {
		__extend(LEx2, _super);

		function LEx2() {

			LEx2.__super__.constructor.apply(this, arguments);
			
			this.self = LEx2;
			

			this.axiom = [this.getModule("F", [1])];
			this.maxIterations = 2;


			this.ctx.$A = 10;
			this.ctx.$B = 2;

			this.addRule(this.getParamModule("F", ["a"]), [{
				probability : 1,
				successor : function(a) {
					var o = [];
					
					o.push(this.getModule("F", [a+1]));
					o.push(this.getModule("f", []));
					

					// call
					// o = o.concat(new Example().derive([{
					// alphabet : "Alphabet2D",
					// symbol : "A",
					// arguments : []
					// }], this.$B));

					// sublsystem
					o.push(new SubLSystem(Example, [{
						alphabet : Example.alphabet.name,
						symbol : "A",
						arguments : []
					}]).derive());

					return o;
				}
			}]);
		}

		LEx2.alphabet = Alphabet2D;
		LEx2.name = "LEx2";
		
		return LEx2;

	})(LSystem);

	LEx3 = (function(_super) {
		__extend(LEx3, _super);

		function LEx3() {

			LEx3.__super__.constructor.apply(this, arguments);
			this.self = LEx3;
			
			
			this.axiom = [
				this.getModule("F", [1]),
				this.getModule("F", [1, undefined, 10])
			];

			this.maxIterations = 2;

			this.addRule(
				this.getParamModule("F", ["a"]), [{
				probability : 1,
				successor : function( a) {
					var o = [];
					
					o.push(this.getModule("F", [a + 1]));
					
					o.push(this.getModule("f", []));

					return o;
				}
			}]);

			this.addRule(
				this.getParamModule("F", ["a", undefined, "c"]), [{ 
				probability : 1,
				successor : function(a, b, c) {
					var o = [];
					o.push(this.getModule("F", [a + 1, b, c - 1]));

					return o;
				}
			}]);

			this.addRule(this.getParamModule("f", []), [{
				probability : 1,
				successor : function() {
					var o = [];
					o.push(this.getModule("F", [100]));

					return o;
				}
			}], "h");
		}

		LEx3.alphabet = Alphabet2D;
		LEx3.name = "LEx3";

		return LEx3;

	})(LSystem);

	// main call
	return new LEx2().derive();
})();

console.log(o);
