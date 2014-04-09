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

RN                    \r\n
EOL 									\r\n|\r|\n        /* end of line character */
NEOL									[^\r\n]	          /* not end of line character */
TB                    [^ \t\r\n]        /* textblock character */
WS                    [\t ]							/* whitespace character */
BL                    ({EOL}*{WS}*)*

%%

/*%token block*/


<*><<EOF>>                 return 'EOF'
<*>{EOL}                   return 'EOL'

<INITIAL>'```'{NEOL}*      { this.begin('code'); return 'BEGIN_CODE'; }
<code>'```'{NEOL}*         { this.popState(); return 'END_CODE'; }
<code>{NEOL}*              { return 'CODELINE'; }

<INITIAL>'{{>'\s*(\w+)     { this.begin('package'); yytext = this.matches[1]; return 'BEGIN_PACKAGE' }
<package>\s*'}}'           { this.popState(); return 'END_PACKAGE'; }


/* [todo] - parse json, not lines */
<package,packagecontent>{BL}*'{'           { this.begin('packagecontent'); return 'BRACE_OPEN';  }
<packagecontent>{BL}'}'{BL}                { this.popState(); return 'BRACE_CLOSE'; }
<packagecontent>[^{}]*                     { return 'PACKAGELINE'; }

<package>\s*([\w\.\=\'\"]+)                    { yytext = this.matches[1]; return 'PARAM'; }             



<INITIAL>'{{#'\s*([\w\?]+)        { this.begin('blockDef'); yytext = this.matches[1]; return 'BLOCK_DEF_START' }
<blockDef>\s+                     /* ignore whitespace in definition */
<blockDef>[\w\?]+                 { return 'PARAM'; }
<blockDef>'}}'{NEOL}*             { this.popState(); this.begin('block'); return 'BEGIN_BLOCK'; }
<block>'{{/'([\w\?]+)'}}'{NEOL}*          { this.popState(); yytext = this.matches[1]; return 'END_BLOCK'; }



<*>{NEOL}*                        return 'LINE'
.                                 return 'INVALID'



/lex


%start MDARKDOWN

%% /* language grammar */

MDARKDOWN: BLOCKS EOF 
         { 
          cleanBlocks = (function( bs ){
            var blocks = [];
            var l;
            if( 0 in bs )
              l = bs[0];
              
            for(var i = 1; i<bs.length; i++) {
              if(bs[i]['md'] && l['md']) {
                l['md'] += bs[i]['md'];
                l.to = bs[i].to;
              } else {
                blocks.push(l)
                l = bs[i];
              }
            }
            if( l )
              blocks.push(l);
            return blocks;
          })
         return cleanBlocks($1); 
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

OPT_PARAMS
    : PARAM OPT_PARAMS
      { 
        var param = $1;
        if(yy.ctx[param]) param = yy.ctx[param];
        $$ = [param].concat($2)
      }
    | 
      { $$ = [] }
    ;

// TODO: parse default blocks
BLOCK
    : BLOCK_DEF_START OPT_PARAMS BEGIN_BLOCK EOS EXP_BLOCK END_BLOCK EOS
      { 
        if( $1 != $END_BLOCK ) {
          throw new Error("blocks don't match");
        }
        $$ = { type: 'block', name: $1, data: $5, opt: $2 };
      }
    | BEGIN_PACKAGE OPT_PARAMS PACKAGELINES END_PACKAGE EOL
      {
      $$ = { type:'pkg', name:$1, opt:$2, data: $3 }; }
    | BEGIN_CODE EOS CODELINES END_CODE EOS
      { $$ = [$1+$2+$3+$4+($6.length>0?$5:'')]; }
    | MD
      {
        cleanMd = (function(arr){
          var o = [];
          var lastStr = "";
          for(var i=0; i<arr.length; i++) {
            if( typeof arr[i] == "string" )
              lastStr += arr[i];
            else {
              if( lastStr != '' ) {
                o.push(lastStr);
                lastStr = '';
              }
              o.push(arr[i]);
            }
          }
          if( lastStr != '' ) o.push(lastStr);
          return o;
        });
      //$$ = { md: cleanMd($1) }; }
      $$ = { md: $1 }; }
    ;


// TODO: fucking extract sentences
EXP_BLOCK
    : LINE EOS EXP_BLOCK
      { $$ = [$1].concat($3); }
    | EOS EXP_BLOCK
      { $$ = $2; }
    | 
      { $$ = []; }
    ;

MD 
    /*: LINE EOL MD*/
    /*  { $$ = [$1+($3.length>0?$2:'')].concat($3); }*/
    : LINE EOL
      { $$ = $1 + $2; }
    /*| EOL MD*/
    /*  { $$ = $2; }*/
    | EOL
      { $$ = $1; }
    ;

// [todo] - parse package name and opt json option
PACKAGELINES 
    : BRACE_OPEN PACKAGELINES BRACE_CLOSE PACKAGELINES
      { $$ = $1+$2+$3+$4; }
    | EOS PACKAGELINES
      { $$ = $1 + $2; }
    | PACKAGELINE PACKAGELINES
      { $$ = $1 + $2; }
    |
      { $$ = ''; }
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
