/*!
* L-System to Javascript Library v0.0.1
*
* Copyright 2013, 2013 Tomáš Konrády (tomas.konrady@uhk.cz)
* Released under the MIT license
*
* Date: 2014-01-04T12:24:47.177Z
*/

(function( global, factory ) {'use strict';

        if ( typeof module === "object" && typeof module.exports === "object" ) {
                // For CommonJS and CommonJS-like environments where a proper window is present,
                // execute the factory and get jQuery
                // For environments that do not inherently posses a window with a document
                // (such as Node.js), expose a jQuery-making factory as module.exports
                // This accentuates the need for the creation of a real window
                // e.g. var jQuery = require("jquery")(window);
                // See ticket #14549 for more info
                module.exports = global.document ?
                        factory( global ) :
                        function( w ) {
                                if ( !w.document ) {
                                        throw new Error( "l2js requires a window with a document" );
                                }
                                return factory( w );
                        };
        } else {
                factory( global );
        }

// Pass this, window may not be defined yet
}(this, function( window ) {

var _l2js = window.l2js;
window.l2js = window.l2js || (window.l2js = {});

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */
(function(){

	l2js.core = {
		q : {
			/** Factory for deffered object */
			deferred : function() {
				return new l2js.core.Deferred();
			}
		}
	};
})();

/**
 * Promise object inspired by {@link http://docs.angularjs.org/api/ng.$q}
 */
(function(){


	/** Promise */
	l2js.core.Promise = function(deferred) {
		this.deferred = deferred;
	}
	
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
	}


	l2js.core.Deferred.prototype.reject = function(reason) {
		var chainReason = this.errorCallback(reason);
		if(typeof chainReason !== 'undefined') {
			this.promise.result.reject(chainReason);	
		}
	}

	l2js.core.Deferred.prototype.resolve = function(value) {
		var chainValue = this.successCallback(value);
		if(typeof chainValue !== 'undefined') {
			this.promise.result.resolve(chainValue);	
		}
		
	}
	
	
})();

}));