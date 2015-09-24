(function() {

    var app = {
        evolver: {}
    };


    l2js.files = {
        "file1.l2": "include \"file2.l2\";",
        "file2.l2": "$_angle = 10;"
    };
    l2js.options.maxDerivedSymbols = 500000;

    $("#compile").click(compileClick);
    $("#format").click(formatClick);
    $("#init-evolution").click(initEvolutionClick);
    $("#evolve").click(evolveClick);

    function initEvolutionClick(e) {
        initEvolutionClick();
    }

    function evolveClick(e) {
        evolve();
    }

    function formatClick(e) {
        format();
    }

    function compileClick(e) {
        compile();
    }

    function initEvolutionClick() {
        var code = $("#toCompile").val();
        app.evolver = l2js.evolve(4, [code, {
            code: code,
            evaluation: 1
        }, code], null, ["KochFlake"]);
        console.log("New evolver", app.evolver);
        evolve();

    }

    function evolve() {

        var population = app.evolver.getPopulation();
        var $out = $("#mutation_output");

        $out.find("[data-index]").each(function() {
            var i = $(this).data('index');
            if (population[i]) {
                var val = $(this).val() || 0;
                population[i].evaluation = parseInt(val);
            }
        });
        app.evolver.nextGeneration();
        newpopulation = app.evolver.getPopulation();
        var $output = $out.html("");
        for (var i = 0; i < newpopulation.length; i++) {
            var c = new l2js.compiler.Compiler();
            var js = c.ASTToJS(newpopulation[i].ast);
            var l2 = c.ASTToL2(newpopulation[i].ast);
            $output.append("<div id='mutation_output-" + i + "'></div>");
            $output.append("<div id='mutation_code-" + i + "'><textarea rows='30' class='form-control'>" + l2 + "</textarea><input type='text' value='" + newpopulation[i].evaluation + "' id='mutation_evaluation-" + i + "' data-index='" + i + "'></div>");
            compiled(js, "mutation_output-" + i);
        }
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
        console.time('compile');
        l2js.compile(code).then(function(js) {
            console.timeEnd('compile');
            compiled(js, "script_output");
        }, handleError);
    }

    function compiled(js, containerId) {

        console.time('derive');
        var derivation = l2js.derive(js);
        console.timeEnd('derive');

        try {
            l2js.interpretAll(derivation, {
                container: containerId,
                width: 800,
                height: 600,
                symbolsPerFrame: 10000,
                turtle: {
                    initPosition: [400, 300],
                    initOrientation: -90
                }
            });

        } catch (e) {
            console.error(e);
        }

    }

    function handleError(error) {
        console.error("Error", error);
    }

})();
