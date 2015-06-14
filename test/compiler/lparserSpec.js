/**
  Testing {@link l2js.compiler.Lparser} for basic constructs of L2
*/
describe("LParser", function(){
	var Lparser, lnodes;

	beforeEach(function(){
		Lparser = l2js.compiler.Lparser;
		lnodes = l2js.compiler.lnodes;
	});

	describe("parses rules", function(){

		describe("and supports", function(){
			var scriptRuleTypes= '$_step=3;'+
				'lscript CantorSetScript {'+
				'alphabet Alphabet2D {'+
				'	F, f, Go'+
				'};'+
				'lsystem CantorSet(F(1)) using Alphabet2D  {'+
					'f(a) --> f($a/3) f($a/3) f($a/3);'+
					'F(a) --> F($a/3) F($a/3) F($a/3);'+
					'F(a) -h> Go($a);'+
				'};'+
				'main call CantorSet (F($_step), 2);'+
			'};'+
			'derive CantorSetScript;'

			beforeEach(function(){
				ast = Lparser.parse(scriptRuleTypes),
				script = ast.entries[1]; // AST node of script
				lsystem = script.body.entries[1]; // AST node of lsystem
			});

			it("l-system type of rules (-->)", function(){
				var rule1 = lsystem.body.entries[0];
				var rule2 = lsystem.body.entries[1];
				expect(rule1.type).not.toBeDefined();
				expect(rule2.type).not.toBeDefined();
			});

			it("interpretation type of rules (-h>)", function(){
				var rule3 = lsystem.body.entries[2];
				expect(rule3.type).toBe("h");
			});
		});

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
				ast = Lparser.parse(scriptRulesProbabilityFormat);
				script = ast.entries[1]; // AST node of script
				lsystem = script.body.entries[1]; // AST node of lsystem
			});

			it("and supports '|' along with ':'", function(){
				var rule1 = lsystem.body.entries[0];
				expect(rule1.ancestor.params.length).toBe(1);
				expect(rule1.ancestor.symbol.id).toBe('f');

				expect(rule1.successors.length).toBe(2);
				expect(rule1.successors[0].probability).toBe(2);
				expect(rule1.successors[1].probability).toBe(1);

			});


			it("and supports zero probability", function(){
				var rule2 = lsystem.body.entries[1];
				expect(rule2.ancestor.params.length).toBe(1);
				expect(rule2.ancestor.symbol.id).toBe('F');

				expect(rule2.successors.length).toBe(1);
				expect(rule2.successors[0].probability).toBe(0);

			});

			it("and did not require to determine the probability", function(){
				var rule3 = lsystem.body.entries[2];
				expect(rule3.ancestor.params.length).toBe(1);
				expect(rule3.ancestor.symbol.id).toBe('F');

				expect(rule3.successors.length).toBe(1);
				expect(rule3.successors[0].probability).not.toBeDefined();
			});

		});

		var subLSystemsAndCallsScript = '$_step=3;'+
		'$_angle=45;'+
		'lscript flower {'+
			'alphabet Alphabet2D {'+
				'F, f,  A1, A2, A3, A4, B1, B2, B3, B4'+
			'};'+
			'lsystem root(A1, 1) using Alphabet2D  {'+
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

		describe('with sub-L-systems', function(){

			var lsystem;
			beforeEach(function(){
				var ast = Lparser.parse(subLSystemsAndCallsScript);
				var script = ast.entries[2]; // AST node of script
				lsystem = script.body.entries[1]; // AST node of lsystem
			});

			it('with zero number of iterations', function(){

				var rule = lsystem.body.entries[0];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTSubLSystem).toBeTruthy();

				expect(sublsys.axiom).toBeDefined();
				expect(sublsys.axiom.length).toBe(1);

				expect(sublsys.maxIterations.val).toBe(0);

			});

			it('without any parameters', function(){
				var rule = lsystem.body.entries[1];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTSubLSystem).toBeTruthy();

				expect(sublsys.axiom).not.toBeDefined();
				expect(sublsys.maxIterations).not.toBeDefined();
			});

			it('with defined axiom', function(){
				var rule = lsystem.body.entries[2];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTSubLSystem).toBeTruthy();

				expect(sublsys.axiom).toBeDefined();
				expect(sublsys.axiom.length).toBe(1);
				expect(sublsys.maxIterations).not.toBeDefined();
			});

			it('with defined iteration', function(){
				var rule = lsystem.body.entries[3];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTSubLSystem).toBeTruthy();

				expect(sublsys.axiom).not.toBeDefined();
				expect(sublsys.maxIterations.val).toBe(1);
			});
		});

		describe('with calls', function(){

			var lsystem;
			beforeEach(function(){
				var ast = Lparser.parse(subLSystemsAndCallsScript);
				var script = ast.entries[2]; // AST node of script
				lsystem = script.body.entries[1]; // AST node of lsystem
			});

			it('with zero number of iterations', function(){

				var rule = lsystem.body.entries[4];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTCall).toBeTruthy();

				expect(sublsys.axiom).toBeDefined();
				expect(sublsys.axiom.length).toBe(1);

				expect(sublsys.maxIterations.val).toBe(0);

			});

			it('without any parameters', function(){
				var rule = lsystem.body.entries[5];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTCall).toBeTruthy();

				expect(sublsys.axiom).not.toBeDefined();
				expect(sublsys.maxIterations).not.toBeDefined();
			});

			it('with defined axiom', function(){
				var rule = lsystem.body.entries[6];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTCall).toBeTruthy();

				expect(sublsys.axiom).toBeDefined();
				expect(sublsys.axiom.length).toBe(1);
				expect(sublsys.maxIterations).not.toBeDefined();
			});

			it('with defined iteration', function(){
				var rule = lsystem.body.entries[7];
				var sublsys = rule.successors[0].string[1];

				expect(sublsys instanceof lnodes.ASTCall).toBeTruthy();

				expect(sublsys.axiom).not.toBeDefined();
				expect(sublsys.maxIterations.val).toBe(1);
			});
		});

	});
});