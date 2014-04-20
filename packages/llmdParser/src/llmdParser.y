/*
  [TODO] - free package from data atribute
*/
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%{
  DEBUG = true;
  
  

%}

%x code
%x block
%x blockDef
%x package
%x packagename
%x packagecontent
%x varass

RN                    \r\n
EOL 									\r\n|\r|\n        /* end of line character */
NEOL									[^\r\n{]	          /* not end of line character */
TB                    [^ \t\r\n]        /* textblock character */
WS                    [\t ]							/* whitespace character */
BL                    ({EOL}*{WS}*)*

%%

/*%token block*/


<*><<EOF>>                 return 'EOF'
<*>{EOL}                   return 'EOL'


<INITIAL,block>'{{'\s*([\w\.]+)\s*'}}'                 { yytext = this.matches[1];return 'EXPR'; }

<INITIAL,block>'```'{NEOL}*      { this.begin('code'); return 'BEGIN_CODE'; }
<code>'```'{NEOL}*         { this.popState(); return 'END_CODE'; }
<code>{NEOL}*              { return 'CODELINE'; }


<INITIAL,block>'{{>'\s*(\w+)     { this.begin('package'); yytext = this.matches[1]; return 'BEGIN_PACKAGE' }
<package>\s*'}}'           { this.popState(); return 'END_PACKAGE'; }


/* [todo] - parse json, not lines */
<package,packagecontent>{BL}*'{'           { this.begin('packagecontent'); return 'BRACE_OPEN';  }
<packagecontent>{BL}'}'{BL}                { this.popState(); return 'BRACE_CLOSE'; }
<packagecontent>[^{}]*                     { return 'PACKAGELINE'; }

<package,blockDef>\s*\'(.*)\'              { yytext = this.matches[1]; return 'STRING'; }             
<package,blockDef>\s*\"(.*)\"              { yytext = this.matches[1]; return 'STRING'; }             
<package,blockDef>\s*(\w+)\s*\=            { this.begin('varass'); yytext = this.matches[1]; return 'VARASS';}
<varass>\s*(\w+)                           { this.popState(); yytext = this.matches[1]; return 'ASS'; }
<package,blockDef>\s*([\w\.]+)             { yytext = this.matches[1]; return 'VAR'; }             



<INITIAL,block>'{{#'\s*([\w\?]+)        { this.begin('blockDef'); yytext = this.matches[1]; return 'BLOCK_DEF_START' }
<blockDef>\s+                     /* ignore whitespace in definition */
<blockDef>'}}'{NEOL}*             { this.popState(); this.begin('block'); return 'BEGIN_BLOCK'; }
<block>'{{/'([\w\?]+)'}}'{NEOL}*          { this.popState(); yytext = this.matches[1]; return 'END_BLOCK'; }



<*>{NEOL}*{EOL}?                  return 'LINE'
.                                 return 'INVALID'



/lex


%start MDARKDOWN

%% /* language grammar */

MDARKDOWN: BLOCKS EOF 
         { 
         return yy.llmd.filterRoot($1); 
         } ;

BLOCKS
    : BLOCK BLOCKS
      { 
        var block = $1;
        if( !DEBUG ) {
          block.from = @1.first_line;
          block.to = @1.last_line;
        }
        $$ = [$1].concat($2); 
      }
    | 
      { $$ = []; }
    ;


// [TODO] - Params can be strings, ints or vars
OPT_PARAMS
    : VAR OPT_PARAMS
      { 
        /*if(yy.ctx[$VAR]) var param = yy.ctx[$VAR];*/
        /*else throw new Error("ERROR: no value "+$VAR+" fonund in the context.");*/
        
        $$ = [yy.llmd.newExpr($VAR)].concat($2)
      }
    | VARASS ASS OPT_PARAMS
      { $$ = [{ name: 'ass', key:$1, value: $2 }].concat($3) }
    | STRING OPT_PARAMS
      {
        $$ = [$STRING].concat($2)
      }
    | 
      { $$ = [] }
    ;

// TODO: parse default blocks
BLOCK
    : BLOCK_DEF_START OPT_PARAMS BEGIN_BLOCK EOS BLOCKS END_BLOCK EOS
      { 
        if( $1 != $END_BLOCK ) {
          throw new Error("blocks don't match");
        }
        $$ = yy.llmd.newBlock( $1, $2, $5 );
      }
    | BEGIN_PACKAGE OPT_PARAMS END_PACKAGE EOL
      {
      /*$$ = { name:$1, params:$2 }; */
      $$ = yy.llmd.newPackage( $1, $2 );
      }
    | BEGIN_CODE EOS CODELINES END_CODE EOS
      { $$ = [$1+$2+$3+$4+($6.length>0?$5:'')]; }
    | LINES -> { data: $1 }
    | EXPR  -> yy.llmd.newExpr( $1 );
    ;

LINES 
    : LINE -> $1
    | EOL -> $1
    ;

CODELINES
    : CODELINE EOS CODELINES
      { $$ = $1+$2+$3; } 
    | EOS CODELINES
    | 
      { $$ = ''; }
    ;


EOS : EOL | EOF;

%%
