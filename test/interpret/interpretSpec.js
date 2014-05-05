
function makeSymbol(sym, alp) {
		return {
			symbol : sym,
			alphabet : alp || "Turtle2D"
		};
	}

/**
 * Testing {@link l2js.compiler.Compiler} for basic constructs of L2
 */
describe("Interpret", function() {
	var Interpret, Alphabet;

	beforeEach(function() {
		Interpret = l2js.interpret.Interpret;
		Alphabet = l2js.compiler.env.Alphabet;
		SubLSystem = l2js.compiler.env.SubLSystem;
	});
	
	// fake builder
	
	function Turtle2DBuilder() {
		
	};
	
	Turtle2DBuilder.prototype.interpret= function(symbol, ctx) {
		console.log(symbol);
	};	
	
	l2js.interpret.Turtle2DBuilder = Turtle2DBuilder; 

	
	describe("clear out SubLSystems with unspecified interpretation symbols", function() {
		var result, sub1, sub2, sub3;
		
		beforeEach(function(){
			result = {
				interpretation : []
			};
			
			sub1 = new SubLSystem();
			sub2 = new SubLSystem();
			sub3 = new SubLSystem();
		
			sub1.interpretation = [];
			sub2.interpretation = [makeSymbol("F2")];
		});
		 
		it('and result contains only symbols and SubLSystems with symbols', function(){
			result.interpretation = [sub2];
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(1);
			
			result.interpretation = [sub2, makeSymbol("f")];
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(2);
		});
		
		it("in one level structure", function(){
	
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(0);
			
			result.interpretation = [sub1];
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(0);

			result.interpretation = [sub3];
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(0);
		});
		
		it("in tree structure", function(){
			
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(0);

			sub1.interpretation = [];
			result.interpretation = [sub1];
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(0);
			
			sub1.interpretation = [sub3];
			result.interpretation = [sub1];
			interpret = new Interpret(result);
			expect(interpret.result.interpretation.length).toBe(0);
		
		});
		
	});

	describe("finds if exists next symbol", function() {
		
		
		var result, interpret;
	
		it('without sub-L-systems', function() {
			result = {
				interpretation : [makeSymbol("F1"), makeSymbol("F2")]
			};
			interpret = new Interpret(result);
			expect(interpret.hasNextSymbol()).toBeTruthy();
			interpret.next();
			expect(interpret.hasNextSymbol()).toBeTruthy();
			interpret.next();
			expect(interpret.hasNextSymbol()).not.toBeTruthy();
				
		});
		
		it('with sub-L-systems', function() {
			
			sub1 = new SubLSystem();
			sub1.interpretation = [makeSymbol("F2")];
			sub2 = new SubLSystem();
			sub2.interpretation = [makeSymbol("F3")];
			
			sub1.interpretation = [makeSymbol("F2"), sub2, makeSymbol("F4")];
			result = {
				interpretation : [makeSymbol("F1"), sub1, makeSymbol("F5")]
			};
			interpret = new Interpret(result);
			expect(interpret.hasNextSymbol()).toBeTruthy();
			expect(interpret.next().symbol).toBe("F1");
			expect(interpret.hasNextSymbol()).toBeTruthy();
			expect(interpret.next().symbol).toBe("F2");
			expect(interpret.hasNextSymbol()).toBeTruthy();
			expect(interpret.next().symbol).toBe("F3");
			expect(interpret.hasNextSymbol()).toBeTruthy();
			expect(interpret.next().symbol).toBe("F4");
			expect(interpret.hasNextSymbol()).toBeTruthy();
			expect(interpret.next().symbol).toBe("F5");
			expect(interpret.hasNextSymbol()).not.toBeTruthy();
				
		});
		
		describe('and supports callbacks', function() {
				
			beforeEach(function(){
				sub1 = new SubLSystem();
				sub1.interpretation = [makeSymbol("F2")];
				sub2 = new SubLSystem();
				sub2.interpretation = [makeSymbol("F3")];
				
				sub1.interpretation = [makeSymbol("F2"), sub2, makeSymbol("F4")];
				result = {
					interpretation : [makeSymbol("F1"), sub1, makeSymbol("F5")]
				};
				
			});
			
			it('for the end of interpretation', function(done) {	
				interpret = new Interpret(result, {
					callbacks: {
						end: function() {
							expect(steps).toBe(6);
							done();
						}
					}
				});
				var steps;
				for(steps=1; steps<=6; steps++){
					interpret.next();	
				}					
			});
			
			// TODO: start and end of sublsystem
		});
	});

});