/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%x code
%x expBlock
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


<*><<EOF>>           return 'EOF'
<*>{EOL}                   return 'EOL'

<INITIAL>'```'{NEOL}*      { this.begin('code'); return 'BEGIN_CODE'; }
<code>'```'{NEOL}*         { this.popState(); return 'END_CODE'; }
<code>{NEOL}*              { return 'CODELINE'; }

<INITIAL>'{{>'{BL}          { this.begin('packagename'); return 'BEGIN_PACKAGE' }
<packagename>\w*           { this.popState(); this.begin('package'); return 'PACKAGENAME' }
<package>\s*'}}'              { this.popState(); return 'END_PACKAGE'; }

/* [todo] - parse json, not lines */
<package,packagecontent>{BL}*'{'           { this.begin('packagecontent'); return 'BRACE_OPEN';  }
<packagecontent>{BL}'}'{BL} { this.popState(); return 'BRACE_CLOSE'; }
<packagecontent>[^{}]*     { return 'PACKAGELINE'; }



<INITIAL>'{{#???}}'{NEOL}*               { this.begin('expBlock'); return 'BEGIN_EXP'; }
<expBlock>'{{/???}}'{NEOL}*     { this.popState(); return 'END_EXP'; }
<*>{NEOL}*                    return 'LINE'
.                          return 'INVALID'



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
        block.from = @1.first_line;
        block.to = @1.last_line;
        $$ = [$1].concat($2); 
      }
    | 
      { $$ = []; }
    ;

BLOCK
    : BEGIN_EXP EOS EXP_BLOCK END_EXP EOS
      { 
        $$ = { exp: $3 };
      }
    | BEGIN_PACKAGE PACKAGENAME PACKAGELINES END_PACKAGE EOL
      { $$ = { package:$2, data: $3 }; }
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
