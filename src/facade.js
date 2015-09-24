'use strict';

window.l2js && function(l2js) {

    l2js.compile = function(code) {
        return new l2js.compiler.Compiler().compile(code);
    };

    l2js.derive = function(lsystemCode) {
        console.time('Derive');
        var out = eval(lsystemCode);
        console.timeEnd('Derive');
        return out;
    };

    l2js.interpretAll = function(symbols, options) {
        new l2js.interpret.Interpret(symbols, options).all();
    };

    l2js.format = function(lsystemCode) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    var compiler = new l2js.compiler.Compiler();

                    var ast = compiler.toAST(lsystemCode);
                    var l2 = compiler.ASTToL2(ast);
                    resolve(l2);
                } catch (e) {
                    reject(e);
                }

            }, 0);
        });

    };

    l2js.evolve = function(numberOfIndividuals, scripts, lscript, lsystems) {

        var compiler = new l2js.compiler.Compiler();
        var asts = [];
        for (var i = 0; i < scripts.length; i++) {
            if (typeof scripts[i] === "string") {
                scripts[i] = {
                    code: scripts[i]
                };
            }
            var ast = compiler.toAST(scripts[i].code);
            asts.push({
                evaluation: scripts[i].evaluation || 0,
                ast: ast
            });
        }

        return new l2js.evolver.Evolver(asts, {
            numberOfIndividuals: numberOfIndividuals,
            lsystems: lsystems,
            lscript: lscript
        });
    };

}(window.l2js);
