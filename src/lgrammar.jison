
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
name							[A-Za-z_][A-Za-z_0-9_]*								

%%

\/\/[^\n]* 						/* skip comment */
\s+                   			/* skip whitespace */
[0-9]+\b			  			return 'INT'
[0-9]+"."[0-9]+\b  				return 'REAL'
"'"(.*?)"'"						%{ /* 'text' */
									yytext = this.matches[1];
									return 'TEXT';
								%}
'"'(.*?)'"'						%{ /* "text" */
									yytext = this.matches[1];
									return 'TEXT';
								%}
"lsystem"						return 'LSYSTEM'
"alphabet"						return 'ALPHABET'
"using"							return 'USING'
"call"							return 'CALL'
"main"							return 'MAIN'
"-->"							return 'RULE_OP'
"E"								return 'E'
"PI"							return 'PI'
"$"{name}						return 'VAR'
{name}							return 'ID'
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
        	var block = new yy.Block(); 
        	block.entries = $1; 
        	return block; 
        }}
    ;

program_entries 
	: stmts
		{$$ = $1}
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
	: var '=' e
		{$$ = $var; $$.e = $e;}
	| symbol '=' text
		{$$ = $symbol;$$.e = $3;}	
	| var
		{$$ = $var;}
	| LSYSTEM id USING id '{' stmts '}'
		{{
			var block = new yy.Block(); 
			block.entries = $stmts;
			$$ = new yy.LSystem($id1, $id2, block);
		}}
	| ALPHABET id '{' symbols '}'
		{{
			$id.type='alphabet';
			$$ = new yy.Alphabet($id, $symbols);
		}}
	| ancestor RULE_OP successors
		{$$ = new yy.Rule($1, $3);}
	| main_call
		{$$ = $1;}
	;


call
	: CALL id '(' axiom ',' iterations ')' 
		{$id.type="lsystem"; $$ = new yy.Call($id, $axiom, $iterations);}
	; 

main_call	
	: MAIN call
		{$$ = $call; $$.main = true;}
	;

axiom
	: string
		{$$ = $1}
	;

iterations
	: int
		{$$ = $1;}
	;
	
ancestor
	: symbol '(' arguments ')'
		{$$ = new yy.Ancestor($1, $3);}
	| symbol
		{$$ = new yy.Ancestor($1);}
	;


successors 
	: successor '|' successors
		{$$ = $3; $$.unshift($1);}
	| successor
		{$$ = [$1];}
	;

successor
	: string ':' number
		{$$ = new yy.Successor($1, $3);}
	| string
		{$$ = new yy.Successor($1);}
	;	



string
	: module string
		{$$ = $2; $$.unshift($1);} 
	| module
		{$$ = [$1];}
	;

module
	: id '(' elist ')'
		{$id.type="symbol"; $$ = new yy.Module($id, $elist);}
	| id
		{$id.type="symbol"; $$ =  new yy.Module($id);}
	| call
		{$$ = $1;}
	;

elist
	: e ',' elist
		{$$ = $3; $$.unshift($1);}
	| e
		{$$ = [$1];}
	| /* epsylon */
		{$$ = [];}
	;


arguments
	: argument ',' arguments
		{$$ = $3; $$.unshift($1);}
	| argument
		{$$ = [$1];}
	| /* epsylon */
		{$$ = [];}
	;
	
argument
	: ID
		{ $$ = new yy.ID($1, 'arg');}
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
		{ $$ = new yy.ID($1, 'var'); }
	;
	
id
	: ID
		{ $$ = new yy.ID($1); }
	;
	

e
	: e '+' term
        {$$ = new yy.Operation($2, $1, $3);}
    | e '-' term
        {$$ = new yy.Operation($2, $1, $3);}
    | term
    	{$$ = $term;}
    ;
       
term
	: term '*' factor
        {$$ = new yy.Operation($2, $1, $3);}
    | term '/' factor
        {$$ = new yy.Operation($2, $1, $3);}
    | factor 
    	{$$ = $1;}
    ;
  
factor
	: number
        {$$ = $1;}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | VAR
    	{$$ = new yy.ID($1, 'var');}
    ;

text
	: TEXT
		{$$ = String(yytext);}
	;

number
	: int
        {$$ = $1;}
	| REAL
        {$$ = Number(yytext);}
	;

int
	: INT
        {$$ = Number(yytext);}
	;
	


