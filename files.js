l2jsFiles = {
    "src": ["src/l2js.js",
        "src/utils.js",
        "src/compiler.js",
        "src/compiler/env.js",
        "src/compiler/env/alphabet.js",
        "src/compiler/env/sublsystem.js",
        "src/compiler/env/stack.js",
        "src/compiler/env/lsystem.js",
        "src/compiler/env/lscript.js",
        "src/compiler/env/sublscript.js",
        "src/compiler/lnodes.js",
        "src/compiler/lparser.js",
        "src/compiler/astutils.js",
        "src/compiler/astcompiler.js",
        "src/compiler/l2compiler.js",
        "src/compiler/compiler.js",
        "src/interpret.js",
        "src/interpret/turtle2dbuilderpixi.js",
        "src/interpret/interpret.js",
        "src/evolver.js",
        "src/evolver/eutils.js",
        "src/evolver/ruleutils.js",
        "src/evolver/evolver.js",
        "src/facade.js"
    ],
    "parsers": ["src/compiler/lparser.js"],

    "env": ["src/l2js.js",
        "src/utils.js",
        "src/compiler.js",
        "src/compiler/env.js",
        "src/compiler/env/alphabet.js",
        "src/compiler/env/sublsystem.js",
        "src/compiler/env/stack.js",
        "src/compiler/env/lsystem.js",
        "src/compiler/env/lscript.js",
        "src/compiler/env/sublscript.js",
        "src/facade.js"
    ],
    "test": ["dist/l2js.js",
        "test/*.js",
        "test/compiler/*.js",
        "test/compiler/env/*.js",
        "test/interpret/*.js"
    ]


};
l2jsFiles.test = l2jsFiles.src.concat(l2jsFiles.test);
if (exports) {
    exports.files = l2jsFiles;
}
