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
		var derivation = l2js.derive(js);
		//console.log(derivation)
		l2js.interpretAll(derivation, {
			container: "script_output",
			width: 480,
			height: 320,
			//turtle: {
				//initPosition: [100, 100],
				//initOrientation: 0
			//}
		});
		
//		var derived = lsystem.derive("F(1)", 3);
//		$("#toInterpret").text(derived);
	}
	
	function compileError(error){
		console.error(error);
	}
	
})();