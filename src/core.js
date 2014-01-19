'use strict';

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */
window.l2js && function(l2js) {
	l2js.core = {
		q : {
			/** Factory for deffered object */
			deferred : function() {
				return new l2js.core.Deferred();
			}
		}
	};
}(window.l2js);