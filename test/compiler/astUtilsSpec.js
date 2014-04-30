/**
 Testing {@link l2js.compiler.ASTUtils}
 */
describe("ASTUtils", function() {
	var astUtils, lnodes = l2js.compiler.lnodes;

	beforeEach(function() {
		astUtils = new l2js.compiler.ASTUtils();
	});

	describe("finds in AST", function() {
		var ast, script;
		beforeEach(function() {

			script = 'alphabet Turtle2D {};' 
			+ 'lscript TestScript {' 
			+ 'lsystem Test(A, 1) using Turtle2D {};' + 'main call Test();' + '};' 
			+ 'lscript TestScript2 {' 
			+ 'lsystem Test(A, 1) using Turtle2D {};' 
			+ 'main call Test();' + '};' 
			+ 'derive TestScript;';

			ast = l2js.compiler.Lparser.parse(script);

		});

		it("findOne", function() {
			var first = astUtils.findOne(function(node) {
				return false;
			}, ast, false);

			expect(first).not.toBeDefined();

			first = astUtils.findOne(function(node) {
				return true;
			}, ast, false);

			expect(first).toBeDefined();
			expect(first.id.id).toBe("Turtle2D");
		});

		it("findAdd", function() {

			
			var all = astUtils.findAll(function(node) {
				return false;
			}, ast, false);

			expect(all).toBeDefined();
			expect(all.length).toBe(0);

			all = astUtils.findAll(function(node) {
				return node instanceof lnodes.ASTLScript;
			}, ast, false);

			expect(all).toBeDefined();
			expect(all.length).toBe(2);
			expect(all[0].id.id).toBe("TestScript");
			expect(all[1].id.id).toBe("TestScript2");
		});

	});
});
