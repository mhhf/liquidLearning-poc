/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%x code
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


<*>{EOL}*<<EOF>>           return 'EOF'
<*>{EOL}                   return 'EOL'

<INITIAL>'```'{NEOL}*      { this.begin('code'); return 'BEGIN_CODE'; }
<code>'```'{NEOL}*         { this.popState(); return 'END_CODE'; }
<code>{NEOL}*              { return 'CODELINE'; }

<INITIAL>'{{'{BL}          { this.begin('packagename'); return 'BEGIN_PACKAGE' }
<packagename>\w*           { this.popState(); this.begin('package'); return 'PACKAGENAME' }
<package>'}}'              { this.popState(); return 'END_PACKAGE'; }

/* [todo] - parse json, not lines */
<package,packagecontent>{BL}*'{'           { this.begin('packagecontent'); return 'BRACE_OPEN';  }
<packagecontent>{BL}'}'{BL} { this.popState(); return 'BRACE_CLOSE'; }
<packagecontent>[^{}]*     { return 'PACKAGELINE'; }



'---'{NEOL}*               return 'SLIDE_SEPERATOR'
'???'{NEOL}*               return 'NOTES_SEPERATOR'
{NEOL}*                    return 'LINE'
.                          return 'INVALID'



/lex


%start MDARKDOWN

%% /* language grammar */

MDARKDOWN : SLIDES { return $1; };

SLIDES 
    : SLIDE SLIDE_SEPERATOR EOS SLIDES
      { 
        var slide = [{ 
          from: @1.first_line, 
          to: @1.last_line, 
          md: $1.md, 
          notes: $1.notes
        }];
        $$ = slide.concat( $4 );
      }
    | SLIDE
      { 
        $$ = [{ 
          from: @1.first_line, 
          to: @1.last_line, 
          md: $1.md, 
          notes: $1.notes
          }];
      }
    ;

SLIDE
    : MD NOTES_SEPERATOR OPT_NOTES
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
        $$ = { md: cleanMd($1), notes: $3 }; 
      }
    | MD
      { $$ = { md: $1, notes: [] }; }
    ;

OPT_NOTES
    : EOS NOTES 
      { $$ = $2; }
    | EOS
      { $$ = []; }
    ;

// TODO: fucking extract sentences
NOTES
    : LINE EOS NOTES
      { $$ = [$1].concat($3); }
    | LINE EOS
      { $$ = [$1]; }
    | EOS NOTES
      { $$ = $2; }
    | EOS
      { $$ = []; }
    ;

MD 
    : LINE EOS MD
      { $$ = [$1+($3.length>0?$2:'')].concat($3); }
    | BEGIN_PACKAGE PACKAGENAME PACKAGELINES END_PACKAGE EOS MD
      { $$ = [{ type:"package", name: $2, data: $3 }].concat($6); }
    | BEGIN_CODE EOS CODELINES END_CODE EOS MD
      { $$ = [$1+$2+$3+$4+($6.length>0?$5:'')].concat($6); }
    | EOS MD
      { $$ = [$2.length>0?$1:''].concat($2); }
    |
      { $$ = []; }
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
