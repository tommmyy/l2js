/*!
* L-System to Javascript Library v0.1.0
*
* Copyright 2014, 2014 Tomáš Konrády (tomas.konrady@uhk.cz)
* Released under the MIT license
*
* Date: 2014-05-02T18:25:10.099Z
*/

(function( global, factory ) {'use strict';
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory( global, true);
	} else {
		factory( global );
	}
}(this, function( window ) {

var _l2js = l2js;
var l2js = window.l2js = window.l2js || (window.l2js = {});

l2js.options = {keepDerivations: false, maxDerivedSymbols: 5000};
window.l2js.files = {};

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */


	l2js.core = l2js.core  || {};

/**
 * Promise object inspired by {@link http://docs.angularjs.org/api/ng.$q}
 * 
 */
// TODO: chain promises, chain errors



	
	
	/** Promise */
	l2js.core.Promise = function Promise(deferred) {
		this.deferred = deferred;
	};
	
	l2js.core.Promise.prototype.then = function(successCallback, errorCallback) {
		
		this.deferred.successCallback = successCallback;
		this.deferred.errorCallback = errorCallback;
		
		this.result = l2js.core.q.deferred();
		return this.result.promise;
		
	};
	
	l2js.core.Promise.prototype.catch = function(errorCallback) {
		this.deferred.errorCallback = errorCallback;
	};
	
	
	/**
	 * Deffered
	 */
	l2js.core.Deferred = function() {
		this.promise = new l2js.core.Promise(this);
	};


	l2js.core.Deferred.prototype.reject = function(reason) {
		if(this.errorCallback) {
			this.promise.result.reject(this.errorCallback(reason) || reason );	
		}
	};

	l2js.core.Deferred.prototype.resolve = function(value) {
		if(this.successCallback) {
			this.promise.result.resolve(this.successCallback(value) || value);	
		}
		
	};
	
	l2js.core.q = {
		/** Factory for deffered object */
		deferred : function() {
			return new l2js.core.Deferred();
		}
	};

/**
 * Utility methods
 */



	(function() {

		/**
		 * Decimal adjustment of a number.
		 *
		 * @param	{String}	type	The type of adjustment.
		 * @param	{Number}	value	The number.
		 * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
		 * @returns	{Number}			The adjusted value.
		 */
		function decimalAdjust(type, value, exp) {
			// If the exp is undefined or zero...
			if ( typeof exp === 'undefined' || +exp === 0) {
				return Math[type](value);
			}
			value = +value;
			exp = +exp;
			// If the value is not a number or the exp is not an integer...
			if (isNaN(value) || !( typeof exp === 'number' && exp % 1 === 0)) {
				return NaN;
			}
			// Shift
			value = value.toString().split('e');
			value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
			// Shift back
			value = value.toString().split('e');
			return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
		}

		// Decimal round
		if (!Math.round10) {
			Math.round10 = function(value, exp) {
				return decimalAdjust('round', value, exp);
			};
		}
		// Decimal floor
		if (!Math.floor10) {
			Math.floor10 = function(value, exp) {
				return decimalAdjust('floor', value, exp);
			};
		}
		// Decimal ceil
		if (!Math.ceil10) {
			Math.ceil10 = function(value, exp) {
				return decimalAdjust('ceil', value, exp);
			};
		}

	})();

	l2js.utils = {
		copy : function(obj) {
			if (l2js.utils.isUndefined(obj) || typeof obj !== "object" || obj === null) {
				return obj;
			}

			var out = new obj.constructor();

			for (var key in obj) {
				out[key] = l2js.utils.copy(obj[key]);
			}
			return out;
		},

		hasProp : {}.hasOwnProperty,

		// coffeescript
		extend : function(child, parent) {
			for (var key in parent) {
				if (l2js.utils.hasProp.call(parent, key))
					child[key] = parent[key];
			}
			function ctor() {
				this.constructor = child;
			}


			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		},

		// prototype
		indexOf : function(arr, item, i) {
			i || ( i = 0);
			var length = arr.length;
			if (i < 0)
				i = length + i;
			for (; i < length; i++)
				if (arr[i] === item)
					return i;
			return -1;
		},

		isUndefined : function(v) {
			return typeof v === 'undefined';
		},
		isFunction : function(functionToCheck) {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		},
		toUpperFirstLetter : function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		/**
		 * http://xazure.net/2011/06/tips-snippets/javascript/padding-string-in-javascript/
		 * @param str - The string to pad.
		 * @param padChar - The character to pad the string with.
		 * @param length - The length of the resulting string.
		 *
		 * @return The padded string.
		 */
		padLeft : function(str, padChar, length) {

			while (str.length < length)
			str = padChar + str;
			return str;
		},
		normalizeAngle: function(angle) {
			var interval = angle % 360;
			return angle < 0 ? 360 + interval : interval;
		},
		HSVToRGB: function(color) {
			var h = l2js.utils.normalizeAngle(color.h);
			var s = color.s < 0 ? 0 : (color.s > 1 ? 1 : color.s);
			var v = color.v < 0 ? 0 : (color.v > 1 ? 1 : color.v);

			var C = v * s;
			var X = C * (1 - Math.abs((h / 60) % 2 - 1));
			var m = v - C;

			var rgb_;
			if (h < 60) {
				rgb_ = [C, X, 0];
			} else if (60 <= h < 120) {
				rgb_ = [X, C, 0];
			} else if (120 <= h < 180) {
				rgb_ = [0, C, X];
			} else if (180 <= h < 240) {
				rgb_ = [0, X, C];
			} else if (240 <= h < 300) {
				rgb_ = [X, 0, C];
			} else if (300 <= h <= 360) {
				rgb_ = [C, 0, X];
			}

			var r = (rgb_[0] + m) * 255;
			var g = (rgb_[1] + m) * 255;
			var b = (rgb_[2] + m) * 255;
			
			return {model: "rgb", r: r, g: g, b: b, a:color.a};
		},
		RGBToInt : function(color) {
			
			function norm(c) {
				return c;
				return (!c||c<0)?0:((c>255)?255:c);
			}
			var rgba = norm(color.r) || 0;
			rgba = rgba << 8;
			rgba |= norm(color.g);
			rgba = rgba << 8;
			rgba |= norm(color.b);
			rgba = rgba << 8;
			rgba |= norm(color.a);
			rgba = rgba >>> 0;
			
			return rgba / 4294967295;
		},
		colorToHexString:function(colorInt) {
			function hexStringToInt(str) {
				return parseInt(str, 16);
			};
			var hexStrAlpha = l2js.utils.padLeft(Math.round(4294967295 * colorInt).toString(16), 0, 8); 
			return {
				hex : '#' + hexStrAlpha.substring(0, 6),		
				r : hexStringToInt(hexStrAlpha.substring(0, 2)),
				g : hexStringToInt(hexStrAlpha.substring(2, 4)),
				b : hexStringToInt(hexStrAlpha.substring(4, 6)),
				a : hexStringToInt(hexStrAlpha.substring(6, 8))/256
			};
		}

	};

l2js.compiler = l2js.compiler || {};

l2js.compiler.env = l2js.compiler.env || {};

/**
	 * Alphabet determines what symbols are used by a L-system.
	 *
	 * @class
	 */
	l2js.compiler.env.Alphabet = (function() {
		function Alphabet(id, symbols) {
			this.id = id;
			this.symbols = symbols;
			this.type = "alphabet";
		}

		/**
		 * @memberOf l2js.Alphabet
		 */
		Alphabet.prototype.hasSymbol = function(symbol) {
			if (!this.symbols && !symbol) {
				return false;
			}
			return (this.symbols && symbol) && l2js.utils.indexOf(this.symbols, symbol) !== -1;
		};

		return Alphabet;
	})();

/**
 * SubLSystem wraps LSystem for keeping result of last derivation.
 * Derivation process can be called individually step by step, derivation by derivation respectively.
 **/




	l2js.compiler.env.SubLSystem = (function() {

		/**
		 * @param ctx context for variables
		 * @param lsystem Prototype of lsystem for wrapping
		 * @param axiom
		 * @param maxIterations
		 */
		function SubLSystem(ctx, lsystem, axiom, maxIterations) {
			this.ctx = ctx;
			this.lsystem = lsystem;

			if ( typeof axiom === "number") {
				maxIteration = axiom;
				axiom = undefined;
			}

			this.axiom = axiom;
			this.maxIterations = maxIterations;
			this.type = "sublsystem";
		}


		SubLSystem.prototype.derive = function() {

			var result;
			if (!this.lsystemInst) {
				this.lsystemInst = new this.lsystem(this.ctx);
			}
			if (this.derivation) {
				result = this.lsystemInst.derive(this.derivation, this.maxIterations);
			} else {
				result = this.lsystemInst.derive(this.axiom, this.maxIterations);
				this.axiom = result.axiom;
				// axiom used in the first iteration
			}

			this.derivation = result.derivation;
			this.interpretation = result.interpretation;

			return this;

		};

		return SubLSystem;

	})();

l2js.compiler.env.Stack = (function() {

		function Stack(start, end, string) {
			this.start = start;
			this.end = end;
			this.string = string;
			this.type = "stack";

		}

		return Stack;

	})();

/**
	 * Abstract LSystem class.
	 *
	 * @class
	 */
	l2js.compiler.env.LSystem = (function(l2js) {

		function LSystem(ctx, opts) {
			this.ctx = ctx ? l2js.utils.copy(ctx) : {};
			this.rulesProbabilities = {};
			this.type = "lsystem";
		}

		/*
		LSystem.prototype.axiom = [];
		LSystem.prototype.maxIterations = 1;
		LSystem.prototype.self = LSystem;
		*/

		/**
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.prototype.checkAlphabetSymbol = function(symbol) {
			//			if (!this.self.alphabet.hasSymbol(symbol)) {
			//				throw Error("Alphabet '" + this.self.alphabet.name + "' (used in '" + this.name + "') does not contain symbol '" + symbol + "'.");
			//			}
		};

		// derive() derive([]) derive(2) derive([], 2)
		/**
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.prototype.derive = function(axiom, maxIterations) {
			if (arguments.length === 0) {
				axiom = this.axiom();
				maxIterations = this.maxIterations;
			} else if (arguments.length === 1) {
				if ( typeof axiom === "number") {
					maxIterations = arguments[0];
					axiom = this.axiom();
				} else {
					maxIterations = this.maxIterations;
				}
			} else if (arguments.length === 2) {
				axiom = axiom || this.axiom();
				maxIterations = l2js.utils.isUndefined(maxIterations) ? this.maxIterations : maxIterations;
			}

			var i, max = maxIterations + 1, // + axiom
			out = {
				axiom : axiom,
				totalIterations : maxIterations,
				derivations : [],
				interpretations : []
			};
			for ( i = 0; i < max; i++) {

				out.derivation = out.derivation ? this.deriveString(out.derivation, "-") : axiom;
				out.interpretation = this.deriveString(out.derivation, "h");

				// add to history
				if (l2js.options.keepDerivations) {
					out.derivations.push(l2js.utils.copy(out.derivation));
					out.interpretations.push(l2js.utils.copy(out.interpretation));
				}
			}

			return out;
		};

		/**
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.prototype.deriveString = function(ancestor, type) {
			var successor = [], j;
			for ( j = 0; j < ancestor.length; j++) {

				if (l2js.utils.isUndefined(ancestor[j])) {
					throw Error("Undefined ancestor.");
				}
				
				this.ctx.stats.numberOfDerivedSymbols++;
				if(this.ctx.stats.numberOfDerivedSymbols > l2js.options.maxDerivedSymbols) {
					throw new Error("Reached the limit of maximum derived symbols per derivation of script.");
				}
				
				// Sub-L-systems should be derived only in main derivation
				if (ancestor[j] instanceof l2js.compiler.env.SubLSystem) {
					type === "-" && successor.push(l2js.utils.copy(ancestor[j]).derive()) || successor.push(l2js.utils.copy(ancestor[j]));
				} else if (ancestor[j] instanceof l2js.compiler.env.Stack) {
					successor.push(new l2js.compiler.env.Stack(ancestor[j].start, ancestor[j].end, this.deriveString(ancestor[j].string, type)));
				} else {
					var symbol = ancestor[j];
					this.checkAlphabetSymbol(symbol.symbol);
					successor = successor.concat(this.findDerivation(symbol, type));
				}
			}
			return successor;
		};

		/**
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.prototype.findDerivation = function(toDerive, ruleType) {
			var hash = LSystem.makeHash(toDerive, ruleType);

			if (!l2js.utils.isUndefined(this.rules[hash])) {
				var rules = this.rules[hash];

				if (l2js.utils.isUndefined(this.rulesProbabilities[hash])) {
					this.rulesProbabilities[hash] = 0;
					for ( i = 0; i < rules.length; i++) {
						var rule = rules[i];
						this.rulesProbabilities[hash] += rule.probability;
					}
				}
				if (this.rulesProbabilities[hash] !== 0) {
					var threshold = Math.random() * this.rulesProbabilities[hash], i, sum = 0;

					for ( i = 0; i < rules.length; i++) {
						var rule = rules[i];

						sum += rule.probability;
						if (threshold <= sum) {
							return rule.successor.apply(this, toDerive.arguments);
						}
					}

				}

			}
			return [toDerive];
			//identity
		};

		/** Static */

		/**
		 * Creates hash of the module.
		 *
		 * @param {object} module - Module for which hash is returned
		 * @param {string} ruleType - Either '-' or 'h', default is '-'
		 *
		 * @returns {string} Hash of the module
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.makeHash = function(module, ruleType) {
			var args = module.arguments || module.params || [], hash = "";
			l2js.utils.isUndefined(ruleType) && ( ruleType = '-');

			var i;
			for ( i = 0; i < args.length; i++) {
				hash += l2js.utils.isUndefined(args[i]) ? 0 : 1;
			}

			return ruleType + "@" + hash + "_" + module.symbol;
		};

		/**
		 * Factory method for the instance of the module
		 *
		 * @param {string} symbol - Symbol of the alphabet
		 * @param {array} args - Array of the arguments for the module
		 * @param {string} alphabet - Name of the alphabet for the symbol
		 *
		 * @returns {object} Instance of the module
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.getModule = function(symbol, args, alphabet) {
			return {
				alphabet : alphabet,
				symbol : symbol,
				arguments : args
			};
		};

		/**
		 * Factory method for the declaration of the module
		 *
		 * @param {string} symbol - Symbol of alphabet
		 * @param {array} params - Array of names of the parameters for the module
		 * @param {string} alphabet - Name of the alphabet for the symbol
		 *
		 * @returns {object} Declaration of the module
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.getParamModule = function(symbol, params, alphabet) {
			return {
				alphabet : alphabet,
				symbol : symbol,
				params : params
			};
		};

		LSystem.id = "";
		LSystem.alphabet = {};

		return LSystem;

	})(l2js);

/**
	 * Abstract LScript class.
	 *
	 * @class
	 */
	l2js.compiler.env.LScript = (function() {

		function LScript(ctx) {
			this.ctx = l2js.utils.copy(ctx);
			this.type = "lscript";
		}

		/**
		 * @memberOf l2js.LScript
		 */
		LScript.prototype.derive = function(axiom, maxIterations) {
			this.ctx.stats.numberOfDerivedSymbols = 0;
			var der = new this.main(this.ctx);
			return der.derive(axiom || this.axiom, maxIterations || this.maxIterations);

		};

		return LScript;

	})();

/**
 * SubLScript wraps LScript for keeping result of last derivation.
 * Derivation process can be called individually step by step, derivation by derivation respectively.
 **/




	l2js.compiler.env.SubLScript = (function() {

		function SubLScript(lscript, axiom, maxIterations) {
			this.lscript = lscript;
			this.axiom = axiom;
			this.maxIterations = maxIterations;
			this.type = "sublscript";
		}

		SubLScript.prototype.derive = function() {

			var deferred = l2js.core.q.deferred();
			setTimeout(function() {
				try {
					var out = eval(lsystemCode);
					deferred.resolve(out);
				} catch(err) {
					deferred.reject(err);
				}

			}, 0);

			return deferred.promise;

			var result;
			if (this.derivation) {
				result = this.lscript.derive(this.derivation, this.maxIterations);
			} else {
				result = this.lscript.derive(this.axiom, this.maxIterations);
				this.axiom = result.axiom;
			}

			this.derivation = result.derivation;
			this.interpretation = result.interpretation;

			return this;
		};

		return SubLScript;

	})();

l2js.compile = function(code) {
		return new l2js.compiler.Compiler().compile(code);
	};

	l2js.derive = function(lsystemCode) {
		//console.log(lsystemCode);
		//var t1 = new Date().getTime();
		var out = eval(lsystemCode);
		//console.log((new Date().getTime() - t1)/1000);
		return out;

	};

	l2js.interpretAll = function(symbols, options) {

		//var t1 = new Date().getTime();
		new l2js.interpret.Interpret(symbols, options).all();
		//console.log((new Date().getTime() - t1) / 1000);
	};

	l2js.format = function(lsystemCode) {
		var deferred = l2js.core.q.deferred();
		setTimeout(function() {
			var errHandler = function(err) {
				deferred.reject(err);
			};
			try {
				var compiler = new l2js.compiler.Compiler();

				var ast = compiler.toAST(lsystemCode);
				var l2 = compiler.ASTToL2(ast);
				deferred.resolve(l2);
			} catch(e) {
				errHandler(e);
			}

		}, 0);

		return deferred.promise;
	};

	l2js.evolve = function(numberOfIndividuals, scripts, lscript, lsystems) {

		var compiler = new l2js.compiler.Compiler();
		var asts = [];
		for (var i = 0; i < scripts.length; i++) {
			if(typeof scripts[i] === "string") {
				scripts[i] = {code: scripts[i]};
			}
			var ast = compiler.toAST(scripts[i].code);
			asts.push({
				evaluation : scripts[i].evaluation || 0,
				ast : ast
			});
		}

		return new l2js.evolver.Evolver(asts, {
			numberOfIndividuals : numberOfIndividuals,
			lsystems: lsystems,
			lscript: lscript
		});
	};



}));