(function(){
	
	$("#compile").click(compileClick);
	
	function compileClick(e){
		e.preventDefault();
		compile();
	}
	
	function compile() {
		var code = $("#toCompile").val();
		
		t1 = new Date().getTime();
		
		l2js.files = {
			"file1.l2": "$GLOBAL1=1;",
			"file2.l2": "$GLOBAL2=2;"
		}
		
		var promise = l2js.compile(code);
		promise.then(compiled, compileError);
		
		
	}
	
	function compiled(js){
		
		console.log(l2js.derive(js));

//		var derived = lsystem.derive("F(1)", 3);
//		$("#toInterpret").text(derived);
	}
	
	function compileError(error){
		console.error(error);
	}
	
})();