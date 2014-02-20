'use strict';

window.l2js && window.l2js.utils && function(l2js) {

	/**
	 * LSystem class.
	 * 
	 * @class
	 */
	l2js.LSystem = (function() {

		function LSystem(ctx) {
			this.ctx = l2js.utils.copy(ctx);
		}
		
		LSystem.prototype.axiom = [];
		LSystem.prototype.maxIterations = 1;
		LSystem.prototype.self = LSystem;
		
		LSystem.prototype.rules = {
				"-" : {},
				"h" : {}
			};
		
		LSystem.prototype.rulesProbabilities = {
			"-" : {},
			"h" : {}
		};
		
		
		/**
		 * @memberOf l2js.LSystem
		 */
		LSystem.prototype.addRule = function(symbol, successors, type) {

			l2js.utils.isUndefined(type) && ( type = "-");

			this.checkAlphabetSymbol(symbol.symbol);

			var hash = this.makeHash(symbol);

			var i;
			for ( i = 0; i < successors.length; i++) {
				if (!successors[i].probability) {
					successors[i].probability = 1;
				}

				if (l2js.utils.isUndefined(this.rules[type][hash])) {
					this.rules[type][hash] = [];
					this.rulesProbabilities[type][hash] = 0;
				}

				this.rules[type][hash].push(successors[i]);
				this.rulesProbabilities[type][hash] += successors[i].probability;

			}
		};
		
		/**
		 * @memberOf l2js.LSystem
		 */
		LSystem.prototype.checkAlphabetSymbol = function(symbol) {
			if (!this.alphabet.hasSymbol(symbol)) {
				throw Error("Alphabet '" + this.self.alphabet.name + "' (used in '" + this.name + "') does not contain symbol '" + symbol + "'.");
			}
		};

		// derive() derive([]) derive(2) derive([], 2)
		/**
		  * @memberOf l2js.LSystem
		  */
		LSystem.prototype.derive = function(axiom, maxIterations) {
			var out = {
				axiom : axiom,
				derivations : [],
				interpretations : []
			};

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

			var i, max = maxIterations + 1;
			for ( i = 0; i < max; i++) {

				out.derivation = out.derivation ? this.deriveModule(out.derivation, "-") : axiom;
				out.interpretation = this.deriveModule(out.derivation, "h");

				// add to history
				if (i !== 0) {
					out.derivations.push(l2js.utils.copy(out.derivation));
					out.interpretations.push(l2js.utils.copy(out.interpretation));
				}
			}

			return out;
		};
		
		/**
		  * @memberOf l2js.LSystem
		  */
		LSystem.prototype.deriveModule = function derive(ancestor, type) {
			var successor = [], j;
			for ( j = 0; j < ancestor.length; j++) {

				if (l2js.utils.isUndefined(ancestor[j])) {
					throw Error("Undefined ancestor.");
				}

				// Sub-L-systems should be derived only in main derivation
				if (ancestor[j] instanceof SubLSystem) {
					type === "-" && successor.push(l2js.utils.copy(ancestor[j]).derive()) || successor.push(l2js.utils.copy(ancestor[j]));
				} else {
					var symbol = ancestor[j];
					this.checkAlphabetSymbol(symbol.symbol);
					successor = successor.concat(this.findDerivation(symbol, type));
				}
			}
			return successor;
		};
		
		/**
		  * @memberOf l2js.LSystem
		  */
		LSystem.prototype.findDerivation = function(toDerive, ruleType) {
			var hash = this.makeHash(toDerive);
			if (!l2js.utils.isUndefined(this.rules[ruleType][hash]) && !l2js.utils.isUndefined(this.rulesProbabilities[ruleType][hash])) {

				var threshold = Math.random() * this.rulesProbabilities[ruleType][hash], rules = this.rules[ruleType][hash], i, sum = 0;

				for ( i = 0; i < rules.length; i++) {
					var rule = rules[i];

					sum += rule.probability;
					if (threshold <= sum) {
						return rule.successor.apply(this, toDerive.arguments);
					}
				}
				throw Error("No rule founded.");
			} else {
				return [toDerive];
			}
		};

		/**
		 * Creates hash of the module.
		 * 
		 * @param {object} module - Module for which hash is returned
		 * 
		 * @returns {string} Hash of the module
		 * @memberOf l2js.LSystem
		 */
		LSystem.prototype.makeHash = function(module) {
			var args = module.arguments || module.params, hash = "";

			var i;
			for ( i = 0; i < args.length; i++) {
				hash += l2js.utils.isUndefined(args[i]) ? 0 : 1;
			}

			return "@" + hash + "_" + module.symbol;
		};
		
		/** Static */
		
		/**
		 * Factory method for the instance of the module
		 * 
		 * @param {string} symbol - Symbol of the alphabet
		 * @param {array} args - Array of the arguments for the module
		 * @param {string} alphabet - Name of the alphabet for the symbol 
		 * 
		 * @returns {object} Instance of the module 
		 * @memberOf l2js.LSystem
		 */
		LSystem.getModule = function(symbol, args, alphabet){
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
		 * @memberOf l2js.LSystem
		 */
		LSystem.getParamModule = function(symbol, params, alphabet){
			return {
				alphabet : alphabet,
				symbol : symbol,
				params : params
			};
		};

		LSystem.id = "";
		LSystem.alphabet = {};
		
		return LSystem;

	})();
	

	
}(window.l2js);