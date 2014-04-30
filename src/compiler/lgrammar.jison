
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
name							[A-Za-z_][A-Za-z_0-9_]*	

%%

\/\/[^\n]* 						/* skip comment */
\s+                   			/* skip whitespace */
[0-9]+("."[0-9]+)?\b  			return 'NUMBER'
"'"(.*?)"'"						%{ /* 'text' */
									yytext = this.matches[1];
									return 'TEXT';
								%}
'"'(.*?)'"'						%{ /* "text" */
									yytext = this.matches[1];
									return 'TEXT';
								%}
"lscript"						return 'LSCRIPT'
"lsystem"						return 'LSYSTEM'
"alphabet"						return 'ALPHABET'
"included"						return 'INCLUDED'
"using"							return 'USING'
"derive"						return 'DERIVE'
"call"							return 'CALL'
"sublsystem"					return 'SUBLSYSTEM'
"main"							return 'MAIN'
"-->"							return 'RULE_OP'
"-h>"							return 'H_RULE_OP'
"E"								return 'E'
"PI"							return 'PI'
"__"{name}						return 'FUNC'
"$"{name}						return 'VAR'
{name}							return 'ID'
"["								return 'SU'
"]"								return 'SS'
"*"                   			return '*'
"/"                   			return '/'
"-"                   			return '-'
"+"                   			return '+'
"("                   			return '('
")"                   			return ')'
"{"								return '{'
"}"								return '}'
","								return ','
";"								return ';'
":"								return ':'
"|"								return '|'
"."								return '.'
"="								return '='
<<EOF>>							return 'EOF'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left 'RULE_OP'

%start program

%% /* language grammar */

program
    : program_entries EOF
        {{ 
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
					throw new yy.ParseError('Parse error on ' + @$.first_line + ':' + @$.last_column + '. ' + errMsg );
				}
			}*/
			
        	var block = new yy.ASTBlock(); 
        	block.isRoot = true;
        	block.entries = $1; 
        	return block; 
        }}
    ;

program_entries 
	: stmts
		{$$ = $1;}
	;
	
stmts 
	: stmt ';' stmts
		{$$ = $3; $$.unshift($1);}
	| stmt
		{$$ = [$1];} 
	| /* epsylon */
		{$$ = [];}	
	;	

stmt 
	:  var '=' e
		{$$ = $var; $$.e = $e;}
	| symbol '=' text
		{$$ = $symbol;$$.e = $3;}	
	| e
		{$$ = $e;}
	| LSCRIPT id '{' stmts '}'
		{{
			// TODO: add restrictions only to valid statements
			var block = new yy.ASTBlock();
			block.entries = $stmts;
			
			$$ = new yy.ASTLScript($id, block); 
		}}
	| LSYSTEM id '(' axiom ')' USING id '{' stmts '}'
		{{
			var block = new yy.ASTBlock(); 
			block.entries = $stmts;
			$$ = new yy.ASTLSystem($id1, $id2, $axiom, undefined , block);
		}}
	| LSYSTEM id '(' axiom ',' number ')' USING id '{' stmts '}'
		{{
			if($number.val % 1 !== 0) {
				var errMsg = "Number of iterations should be integer.";
				throw new yy.ParseError('Parse error on ' + @$.first_line + ':' + @$.last_column + '. ' + errMsg );
			}
			var block = new yy.ASTBlock(); 
			block.entries = $stmts;
			$$ = new yy.ASTLSystem($id1, $id2, $axiom, $number.val, block);
		}}
	| ALPHABET id '{' symbols '}'
		{{
			$id.type='alphabet';
			$$ = new yy.ASTAlphabet($id, $symbols);
		}}
	| INCLUDED TEXT '{' stmts '}'
		{$$ = new yy.ASTIncluded($2, $stmts);}
	| ancestor RULE_OP successors
		{$$ = new yy.ASTRule($1, $3);}
	| ancestor H_RULE_OP successors
		{$$ = new yy.ASTRule($1, $3, 'h');}
	| main_call
		{$$ = $1;}
	| sublsystem
		{$$ = $1;}
	| call
		{$$ = $1;}
	| DERIVE id
		{$$ = new yy.ASTDerive($id);}
	; 

stack 
	: SU string SS
		{{
			var start = new yy.ASTModule(new yy.ASTId($SU, "symbol")),
			end = new yy.ASTModule(new yy.ASTId($SS, "symbol"));
			$$ = new yy.ASTStack(start, end, $string);
		}}
	;
	
