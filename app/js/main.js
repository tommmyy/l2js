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
		var t1 = new Date();
		var derivation = l2js.derive(js);
			l2js.interpretAll(derivation, {
				container : "script_output",
				width : 480,
				height : 320,
				symbolsPerFrame: 30,
				//turtle: {
				//initPosition: [100, 100],
				//initOrientation: 0
				//}
			});
	}

	function handleError(error) {
		console.error("Error", error);
	}

})();
