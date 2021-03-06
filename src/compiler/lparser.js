/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
window.l2js && function(l2js) {
l2js.compiler.Lparser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"program_entries":4,"EOF":5,"stmts":6,"stmt":7,";":8,"var":9,"=":10,"e":11,"symbol":12,"text":13,"LSCRIPT":14,"id":15,"{":16,"}":17,"LSYSTEM":18,"(":19,"axiom":20,")":21,"USING":22,",":23,"number":24,"ALPHABET":25,"symbols":26,"INCLUDED":27,"TEXT":28,"ancestor":29,"RULE_OP":30,"successors":31,"H_RULE_OP":32,"main_call":33,"sublsystem":34,"call":35,"DERIVE":36,"stack":37,"SU":38,"string":39,"SS":40,"SUBLSYSTEM":41,"CALL":42,"MAIN":43,"iterations":44,"params":45,"successor":46,"|":47,":":48,"module":49,"arguments":50,"param":51,"ID":52,"VAR":53,"+":54,"term":55,"-":56,"*":57,"factor":58,"/":59,"FUNC":60,"E":61,"PI":62,"NUMBER":63,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:";",10:"=",14:"LSCRIPT",16:"{",17:"}",18:"LSYSTEM",19:"(",21:")",22:"USING",23:",",25:"ALPHABET",27:"INCLUDED",28:"TEXT",30:"RULE_OP",32:"H_RULE_OP",36:"DERIVE",38:"SU",40:"SS",41:"SUBLSYSTEM",42:"CALL",43:"MAIN",47:"|",48:":",52:"ID",53:"VAR",54:"+",56:"-",57:"*",59:"/",60:"FUNC",61:"E",62:"PI",63:"NUMBER"},
productions_: [0,[3,2],[4,1],[6,3],[6,1],[6,0],[7,3],[7,3],[7,1],[7,5],[7,10],[7,12],[7,5],[7,5],[7,3],[7,3],[7,1],[7,1],[7,1],[7,2],[37,3],[34,5],[34,7],[34,6],[34,4],[35,5],[35,7],[35,6],[35,4],[33,2],[20,1],[44,1],[29,4],[29,1],[31,3],[31,1],[46,3],[46,1],[39,2],[39,1],[49,4],[49,1],[49,1],[49,1],[49,1],[50,3],[50,2],[50,1],[50,0],[45,3],[45,2],[45,1],[45,0],[51,1],[26,3],[26,1],[26,0],[12,1],[9,1],[15,1],[11,3],[11,3],[11,1],[55,3],[55,3],[55,1],[58,4],[58,1],[58,1],[58,1],[58,1],[58,3],[13,1],[24,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: 
        	// TODO: add restrictions only to valid statements
            /*var i;
			for(i = 0; i < $stmts.length; i++) {
				var errMsg,stmt = $stmts[i];
				if( stmt instanceof yy.ASTRule) {
					errMsg = 'Main program should not contain rule declaration.';
				} else if(stmt instanceof yy.ASTCall && !stmt.isMain) {
					errMsg = 'In global scope use only main call.';
				} 
				
				if(typeof errMsg !== 'undefined') {
					throw new yy.ParseError('Parse error on ' + this._$.first_line + ':' + this._$.last_column + '. ' + errMsg );
				}
			}*/
			
        	var block = new yy.ASTBlock(); 
        	block.isRoot = true;
        	block.entries = $$[$0-1]; 
        	return block; 
        
break;
case 2:this.$ = $$[$0];
break;
case 3:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 4:this.$ = [$$[$0]];
break;
case 5:this.$ = [];
break;
case 6:this.$ = $$[$0-2]; this.$.e = $$[$0];
break;
case 7:this.$ = $$[$0-2];this.$.e = $$[$0];
break;
case 8:this.$ = $$[$0];
break;
case 9:
			// TODO: add restrictions only to valid statements
			var block = new yy.ASTBlock();
			block.entries = $$[$0-1];
			
			this.$ = new yy.ASTLScript($$[$0-3], block); 
		
break;
case 10:
			var block = new yy.ASTBlock(); 
			block.entries = $$[$0-1];
			this.$ = new yy.ASTLSystem($$[$0-8], $$[$0-3], $$[$0-6], undefined , block);
		
break;
case 11:
			if($$[$0-6].val % 1 !== 0) {
				var errMsg = "Number of iterations should be integer.";
				throw new yy.ParseError('Parse error on ' + this._$.first_line + ':' + this._$.last_column + '. ' + errMsg );
			}
			var block = new yy.ASTBlock(); 
			block.entries = $$[$0-1];
			this.$ = new yy.ASTLSystem($$[$0-10], $$[$0-3], $$[$0-8], $$[$0-6].val, block);
		
break;
case 12:
			$$[$0-3].type='alphabet';
			this.$ = new yy.ASTAlphabet($$[$0-3], $$[$0-1]);
		
break;
case 13:this.$ = new yy.ASTIncluded($$[$0-3], $$[$0-1]);
break;
case 14:this.$ = new yy.ASTRule($$[$0-2], $$[$0]);
break;
case 15:this.$ = new yy.ASTRule($$[$0-2], $$[$0], 'h');
break;
case 16:this.$ = $$[$0];
break;
case 17:this.$ = $$[$0];
break;
case 18:this.$ = $$[$0];
break;
case 19:this.$ = new yy.ASTDerive($$[$0]);
break;
case 20:
			var start = new yy.ASTModule(new yy.ASTId($$[$0-2], "symbol")),
			end = new yy.ASTModule(new yy.ASTId($$[$0], "symbol"));
			this.$ = new yy.ASTStack(start, end, $$[$0-1]);
		
break;
case 21:$$[$0-3].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-3], $$[$0-1]);
break;
case 22:
			$$[$0-5].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-5], $$[$0-3], $$[$0-1]);
		
