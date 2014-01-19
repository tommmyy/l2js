'use strict';

/**
 * Testing {@link core.Deffered} object
 */
describe('q', function() {
	var q, deferred, promise;

	beforeEach(function() {
		q = l2js.core.q, deferred = q.deferred(), promise = deferred.promise;
	});

	describe('deferred', function() {

		it('should create a new deferred', function() {
			expect(deferred.promise).toBeDefined();
			expect(deferred.resolve).toBeDefined();
			expect(deferred.reject).toBeDefined();
		});

		describe('in promise', function() {
			var flag, expected, result, errorResult;

			beforeEach(function() {
				flag = false, expected = "msg", result = null,
						errorResult = null;

				runs(function() {
					promise.then(function(success) {
						result = success;
					}, function(error) {
						errorResult = error;
					});
				});

			});

			it('resolve callback is called after task is succesfully done',
					function() {
						runs(function() {
							setTimeout(function() {
								flag = true;
								deferred.resolve(expected);
							}, 1000);
						});

						waitsFor(function() {
							return flag;
						}, "Resolve should be called", 1500);

						runs(function() {
							expect(result).toBe(expected);
							expect(errorResult).toBeNull();
						});
					});

			it('reject callback is called after task is rejected',
					function() {
						runs(function() {
							setTimeout(function() {
								flag = true;
								deferred.reject(expected);
							}, 1000);
						});

						waitsFor(function() {
							return flag;
						}, "Reject should be called", 1500);

						runs(function() {
							expect(result).toBeNull();
							expect(errorResult).toBe(expected);
						});
					});

		}); // /callbacks

		describe('in chainnings of promises', function() {
			var flag, result, errorResult;

			beforeEach(function() {
				flag = false, result = null, errorResult = null;
			});

			it('every promise should be called only if previous one in chain is successfully done', function() {
				runs(function() {
					promise.then(function(messageA) {
						return messageA + "B";
					}).then(function(messageB) {
						result = messageB;
					});
					
					setTimeout(function() {
						deferred.resolve("A");
						flag=true;
					}, 1000);
				});

				waitsFor(function() {
					return flag;
				}, "Resolve should be called", 1500);

				runs(function() {
					expect(result).toBe("AB");
				});

			});
			it('every promise should chain reason after reject', function() {
				runs(function() {
					promise.then(function(messageA) {
						return messageA + "B";
					}, function(reason1){
						return reason1 + "2"
					}).then(function(messageB) {
						result = messageB;
					}, function(reason2){
						errorResult = reason2;
					});
					
					setTimeout(function() {
						deferred.reject("1");
						flag=true;
					}, 1000);
				});

				waitsFor(function() {
					return flag;
				}, "Resolve should be called", 1500);

				runs(function() {
					expect(result).toBeNull();
					expect(errorResult).toBe("12");
				});

			});
		}); // /chains

	}); // /deferred
}); // /q
