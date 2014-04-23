'use strict';

/**
 * Interpret of the symbols of L-system. Used Builder design pattern.
 *
 * @class
 */

window.l2js && window.l2js.utils && window.l2js.interpret && window.l2js.interpret.Turtle2DBuilder && window.l2js.compiler && window.l2js.compiler.env && window.l2js.compiler.env.SubLSystem && function(l2js) {

	l2js.interpret.Interpret = (function(l2js) {

		Interpret.options = {
			callbacks : {
				// end of interpretation
				end : function() {

				},
				// start reading symbols generated in next sublsystem
				newLSystem : function(lsys) {

				},
				// end reading symbols in sublsystem
				endOfLSystem : function(lsys) {

				}
			}
		};

		function Interpret(result, options) {
			this.result = this._clearOutEmptyLSystems(this._serializeBuffers(l2js.utils.copy(result)));
			this.options = options && l2js.utils.extend(l2js.utils.copy(Interpret.options), options) || Interpret.options;
			this.ctx = {};
		};

		/**
		 * Factory method for builder
		 * @param {object} symbol Symbol that shoud be interpreted by the right builder
		 * @return Implementation of Builder according Alphabet including 'symbol'
		 */
		Interpret.prototype.getBuilder = function(symbol) {
			switch(symbol.alphabet.id) {
				case "Turtle2D":
					this._turtle2dBuilder || (this._turtle2dBuilder = new l2js.interpret.Turtle2DBuilder(this.options), this.ctx);
					return this._turtle2dBuilder;
			}
			throw new Error("Unsupported alphabet: '" + symbol.alphabet.id + "'");
		};

		/**
		 * Interpret next symbol
		 */
		Interpret.prototype.next = function() {
			var symbol = this.getNextSymbol();
			if (symbol) {
				//console.log(symbol)
				this.getBuilder(symbol).interpret(symbol, this.ctx);
			}
			return symbol;
		};

		/**
		 * Interpret all the symbols
		 */
		Interpret.prototype.all = function() {
			while (this.hasNextSymbol()) {
				this.next();
			}
		};

		Interpret.prototype.hasNextSymbol = function() {
			if (!this._lSysBuf) {
				return !!(this.result && this.result.interpretation.length);
			}

			var bufLevel = 0;
			while (this._lSysBuf[bufLevel] && l2js.utils.isUndefined(this._lSysBuf[bufLevel].interpretation[this._indexBuf[bufLevel] + 1])) {
				bufLevel++;
			};
			return !!this._lSysBuf[bufLevel];
		};

		Interpret.prototype.getNextSymbol = function() {
			this._setupBuffers();

			var symbol, readIndex, result;

			readIndex = this._indexBuf.length === 0 ? 0 : ++this._indexBuf[0];
			result = this._lSysBuf.length === 0 ? this.result : this._lSysBuf[0];

			// Set position of previous symbol if we are at the end of l-system buffer (if exists)
			// Also skip empty sublsystems
			while (result && l2js.utils.isUndefined(result.interpretation[readIndex])) {
				this._lSysBuf.shift();
				this._indexBuf.shift();
				this._trigger('endOfLSystem', result);

				result = this._lSysBuf[0];
				readIndex = ++this._indexBuf[0];
			}

			// Next symbol does not exists
			if (!result) {
				this._trigger('end');
				this._clearBuffers();
				return;
			}

			symbol = result.interpretation[readIndex];
			this._indexBuf[0] = readIndex;
			this._lSysBuf[0] = result;

			while ( symbol instanceof l2js.compiler.env.SubLSystem) {
				this._trigger('newLSystem', symbol);
				this._indexBuf.unshift(0);
				this._lSysBuf.unshift(symbol);
				symbol = symbol.interpretation[0];
				
			}
			return symbol;
		};

		Interpret.prototype._trigger = function(event) {
			var args = Array.prototype.slice.call(arguments, 1);
			this.options.callbacks[event] && this.options.callbacks[event].apply(args);
		};

		Interpret.prototype._setupBuffers = function() {
			// Buffer of symbol of the result of currently read l-system
			this._lSysBuf = this._lSysBuf || [];

			// Buffer of curent position in the lSysBuf
			this._indexBuf = this._indexBuf || [];
		};

		Interpret.prototype._clearBuffers = function() {
			this._lSysBuf = null;
			this._indexBuf = null;
		};

		Interpret.prototype._clearOutEmptyLSystems = function(result) {
			if (result.interpretation) {
				var dels = [];
				for (var i = 0; i < result.interpretation.length; i++) {
					if (result.interpretation[i] instanceof l2js.compiler.env.SubLSystem) {
						result.interpretation[i] = this._clearOutEmptyLSystems(result.interpretation[i]);
						if (!result.interpretation[i].interpretation || result.interpretation[i].interpretation.length === 0) {
							dels.push(i);
						}
					}
				}
				for (var i = dels.length - 1; i >= 0; i--) {
					result.interpretation.splice(dels[i], 1);
				}
			}
			return result;

		};

		Interpret.prototype._serializeBuffers = function(result) {

			if (result.interpretation) {
				var dels = [];
				for (var i = 0; i < result.interpretation.length; i++) {
					if (result.interpretation[i] instanceof l2js.compiler.env.SubLSystem) {
						result.interpretation[i] = this._serializeBuffers(result.interpretation[i]);
					}
					
					
					if (result.interpretation[i] instanceof l2js.compiler.env.Stack) {
						
						var stack = result.interpretation.splice(i, 1)[0];
						result.interpretation.splice(i, 0, stack.start);
						for (var j = 0; j < stack.string.length; j++) {
							result.interpretation.splice(1 + i + j, 0, stack.string[j]);
						}
						result.interpretation.splice(1 + i + j, 0, stack.end);	
						
					}

				}
				

			}
			return result;
		};

		return Interpret;
	})(l2js);

}(window.l2js);
