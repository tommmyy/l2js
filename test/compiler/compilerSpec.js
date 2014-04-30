/**
  Testing {@link l2js.compiler.Compiler} for basic constructs of L2
*/
describe("Compiler", function(){
	var Compiler;
	
	beforeEach(function(){
		Compiler = l2js.compiler.Compiler; 
	});
	
	describe("supports parallel compilations", function(){

		
	});
	
	describe("compiles valid non-empty L2 script to JS code", function(){
		
		var cantorSetScript= '$_step=3;'+
			'lscript CantorSetScript {'+
			'alphabet Alphabet2D {'+
			'	F, f, Forward'+
			'};'+
			'lsystem CantorSet(F(1), 1) using Alphabet2D  {'+
				'f(a) --> f($a/3) f($a/3) f($a/3);'+
				'F(a) --> F($a/3) F($a/3) F($a/3);'+
				'F(a) -h> Forward($a);'+
			'};'+
			'main call CantorSet (F($_step), 1);'+
		'};'+
		'derive CantorSetScript;';
		
		var code;
		beforeEach(function(cantorSetScriptDone){
			var promise = new Compiler().compile(cantorSetScript);
			promise.then(function(result){
				code = result;
				cantorSetScriptDone();
			}, function(){
				cantorSetScriptDone();
			});
		});
		
		it('that is not empty', function(cantorSetScriptDone){
			expect(code).toBeTruthy();
			cantorSetScriptDone();
		});
		
		it('that is executable', function(cantorSetScriptDone){
			expect(function() {eval(code);}).not.toThrow();
			cantorSetScriptDone();
		});
		
		it('that is executable and returns derivation of lscript', function(cantorSetScriptDone){debugger
			var derivation = eval(code);
			expect(derivation).toBeTruthy();
			cantorSetScriptDone();
		});
	});
	
	
	describe("compiles rules", function(){
	
		var sublsystemAndCallScriptTemplate = '$_step=3;'+
		'$_angle=45;'+
		'lscript flower {'+
			'alphabet Alphabet2D {'+
				'F, f,  A1, A2, A3, A4, B1, B2, B3, B4'+
			'};'+
			'lsystem root({{AXIOM}}, 1) using Alphabet2D  {'+
				'A1(a) --> F($a) sublsystem leaf(A1($a), 0) F($a);'+
				'A2(a) --> F($a) sublsystem leaf() F($a);'+
				'A3(a) --> F($a) sublsystem leaf(A1($a)) F($a);'+
				'A4(a) --> F($a) sublsystem leaf(, 1) F($a);'+
				'B1(a) --> F($a) call leaf(A1($a), 0) F($a);'+
				'B1(a) --> F($a) call leaf() F($a);'+
				'B1(a) --> F($a) call leaf(A1($a)) F($a);'+
				'B1(a) --> F($a) call leaf(, 1) F($a);'+
				'F(a)-->F($a/2);'+
			'};'+
			'lsystem leaf(A1($_step/2), 2) using Alphabet2D {'+
				'A1(a) --> f($a) A1($a/2); '+
			'};'+
			'main call root(, 1); '+
		'};'+
		'derive flower;';


		describe("with sub-L-Systems", function(){
			var scriptA1 = sublsystemAndCallScriptTemplate.replace('{{AXIOM}}', 'A1($_step)');
			
			beforeEach(function(){
				
			});
			
			it("with zero iterations ", function(){
				// so it returns axiom
				
				
			});
			
		});
		
		describe("parses with calls", function(){

			
		});
	});
	
	
});