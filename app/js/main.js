(function(){
	console.debug("Hello l2js")
	console.debug(l2js);
	
	console.log(l2js.lparser.parse('2+2'));
	
	$("#compile").click(compile);
	
	function compileClick(e){
		e.preventDefault();
		compile();
	}
	
	function compile() {
		var code = $("#toCompile").text();
		
		var promise = l2js.compile(code);
		promise.then(derive, compileError);
		
		
	}
	
	function derive(lsystem){
		console.log(lsystem);
		var derived = lsystem.derive("F(1)", 3);
		$("#toInterpret").text(derived);
	}
	
	function compileError(error){
		console.error(error);
	}
	
})();