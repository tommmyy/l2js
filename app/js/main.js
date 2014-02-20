(function(){
	
	$("#compile").click(compileClick);
	
	function compileClick(e){
		e.preventDefault();
		compile();
	}
	
	function compile() {
		var code = $("#toCompile").val();
		
		t1 = new Date().getTime();
		var promise = l2js.compile(code);
		promise.then(derive, compileError);
		
		
	}
	
	function derive(ast){
		console.log(ast);

//		var derived = lsystem.derive("F(1)", 3);
//		$("#toInterpret").text(derived);
	}
	
	function compileError(error){
		console.error(error);
	}
	
})();