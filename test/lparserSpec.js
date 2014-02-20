/**
  Testing {@link l2js.lparser} for basic constructs of L2
*/

describe("lparser", function(){
	var lparser, lnodes, code;
	
	beforeEach(function(){
		lparser = l2js.lparser; 
		lnodes = l2js.lnodes;
		code = "";
	});
	
	// TODO: test rather compiler results
	describe("parse expressions", function(){
		
		it("with right operator precedence", function(){
			code = "2+3*(4+3);";
			var o = lparser.parse(code);
	
			expect(o).toBeDefined();
			expect(o instanceof lnodes.Block).toBeTruthy();
			expect(o.entries.length).toBe(1);
			
			var op = o.entries[0];
			expect(op instanceof lnodes.Operation).toBeTruthy();
			expect(op.left).toBe(2);
			expect(op.right instanceof lnodes.Operation).toBeTruthy();
			
			
			
		});
	});
});