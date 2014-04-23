'use strict';

/** 
 * SubLScript wraps LScript for keeping result of last derivation. 
 * Derivation process can be called individually step by step, derivation by derivation respectively. 
 **/

window.l2js && window.l2js.utils && window.l2js.compiler && window.l2js.compiler.env && function(l2js) {
	
	l2js.compiler.env.SubLScript = (function() {

		function SubLScript(lscript, axiom, maxIterations) {
			this.lscript = lscript; // instance
			this.axiom = axiom;
			this.maxIterations = maxIterations;
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
	
}(window.l2js);