sublsystem
	: SUBLSYSTEM id '(' axiom ')' 
		{$id.type="lsystem"; $$ = new yy.ASTSubLSystem($id, $axiom);} 
	| SUBLSYSTEM id '(' axiom ',' e ')' 
		{{
			$id.type="lsystem"; $$ = new yy.ASTSubLSystem($id, $axiom, $e);
		}}
	| SUBLSYSTEM id '('  ',' e ')' 
		{{
		
			$id.type="lsystem"; $$ = new yy.ASTSubLSystem($id, undefined, $e);
		}}
	| SUBLSYSTEM id '(' ')' 
		{$id.type="lsystem"; $$ = new yy.ASTSubLSystem($id);}
	; 


call
	: CALL id '(' axiom ')' 
		{$id.type="lsystem"; $$ = new yy.ASTCall($id, $axiom);} 
	| CALL id '(' axiom ',' e ')' 
		{{
			$id.type="lsystem"; $$ = new yy.ASTCall($id, $axiom, $e);
		}}
	| CALL id '('  ',' e ')' 
		{{
			$id.type="lsystem"; $$ = new yy.ASTCall($id, undefined, $e);
		}}
	| CALL id '(' ')' 
		{$id.type="lsystem"; $$ = new yy.ASTCall($id);}
	; 

main_call	
	: MAIN call
		{$$ = $call; $$.isMain = true;}
	;

axiom
	: string
		{$$ = $1}
	;

iterations
	: number
		{{
			if($number.val % 1 !== 0) {
				var errMsg = "Number of iterations should be integer.";
				throw new yy.ParseError('Parse error on ' + @$.first_line + ':' + @$.last_column + '. ' + errMsg );
			}
			$$ = $1.val;
		}}
	;
	
ancestor
	: symbol '(' params ')'
		{$$ = new yy.ASTAncestor($1, $3);}
	| symbol
		{$$ = new yy.ASTAncestor($1);}
	;


successors 
	: successor '|' successors
		{$$ = $3; $$.unshift($1);}
	| successor
		{$$ = [$1];}
	;

successor
	: string ':' number
		{$$ = new yy.ASTSuccessor($1, $3.val);}
	| string
		{$$ = new yy.ASTSuccessor($1);}
	;	



string
	: module string
		{$$ = $2; $$.unshift($1);} 
	| module
		{$$ = [$1];}
	;

module
	: id '(' arguments ')'
		{$id.type="symbol"; $$ = new yy.ASTModule($id, $arguments);}
	| id
		{$id.type="symbol"; $$ =  new yy.ASTModule($id);}
	| call
		{$$ = $1;}
	| sublsystem
		{$$ = $1;}
	| stack
		{$$ = $1;}
	;

arguments
	: e ',' arguments
		{$$ = $arguments; $$.unshift($e);}
	|  ',' arguments
		{$$ = $arguments; $$.unshift(undefined);}
	| e
		{$$ = [$e];}
	| /* epsylon */
		{$$ = [];}
	;


params
	: param ',' params
		{$$ = $params; $$.unshift($param);}
	| ',' params
		{$$ = $params; $$.unshift(undefined);}
	| param
		{$$ = [$1];}
	| /* epsylon */
		{$$ = [];}
	;
	
param
	: ID
		{ $$ = new yy.ASTId($1, 'param');}
	;
	

symbols
	: symbol ',' symbols
		{$$ = $3; $$.unshift($1);}
	| symbol
		{$$ = [$1];}
	| /* epsylon */
		{$$ = [];}
	;

symbol
	: id
		{ $$ = $1; $$.type='symbol';}
	;
	
var
	: VAR
		{ $$ = new yy.ASTId($1, 'var'); }
	;
	
id
	: ID
		{ $$ = new yy.ASTId($1); }
	;
	

e
	: e '+' term
        {$$ = new yy.ASTOperation($2, $1, $3);}
    | e '-' term
        {$$ = new yy.ASTOperation($2, $1, $3);}
    | term
    	{$$ = $term;}
    ;
       
term
	: term '*' factor
        {$$ = new yy.ASTOperation($2, $1, $3);}
    | term '/' factor
        {$$ = new yy.ASTOperation($2, $1, $3);}
    | factor 
    	{$$ = $1;}
    ;
  
factor
	: FUNC '(' arguments ')'
    	{$$ = new yy.ASTFunc($1, $arguments);}
    | number
        {$$ = $1;}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | var
    	{$$ = $1;}
    
   | '(' e ')'
  	{$$ = new yy.ASTBrackets($e);}
    ;

text
	: TEXT
		{$$ = String(yytext);}
	;

number
	: NUMBER
        {$$ = new yy.ASTRef(Number(yytext));}
	;

	