break;
case 23:
		
			$$[$0-4].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-4], undefined, $$[$0-1]);
		
break;
case 24:$$[$0-2].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-2]);
break;
case 25:$$[$0-3].type="lsystem"; this.$ = new yy.ASTCall($$[$0-3], $$[$0-1]);
break;
case 26:
			$$[$0-5].type="lsystem"; this.$ = new yy.ASTCall($$[$0-5], $$[$0-3], $$[$0-1]);
		
break;
case 27:
			$$[$0-4].type="lsystem"; this.$ = new yy.ASTCall($$[$0-4], undefined, $$[$0-1]);
		
break;
case 28:$$[$0-2].type="lsystem"; this.$ = new yy.ASTCall($$[$0-2]);
break;
case 29:this.$ = $$[$0]; this.$.isMain = true;
break;
case 30:this.$ = $$[$0]
break;
case 31:
			if($$[$0].val % 1 !== 0) {
				var errMsg = "Number of iterations should be integer.";
				throw new yy.ParseError('Parse error on ' + this._$.first_line + ':' + this._$.last_column + '. ' + errMsg );
			}
			this.$ = $$[$0].val;
		
break;
case 32:this.$ = new yy.ASTAncestor($$[$0-3], $$[$0-1]);
break;
case 33:this.$ = new yy.ASTAncestor($$[$0]);
break;
case 34:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 35:this.$ = [$$[$0]];
break;
case 36:this.$ = new yy.ASTSuccessor($$[$0-2], $$[$0].val);
break;
case 37:this.$ = new yy.ASTSuccessor($$[$0]);
break;
case 38:this.$ = $$[$0]; this.$.unshift($$[$0-1]);
break;
case 39:this.$ = [$$[$0]];
break;
case 40:$$[$0-3].type="symbol"; this.$ = new yy.ASTModule($$[$0-3], $$[$0-1]);
break;
case 41:$$[$0].type="symbol"; this.$ =  new yy.ASTModule($$[$0]);
break;
case 42:this.$ = $$[$0];
break;
case 43:this.$ = $$[$0];
break;
case 44:this.$ = $$[$0];
break;
case 45:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 46:this.$ = $$[$0]; this.$.unshift(undefined);
break;
case 47:this.$ = [$$[$0]];
break;
case 48:this.$ = [];
break;
case 49:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 50:this.$ = $$[$0]; this.$.unshift(undefined);
break;
case 51:this.$ = [$$[$0]];
break;
case 52:this.$ = [];
break;
case 53: this.$ = new yy.ASTId($$[$0], 'param');
break;
case 54:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 55:this.$ = [$$[$0]];
break;
case 56:this.$ = [];
break;
case 57: this.$ = $$[$0]; this.$.type='symbol';
break;
case 58: this.$ = new yy.ASTId($$[$0], 'var'); 
break;
case 59: this.$ = new yy.ASTId($$[$0]); 
break;
case 60:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 61:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 62:this.$ = $$[$0];
break;
case 63:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 64:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 65:this.$ = $$[$0];
break;
case 66:this.$ = new yy.ASTFunc($$[$0-3], $$[$0-1]);
break;
case 67:this.$ = $$[$0];
break;
case 68:this.$ = Math.E;
break;
case 69:this.$ = Math.PI;
break;
case 70:this.$ = $$[$0];
break;
case 71:this.$ = new yy.ASTBrackets($$[$0-1]);
break;
case 72:this.$ = String(yytext);
break;
case 73:this.$ = new yy.ASTRef(Number(yytext));
break;
}
},
table: [{3:1,4:2,5:[2,5],6:3,7:4,9:5,11:7,12:6,14:[1,8],15:18,18:[1,9],19:[1,29],24:26,25:[1,10],27:[1,11],29:12,33:13,34:14,35:15,36:[1,16],41:[1,21],42:[1,22],43:[1,20],52:[1,23],53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{1:[3]},{5:[1,31]},{5:[2,2]},{5:[2,4],8:[1,32],17:[2,4]},{5:[2,70],8:[2,70],10:[1,33],17:[2,70],54:[2,70],56:[2,70],57:[2,70],59:[2,70]},{10:[1,34],19:[1,35],30:[2,33],32:[2,33]},{5:[2,8],8:[2,8],17:[2,8],54:[1,36],56:[1,37]},{15:38,52:[1,23]},{15:39,52:[1,23]},{15:40,52:[1,23]},{28:[1,41]},{30:[1,42],32:[1,43]},{5:[2,16],8:[2,16],17:[2,16]},{5:[2,17],8:[2,17],17:[2,17]},{5:[2,18],8:[2,18],17:[2,18]},{15:44,52:[1,23]},{5:[2,58],8:[2,58],10:[2,58],17:[2,58],21:[2,58],23:[2,58],54:[2,58],56:[2,58],57:[2,58],59:[2,58]},{10:[2,57],17:[2,57],19:[2,57],23:[2,57],30:[2,57],32:[2,57]},{5:[2,62],8:[2,62],17:[2,62],21:[2,62],23:[2,62],54:[2,62],56:[2,62],57:[1,45],59:[1,46]},{35:47,42:[1,22]},{15:48,52:[1,23]},{15:49,52:[1,23]},{5:[2,59],8:[2,59],10:[2,59],16:[2,59],17:[2,59],19:[2,59],21:[2,59],23:[2,59],30:[2,59],32:[2,59],38:[2,59],40:[2,59],41:[2,59],42:[2,59],47:[2,59],48:[2,59],52:[2,59]},{5:[2,65],8:[2,65],17:[2,65],21:[2,65],23:[2,65],54:[2,65],56:[2,65],57:[2,65],59:[2,65]},{19:[1,50]},{5:[2,67],8:[2,67],17:[2,67],21:[2,67],23:[2,67],54:[2,67],56:[2,67],57:[2,67],59:[2,67]},{5:[2,68],8:[2,68],17:[2,68],21:[2,68],23:[2,68],54:[2,68],56:[2,68],57:[2,68],59:[2,68]},{5:[2,69],8:[2,69],17:[2,69],21:[2,69],23:[2,69],54:[2,69],56:[2,69],57:[2,69],59:[2,69]},{9:52,11:51,19:[1,29],24:26,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{5:[2,73],8:[2,73],17:[2,73],21:[2,73],23:[2,73],47:[2,73],54:[2,73],56:[2,73],57:[2,73],59:[2,73]},{1:[2,1]},{5:[2,5],6:53,7:4,9:5,11:7,12:6,14:[1,8],15:18,17:[2,5],18:[1,9],19:[1,29],24:26,25:[1,10],27:[1,11],29:12,33:13,34:14,35:15,36:[1,16],41:[1,21],42:[1,22],43:[1,20],52:[1,23],53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{9:52,11:54,19:[1,29],24:26,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{13:55,28:[1,56]},{21:[2,52],23:[1,59],45:57,51:58,52:[1,60]},{9:52,19:[1,29],24:26,53:[1,17],55:61,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{9:52,19:[1,29],24:26,53:[1,17],55:62,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{16:[1,63]},{19:[1,64]},{16:[1,65]},{16:[1,66]},{15:71,31:67,34:73,35:72,37:74,38:[1,75],39:69,41:[1,21],42:[1,22],46:68,49:70,52:[1,23]},{15:71,31:76,34:73,35:72,37:74,38:[1,75],39:69,41:[1,21],42:[1,22],46:68,49:70,52:[1,23]},{5:[2,19],8:[2,19],17:[2,19]},{9:52,19:[1,29],24:26,53:[1,17],58:77,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{9:52,19:[1,29],24:26,53:[1,17],58:78,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{5:[2,29],8:[2,29],17:[2,29]},{19:[1,79]},{19:[1,80]},{9:52,11:82,19:[1,29],21:[2,48],23:[1,83],24:26,50:81,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{21:[1,84],54:[1,36],56:[1,37]},{5:[2,70],8:[2,70],17:[2,70],21:[2,70],23:[2,70],54:[2,70],56:[2,70],57:[2,70],59:[2,70]},{5:[2,3],17:[2,3]},{5:[2,6],8:[2,6],17:[2,6],54:[1,36],56:[1,37]},{5:[2,7],8:[2,7],17:[2,7]},{5:[2,72],8:[2,72],17:[2,72]},{21:[1,85]},{21:[2,51],23:[1,86]},{21:[2,52],23:[1,59],45:87,51:58,52:[1,60]},{21:[2,53],23:[2,53]},{5:[2,60],8:[2,60],17:[2,60],21:[2,60],23:[2,60],54:[2,60],56:[2,60],57:[1,45],59:[1,46]},{5:[2,61],8:[2,61],17:[2,61],21:[2,61],23:[2,61],54:[2,61],56:[2,61],57:[1,45],59:[1,46]},{6:88,7:4,9:5,11:7,12:6,14:[1,8],15:18,17:[2,5],18:[1,9],19:[1,29],24:26,25:[1,10],27:[1,11],29:12,33:13,34:14,35:15,36:[1,16],41:[1,21],42:[1,22],43:[1,20],52:[1,23],53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{15:71,20:89,34:73,35:72,37:74,38:[1,75],39:90,41:[1,21],42:[1,22],49:70,52:[1,23]},{12:92,15:18,17:[2,56],26:91,52:[1,23]},{6:93,7:4,9:5,11:7,12:6,14:[1,8],15:18,17:[2,5],18:[1,9],19:[1,29],24:26,25:[1,10],27:[1,11],29:12,33:13,34:14,35:15,36:[1,16],41:[1,21],42:[1,22],43:[1,20],52:[1,23],53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{5:[2,14],8:[2,14],17:[2,14]},{5:[2,35],8:[2,35],17:[2,35],47:[1,94]},{5:[2,37],8:[2,37],17:[2,37],47:[2,37],48:[1,95]},{5:[2,39],8:[2,39],15:71,17:[2,39],21:[2,39],23:[2,39],34:73,35:72,37:74,38:[1,75],39:96,40:[2,39],41:[1,21],42:[1,22],47:[2,39],48:[2,39],49:70,52:[1,23]},{5:[2,41],8:[2,41],17:[2,41],19:[1,97],21:[2,41],23:[2,41],38:[2,41],40:[2,41],41:[2,41],42:[2,41],47:[2,41],48:[2,41],52:[2,41]},{5:[2,42],8:[2,42],17:[2,42],21:[2,42],23:[2,42],38:[2,42],40:[2,42],41:[2,42],42:[2,42],47:[2,42],48:[2,42],52:[2,42]},{5:[2,43],8:[2,43],17:[2,43],21:[2,43],23:[2,43],38:[2,43],40:[2,43],41:[2,43],42:[2,43],47:[2,43],48:[2,43],52:[2,43]},{5:[2,44],8:[2,44],17:[2,44],21:[2,44],23:[2,44],38:[2,44],40:[2,44],41:[2,44],42:[2,44],47:[2,44],48:[2,44],52:[2,44]},{15:71,34:73,35:72,37:74,38:[1,75],39:98,41:[1,21],42:[1,22],49:70,52:[1,23]},{5:[2,15],8:[2,15],17:[2,15]},{5:[2,63],8:[2,63],17:[2,63],21:[2,63],23:[2,63],54:[2,63],56:[2,63],57:[2,63],59:[2,63]},{5:[2,64],8:[2,64],17:[2,64],21:[2,64],23:[2,64],54:[2,64],56:[2,64],57:[2,64],59:[2,64]},{15:71,20:99,21:[1,101],23:[1,100],34:73,35:72,37:74,38:[1,75],39:90,41:[1,21],42:[1,22],49:70,52:[1,23]},{15:71,20:102,21:[1,104],23:[1,103],34:73,35:72,37:74,38:[1,75],39:90,41:[1,21],42:[1,22],49:70,52:[1,23]},{21:[1,105]},{21:[2,47],23:[1,106],54:[1,36],56:[1,37]},{9:52,11:82,19:[1,29],21:[2,48],23:[1,83],24:26,50:107,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{5:[2,71],8:[2,71],17:[2,71],21:[2,71],23:[2,71],54:[2,71],56:[2,71],57:[2,71],59:[2,71]},{30:[2,32],32:[2,32]},{21:[2,52],23:[1,59],45:108,51:58,52:[1,60]},{21:[2,50]},{17:[1,109]},{21:[1,110],23:[1,111]},{21:[2,30],23:[2,30]},{17:[1,112]},{17:[2,55],23:[1,113]},{17:[1,114]},{15:71,31:115,34:73,35:72,37:74,38:[1,75],39:69,41:[1,21],42:[1,22],46:68,49:70,52:[1,23]},{24:116,63:[1,30]},{5:[2,38],8:[2,38],17:[2,38],21:[2,38],23:[2,38],40:[2,38],47:[2,38],48:[2,38]},{9:52,11:82,19:[1,29],21:[2,48],23:[1,83],24:26,50:117,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{40:[1,118]},{21:[1,119],23:[1,120]},{9:52,11:121,19:[1,29],24:26,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{5:[2,24],8:[2,24],17:[2,24],21:[2,24],23:[2,24],38:[2,24],40:[2,24],41:[2,24],42:[2,24],47:[2,24],48:[2,24],52:[2,24]},{21:[1,122],23:[1,123]},{9:52,11:124,19:[1,29],24:26,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{5:[2,28],8:[2,28],17:[2,28],21:[2,28],23:[2,28],38:[2,28],40:[2,28],41:[2,28],42:[2,28],47:[2,28],48:[2,28],52:[2,28]},{5:[2,66],8:[2,66],17:[2,66],21:[2,66],23:[2,66],54:[2,66],56:[2,66],57:[2,66],59:[2,66]},{9:52,11:82,19:[1,29],21:[2,48],23:[1,83],24:26,50:125,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{21:[2,46]},{21:[2,49]},{5:[2,9],8:[2,9],17:[2,9]},{22:[1,126]},{24:127,63:[1,30]},{5:[2,12],8:[2,12],17:[2,12]},{12:92,15:18,17:[2,56],26:128,52:[1,23]},{5:[2,13],8:[2,13],17:[2,13]},{5:[2,34],8:[2,34],17:[2,34]},{5:[2,36],8:[2,36],17:[2,36],47:[2,36]},{21:[1,129]},{5:[2,20],8:[2,20],17:[2,20],21:[2,20],23:[2,20],38:[2,20],40:[2,20],41:[2,20],42:[2,20],47:[2,20],48:[2,20],52:[2,20]},{5:[2,21],8:[2,21],17:[2,21],21:[2,21],23:[2,21],38:[2,21],40:[2,21],41:[2,21],42:[2,21],47:[2,21],48:[2,21],52:[2,21]},{9:52,11:130,19:[1,29],24:26,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{21:[1,131],54:[1,36],56:[1,37]},{5:[2,25],8:[2,25],17:[2,25],21:[2,25],23:[2,25],38:[2,25],40:[2,25],41:[2,25],42:[2,25],47:[2,25],48:[2,25],52:[2,25]},{9:52,11:132,19:[1,29],24:26,53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{21:[1,133],54:[1,36],56:[1,37]},{21:[2,45]},{15:134,52:[1,23]},{21:[1,135]},{17:[2,54]},{5:[2,40],8:[2,40],17:[2,40],21:[2,40],23:[2,40],38:[2,40],40:[2,40],41:[2,40],42:[2,40],47:[2,40],48:[2,40],52:[2,40]},{21:[1,136],54:[1,36],56:[1,37]},{5:[2,23],8:[2,23],17:[2,23],21:[2,23],23:[2,23],38:[2,23],40:[2,23],41:[2,23],42:[2,23],47:[2,23],48:[2,23],52:[2,23]},{21:[1,137],54:[1,36],56:[1,37]},{5:[2,27],8:[2,27],17:[2,27],21:[2,27],23:[2,27],38:[2,27],40:[2,27],41:[2,27],42:[2,27],47:[2,27],48:[2,27],52:[2,27]},{16:[1,138]},{22:[1,139]},{5:[2,22],8:[2,22],17:[2,22],21:[2,22],23:[2,22],38:[2,22],40:[2,22],41:[2,22],42:[2,22],47:[2,22],48:[2,22],52:[2,22]},{5:[2,26],8:[2,26],17:[2,26],21:[2,26],23:[2,26],38:[2,26],40:[2,26],41:[2,26],42:[2,26],47:[2,26],48:[2,26],52:[2,26]},{6:140,7:4,9:5,11:7,12:6,14:[1,8],15:18,17:[2,5],18:[1,9],19:[1,29],24:26,25:[1,10],27:[1,11],29:12,33:13,34:14,35:15,36:[1,16],41:[1,21],42:[1,22],43:[1,20],52:[1,23],53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{15:141,52:[1,23]},{17:[1,142]},{16:[1,143]},{5:[2,10],8:[2,10],17:[2,10]},{6:144,7:4,9:5,11:7,12:6,14:[1,8],15:18,17:[2,5],18:[1,9],19:[1,29],24:26,25:[1,10],27:[1,11],29:12,33:13,34:14,35:15,36:[1,16],41:[1,21],42:[1,22],43:[1,20],52:[1,23],53:[1,17],55:19,58:24,60:[1,25],61:[1,27],62:[1,28],63:[1,30]},{17:[1,145]},{5:[2,11],8:[2,11],17:[2,11]}],
defaultActions: {3:[2,2],31:[2,1],87:[2,50],107:[2,46],108:[2,49],125:[2,45],128:[2,54]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip comment */
break;
case 1:/* skip whitespace */
break;
case 2:return 63
break;
case 3: /* 'text' */
									yy_.yytext = this.matches[1];
									return 28;
								
break;
case 4: /* "text" */
									yy_.yytext = this.matches[1];
									return 28;
								
break;
case 5:return 14
break;
case 6:return 18
break;
case 7:return 25
break;
case 8:return 27
break;
case 9:return 22
break;
case 10:return 36
break;
case 11:return 42
break;
case 12:return 41
break;
case 13:return 43
break;
case 14:return 30
break;
case 15:return 32
break;
case 16:return 61
break;
case 17:return 62
break;
case 18:return 60
break;
case 19:return 53
break;
case 20:return 52
break;
case 21:return 38
break;
case 22:return 40
break;
case 23:return 57
break;
case 24:return 59
break;
case 25:return 56
break;
case 26:return 54
break;
case 27:return 19
break;
case 28:return 21
break;
case 29:return 16
break;
case 30:return 17
break;
case 31:return 23
break;
case 32:return 8
break;
case 33:return 48
break;
case 34:return 47
break;
case 35:return '.'
break;
case 36:return 10
break;
case 37:return 5
break;
}
},
rules: [/^(?:\/\/[^\n]*)/,/^(?:\s+)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:'(.*?)')/,/^(?:"(.*?)")/,/^(?:lscript\b)/,/^(?:lsystem\b)/,/^(?:alphabet\b)/,/^(?:included\b)/,/^(?:using\b)/,/^(?:derive\b)/,/^(?:call\b)/,/^(?:sublsystem\b)/,/^(?:main\b)/,/^(?:-->)/,/^(?:-h>)/,/^(?:E\b)/,/^(?:PI\b)/,/^(?:__([A-Za-z_][A-Za-z_0-9_]*))/,/^(?:\$([A-Za-z_][A-Za-z_0-9_]*))/,/^(?:([A-Za-z_][A-Za-z_0-9_]*))/,/^(?:\[)/,/^(?:\])/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?:;)/,/^(?::)/,/^(?:\|)/,/^(?:\.)/,/^(?:=)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
}(window.l2js);