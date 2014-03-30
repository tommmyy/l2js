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

				promise.then(function(success) {
					result = success;
					
				}, function(error) {
					errorResult = error;
				});
				
				jasmine.clock().install();
			});
			

			afterEach(function() {
				jasmine.clock().uninstall();
			});

			describe('call', function(){
				it('resolve after task is succesfully done',
					function() {
						setTimeout(function() {
							deferred.resolve(expected);
						}, 100);
					
						jasmine.clock().tick(101);
					
						expect(result).toBe(expected);
						expect(errorResult).toBeNull();
					});

				it('reject after task is succesfully done',
					function() {
						setTimeout(function() {
							deferred.reject(expected);
						}, 100);
						jasmine.clock().tick(101);
						
						expect(result).toBeNull();
						expect(errorResult).toBe(expected);
					});
			});

		}); // /callbacks
		

		describe('in chainnings of promises', function() {
			var flag, result, errorResult;
			describe('every promise', function(){
				beforeEach(function() {
					flag = false, result = null, errorResult = null;
					jasmine.clock().install();
				});
	
				afterEach(function() {
					jasmine.clock().uninstall();
				});
				
				it('should be called only if previous one in chain is successfully done', function() {
					promise.then(function(messageA) {
						return messageA + "B";
					}).then(function(messageB) {
						result = messageB;
					});
					
					setTimeout(function() {
						deferred.resolve("A");
					}, 100);
					
					jasmine.clock().tick(101);
					
					expect(result).toBe("AB");
				});

				it('should chain reason after reject', function() {
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
					}, 100);

					jasmine.clock().tick(101);
					
					expect(result).toBeNull();
					expect(errorResult).toBe("12");
				});
			});
			
		}); // /chains

	}); // /deferred
}); // /q
