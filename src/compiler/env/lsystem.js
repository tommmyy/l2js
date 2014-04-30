'use strict';

window.l2js && window.l2js.utils && window.l2js.compiler.env.SubLSystem && function(l2js) {

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

}(window.l2js);
