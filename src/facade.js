'use strict';

window.l2js && function(l2js) {

    l2js.compile = function(code) {
        return new l2js.compiler.Compiler().compile(code);
    };

    l2js.derive = function(lsystemCode) {
        var out = eval(lsystemCode);
        return out;
    };

    l2js.interpretAll = function(symbols, options) {
        new l2js.interpret.Interpret(symbols, options).all();
    };

    l2js.format = function(lsystemCode) {
        var deferred = l2js.core.q.deferred();
        setTimeout(function() {
            var errHandler = function(err) {
                deferred.reject(err);
            };
            try {
                var compiler = new l2js.compiler.Compiler();

                var ast = compiler.toAST(lsystemCode);
                var l2 = compiler.ASTToL2(ast);
                deferred.resolve(l2);
            } catch (e) {
                errHandler(e);
            }

        }, 0);

        return deferred.promise;
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
