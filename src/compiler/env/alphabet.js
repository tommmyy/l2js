'use strict';


window.l2js && window.l2js.utils && window.l2js.compiler && window.l2js.compiler.env && function(l2js) {
	
	/**
	 * Alphabet determines what symbols are used by a L-system.
	 * 
	 * @class
	 */
	l2js.compiler.env.Alphabet = (function() {
		function Alphabet(id, symbols) {
			this.id = id;
			this.symbols = symbols;
		}

		/**
		 * @memberOf l2js.Alphabet
		 */
		Alphabet.prototype.hasSymbol = function(symbol) {
			if (!this.symbols && !symbol) {
				return false;
			}
			return (this.symbols && symbol)
					&& l2js.utils.indexOf(this.symbols, symbol) !== -1;
		};

		return Alphabet;
	})();
	
}(window.l2js);