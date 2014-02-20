'use strict';

/**
 * Promise object inspired by {@link http://docs.angularjs.org/api/ng.$q}
 */
window.l2js && window.l2js.core && function(l2js) {

	/** Promise */
	l2js.core.Promise = function Promise(deferred) {
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
	
	
}(window.l2js);