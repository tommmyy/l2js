/**
  Testing {@link l2js.lparser} for basic constructs of L2
*/
describe("LParser", function(){
	var lparser, lnodes, code;
	
	beforeEach(function(){
		lparser = l2js.lparser; 
		lnodes = l2js.lnodes;
		code = "";
	});
	
	describe("parses rules", function(){

		describe("with defined probability", function(){
			var scriptRulesProbabilityFormat = 
				'$_step=3;'+
				'lscript CantorSetScript {'+
				'alphabet Alphabet2D {'+
				'	F, f, A, N'+
				'};'+
				'lsystem CantorSet(F(1)) using Alphabet2D  {'+
					'f(a) --> f($a/3) f($a/3) f($a/3) : 2'+
							'| A($a) : 1;'+
					'F(a) --> N : 0;'+
					'F(a) --> F($a/3) f($a/3) F($a/3);'+
				'};'+
				'main call CantorSet (F($_step), 2);'+
			'};'+
			'derive CantorSetScript;', ast, script, lsystem;
			
			beforeEach(function(){
			
				ast = (new l2js.compiler.Compiler()).toAST(scriptRulesProbabilityFormat);
				script = ast.entries[1]; // AST node of script
				lsystem = script.body.entries[1]; // AST node of lsystem
			});
			
			it("and supports different formats", function(){
				
				var rule1 = lsystem.body.entries[0];
				expect(rule1.ancestor.params.length).toBe(1);
				expect(rule1.ancestor.symbol.id).toBe('f');
				
				expect(rule1.successors.length).toBe(2);
				expect(rule1.successors[0].probability).toBe(2);
				expect(rule1.successors[1].probability).toBe(1);
				
				var rule2 = lsystem.body.entries[1];
				expect(rule2.ancestor.params.length).toBe(1);
				expect(rule2.ancestor.symbol.id).toBe('F');
				
				expect(rule2.successors.length).toBe(1);
				expect(rule2.successors[0].probability).toBe(0);
				
				var rule3 = lsystem.body.entries[2];
				expect(rule3.ancestor.params.length).toBe(1);
				expect(rule3.ancestor.symbol.id).toBe('F');
				
				expect(rule3.successors.length).toBe(1);
				expect(rule3.successors[0].probability).not.toBeDefined();
			});
		
		});
	});
});