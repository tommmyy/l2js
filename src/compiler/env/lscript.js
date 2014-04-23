'use strict';

window.l2js && window.l2js.utils && window.l2js.compiler && window.l2js.compiler.env && function(l2js) {

	/**
	 * Abstract LScript class.
	 *
	 * @class
	 */
	l2js.compiler.env.LScript = (function() {

		function LScript(ctx) {
			this.ctx = l2js.utils.copy(ctx);
		}

		/**
		 * @memberOf l2js.LScript
		 */
		LScript.prototype.derive = function(axiom, maxIterations) {

			var deferred = l2js.core.q.deferred(), that = this;
			setTimeout(function() {

				try {
					if (l2js.utils.isUndefined(that.main)) {
						throw new Error('LScript (\'' + that.self.id + '\') has no main call.');
					}
					var der = new that.main(that.ctx);
					var o = der.derive(axiom || that.axiom, maxIterations || that.maxIterations);
					deferred.resolve(o);	
				} catch(err) {
					deferred.reject(err);
				}

			}, 0);

			return deferred.promise;

		};

		return LScript;

	})();

}(window.l2js);
