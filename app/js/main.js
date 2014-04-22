(function() {

		l2js.files = {
			"file1.l2" : "include \"file2.l2\";",
			"file2.l2" : "$_angle = 10;"
		};
		
		
	$("#compile").click(compileClick);
	$("#format").click(formatClick);

	function formatClick(e) {
		format();
	}

	function compileClick(e) {
		compile();
	}

	function format() {
		var code = $("#toCompile").val();

		l2js.format(code).then(formatted, handleError);
	}

	function formatted(code) {
		$("#toCompile").val(code);
	}

	function compile() {
		var code = $("#toCompile").val();

		t1 = new Date().getTime();



		l2js.compile(code).then(compiled, handleError);
	}

	function compiled(js) {
		var derivation = l2js.derive(js);
		//console.log(derivation)
		
		l2js.interpretAll(derivation, {
			container : "script_output",
			width : 480,
			height : 320,
			//turtle: {
			//initPosition: [100, 100],
			//initOrientation: 0
			//}
		});

		//		var derived = lsystem.derive("F(1)", 3);
		//		$("#toInterpret").text(derived);
	}

	function handleError(error) {
		console.error("Error", error);
	}

})(); 