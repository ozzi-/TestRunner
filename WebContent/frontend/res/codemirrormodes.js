!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror"),require("../xml/xml"),require("../meta")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../xml/xml","../meta"],t):t(CodeMirror)}(function(w){"use strict";w.defineMode("markdown",function(g,m){var d=w.getMode(g,"text/html"),u="null"==d.name;void 0===m.highlightFormatting&&(m.highlightFormatting=!1),void 0===m.maxBlockquoteDepth&&(m.maxBlockquoteDepth=0),void 0===m.taskLists&&(m.taskLists=!1),void 0===m.strikethrough&&(m.strikethrough=!1),void 0===m.emoji&&(m.emoji=!1),void 0===m.fencedCodeBlockHighlighting&&(m.fencedCodeBlockHighlighting=!0),void 0===m.fencedCodeBlockDefaultMode&&(m.fencedCodeBlockDefaultMode="text/plain"),void 0===m.xml&&(m.xml=!0),void 0===m.tokenTypeOverrides&&(m.tokenTypeOverrides={});var t,c={header:"header",code:"comment",quote:"quote",list1:"variable-2",list2:"variable-3",list3:"keyword",hr:"hr",image:"image",imageAltText:"image-alt-text",imageMarker:"image-marker",formatting:"formatting",linkInline:"link",linkEmail:"link",linkText:"link",linkHref:"string",em:"em",strong:"strong",strikethrough:"strikethrough",emoji:"builtin"};for(t in c)c.hasOwnProperty(t)&&m.tokenTypeOverrides[t]&&(c[t]=m.tokenTypeOverrides[t]);var f=/^([*\-_])(?:\s*\1){2,}\s*$/,k=/^(?:[*\-+]|^[0-9]+([.)]))\s+/,F=/^\[(x| )\](?=\s)/i,D=m.allowAtxHeaderWithoutSpace?/^(#+)/:/^(#+)(?: |$)/,p=/^ {0,3}(?:\={1,}|-{2,})\s*$/,i=/^[^#!\[\]*_\\<>` "'(~:]+/,E=/^(~~~+|```+)[ \t]*([\w\/+#-]*)[^\n`]*$/,x=/^\s*\[[^\]]+?\]:.*$/,A=/[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/;function C(t,e,i){return(e.f=e.inline=i)(t,e)}function S(t,e,i){return(e.f=e.block=i)(t,e)}function n(t){var e,i;return t.linkTitle=!1,t.linkHref=!1,t.linkText=!1,t.em=!1,t.strong=!1,t.strikethrough=!1,t.quote=0,t.indentedCode=!1,t.f==v&&((i=u)||(i="xml"==(e=w.innerMode(d,t.htmlState)).mode.name&&null===e.state.tagStart&&!e.state.context&&e.state.tokenize.isInText),i&&(t.f=T,t.block=r,t.htmlState=null)),t.trailingSpace=0,t.trailingSpaceNewLine=!1,t.prevLine=t.thisLine,t.thisLine={stream:null},null}function r(t,e){var i=t.column()===e.indentation,n=!(s=e.prevLine.stream)||!/\S/.test(s.string),u=e.indentedCode,r=e.prevLine.hr,a=!1!==e.list,o=(e.listStack[e.listStack.length-1]||0)+3;e.indentedCode=!1;var l=e.indentation;if(null===e.indentationDiff&&(e.indentationDiff=e.indentation,a)){for(e.list=null;l<e.listStack[e.listStack.length-1];)e.listStack.pop(),e.listStack.length?e.indentation=e.listStack[e.listStack.length-1]:e.list=!1;!1!==e.list&&(e.indentationDiff=l-e.listStack[e.listStack.length-1])}var h=!(n||r||e.prevLine.header||a&&u||e.prevLine.fencedCodeEnd),s=(!1===e.list||r||n)&&e.indentation<=o&&t.match(f),r=null;if(4<=e.indentationDiff&&(u||e.prevLine.fencedCodeEnd||e.prevLine.header||n))return t.skipToEnd(),e.indentedCode=!0,c.code;if(t.eatSpace())return null;if(i&&e.indentation<=o&&(r=t.match(D))&&r[1].length<=6)return e.quote=0,e.header=r[1].length,e.thisLine.header=!0,m.highlightFormatting&&(e.formatting="header"),e.f=e.inline,L(e);if(e.indentation<=o&&t.eat(">"))return e.quote=i?1:e.quote+1,m.highlightFormatting&&(e.formatting="quote"),t.eatSpace(),L(e);if(!s&&!e.setext&&i&&e.indentation<=o&&(r=t.match(k))){n=r[1]?"ol":"ul";return e.indentation=l+t.current().length,e.list=!0,e.quote=0,e.listStack.push(e.indentation),e.em=!1,e.strong=!1,e.code=!1,e.strikethrough=!1,m.taskLists&&t.match(F,!1)&&(e.taskList=!0),e.f=e.inline,m.highlightFormatting&&(e.formatting=["list","list-"+n]),L(e)}return i&&e.indentation<=o&&(r=t.match(E,!0))?(e.quote=0,e.fencedEndRE=new RegExp(r[1]+"+ *$"),e.localMode=m.fencedCodeBlockHighlighting&&(i=r[2]||m.fencedCodeBlockDefaultMode,!w.findModeByName||(o=w.findModeByName(i))&&(i=o.mime||o.mimes[0]),"null"==(i=w.getMode(g,i)).name?null:i),e.localMode&&(e.localState=w.startState(e.localMode)),e.f=e.block=B,m.highlightFormatting&&(e.formatting="code-block"),e.code=-1,L(e)):e.setext||!(h&&a||e.quote||!1!==e.list||e.code||s||x.test(t.string))&&(r=t.lookAhead(1))&&(r=r.match(p))?(e.setext?(e.header=e.setext,e.setext=0,t.skipToEnd(),m.highlightFormatting&&(e.formatting="header")):(e.header="="==r[0].charAt(0)?1:2,e.setext=e.header),e.thisLine.header=!0,e.f=e.inline,L(e)):s?(t.skipToEnd(),e.hr=!0,e.thisLine.hr=!0,c.hr):"["===t.peek()?C(t,e,b):C(t,e,e.inline)}function v(t,e){var i,n=d.token(t,e.htmlState);return u||("xml"==(i=w.innerMode(d,e.htmlState)).mode.name&&null===i.state.tagStart&&!i.state.context&&i.state.tokenize.isInText||e.md_inside&&-1<t.current().indexOf(">"))&&(e.f=T,e.block=r,e.htmlState=null),n}function B(t,e){var i,n=e.listStack[e.listStack.length-1]||0,u=e.indentation<n,n=n+3;return e.fencedEndRE&&e.indentation<=n&&(u||t.match(e.fencedEndRE))?(m.highlightFormatting&&(e.formatting="code-block"),u||(i=L(e)),e.localMode=e.localState=null,e.block=r,e.f=T,e.fencedEndRE=null,e.code=0,e.thisLine.fencedCodeEnd=!0,u?S(t,e,e.block):i):e.localMode?e.localMode.token(t,e.localState):(t.skipToEnd(),c.code)}function L(t){var e,i=[];if(t.formatting){i.push(c.formatting),"string"==typeof t.formatting&&(t.formatting=[t.formatting]);for(var n=0;n<t.formatting.length;n++)i.push(c.formatting+"-"+t.formatting[n]),"header"===t.formatting[n]&&i.push(c.formatting+"-"+t.formatting[n]+"-"+t.header),"quote"===t.formatting[n]&&(!m.maxBlockquoteDepth||m.maxBlockquoteDepth>=t.quote?i.push(c.formatting+"-"+t.formatting[n]+"-"+t.quote):i.push("error"))}return t.taskOpen?i.push("meta"):t.taskClosed?i.push("property"):(t.linkHref?i.push(c.linkHref,"url"):(t.strong&&i.push(c.strong),t.em&&i.push(c.em),t.strikethrough&&i.push(c.strikethrough),t.emoji&&i.push(c.emoji),t.linkText&&i.push(c.linkText),t.code&&i.push(c.code),t.image&&i.push(c.image),t.imageAltText&&i.push(c.imageAltText,"link"),t.imageMarker&&i.push(c.imageMarker)),t.header&&i.push(c.header,c.header+"-"+t.header),t.quote&&(i.push(c.quote),!m.maxBlockquoteDepth||m.maxBlockquoteDepth>=t.quote?i.push(c.quote+"-"+t.quote):i.push(c.quote+"-"+m.maxBlockquoteDepth)),!1!==t.list&&((e=(t.listStack.length-1)%3)?1==e?i.push(c.list2):i.push(c.list3):i.push(c.list1)),t.trailingSpaceNewLine?i.push("trailing-space-new-line"):t.trailingSpace&&i.push("trailing-space-"+(t.trailingSpace%2?"a":"b"))),i.length?i.join(" "):null}function e(t,e){if(t.match(i,!0))return L(e)}function T(t,e){var i=e.text(t,e);if(void 0!==i)return i;if(e.list)return e.list=null,L(e);if(e.taskList)return" "===t.match(F,!0)[1]?e.taskOpen=!0:e.taskClosed=!0,m.highlightFormatting&&(e.formatting="task"),e.taskList=!1,L(e);if(e.taskOpen=!1,e.taskClosed=!1,e.header&&t.match(/^#+$/,!0))return m.highlightFormatting&&(e.formatting="header"),L(e);var n=t.next();if(e.linkTitle){e.linkTitle=!1;i="("===n?")":n,i="^\\s*(?:[^"+(i=(i+"").replace(/([.?*+^\[\]\\(){}|-])/g,"\\$1"))+"\\\\]+|\\\\\\\\|\\\\.)"+i;if(t.match(new RegExp(i),!0))return c.linkHref}if("`"===n){var u=e.formatting;m.highlightFormatting&&(e.formatting="code"),t.eatWhile("`");var r=t.current().length;if(0!=e.code||e.quote&&1!=r){if(r!=e.code)return e.formatting=u,L(e);var a=L(e);return e.code=0,a}return e.code=r,L(e)}if(e.code)return L(e);if("\\"===n&&(t.next(),m.highlightFormatting)){var o=L(e),l=c.formatting+"-escape";return o?o+" "+l:l}if("!"===n&&t.match(/\[[^\]]*\] ?(?:\(|\[)/,!1))return e.imageMarker=!0,e.image=!0,m.highlightFormatting&&(e.formatting="image"),L(e);if("["===n&&e.imageMarker&&t.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/,!1))return e.imageMarker=!1,e.imageAltText=!0,m.highlightFormatting&&(e.formatting="image"),L(e);if("]"===n&&e.imageAltText){m.highlightFormatting&&(e.formatting="image");o=L(e);return e.imageAltText=!1,e.image=!1,e.inline=e.f=q,o}if("["===n&&!e.image)return e.linkText&&t.match(/^.*?\]/)||(e.linkText=!0,m.highlightFormatting&&(e.formatting="link")),L(e);if("]"===n&&e.linkText){m.highlightFormatting&&(e.formatting="link");o=L(e);return e.linkText=!1,e.inline=e.f=t.match(/\(.*?\)| ?\[.*?\]/,!1)?q:T,o}if("<"===n&&t.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/,!1))return e.f=e.inline=M,m.highlightFormatting&&(e.formatting="link"),(o=L(e))?o+=" ":o="",o+c.linkInline;if("<"===n&&t.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/,!1))return e.f=e.inline=M,m.highlightFormatting&&(e.formatting="link"),(o=L(e))?o+=" ":o="",o+c.linkEmail;if(m.xml&&"<"===n&&t.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i,!1)){var h=t.string.indexOf(">",t.pos);return-1!=h&&(g=t.string.substring(t.start,h),/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(g)&&(e.md_inside=!0)),t.backUp(1),e.htmlState=w.startState(d),S(t,e,v)}if(m.xml&&"<"===n&&t.match(/^\/\w*?>/))return e.md_inside=!1,"tag";if("*"===n||"_"===n){for(var s=1,u=1==t.pos?" ":t.string.charAt(t.pos-2);s<3&&t.eat(n);)s++;var r=t.peek()||" ",l=!/\s/.test(r)&&(!A.test(r)||/\s/.test(u)||A.test(u)),o=!/\s/.test(u)&&(!A.test(u)||/\s/.test(r)||A.test(r)),h=null,g=null;if(s%2&&(e.em||!l||"*"!==n&&o&&!A.test(u)?e.em!=n||!o||"*"!==n&&l&&!A.test(r)||(h=!1):h=!0),1<s&&(e.strong||!l||"*"!==n&&o&&!A.test(u)?e.strong!=n||!o||"*"!==n&&l&&!A.test(r)||(g=!1):g=!0),null!=g||null!=h){m.highlightFormatting&&(e.formatting=null==h?"strong":null==g?"em":"strong em"),!0===h&&(e.em=n),!0===g&&(e.strong=n);a=L(e);return!1===h&&(e.em=!1),!1===g&&(e.strong=!1),a}}else if(" "===n&&(t.eat("*")||t.eat("_"))){if(" "===t.peek())return L(e);t.backUp(1)}if(m.strikethrough)if("~"===n&&t.eatWhile(n)){if(e.strikethrough){m.highlightFormatting&&(e.formatting="strikethrough");a=L(e);return e.strikethrough=!1,a}if(t.match(/^[^\s]/,!1))return e.strikethrough=!0,m.highlightFormatting&&(e.formatting="strikethrough"),L(e)}else if(" "===n&&t.match("~~",!0)){if(" "===t.peek())return L(e);t.backUp(2)}if(m.emoji&&":"===n&&t.match(/^(?:[a-z_\d+][a-z_\d+-]*|\-[a-z_\d+][a-z_\d+-]*):/)){e.emoji=!0,m.highlightFormatting&&(e.formatting="emoji");a=L(e);return e.emoji=!1,a}return" "===n&&(t.match(/^ +$/,!1)?e.trailingSpace++:e.trailingSpace&&(e.trailingSpaceNewLine=!0)),L(e)}function M(t,e){if(">"!==t.next())return t.match(/^[^>]+/,!0),c.linkInline;e.f=e.inline=T,m.highlightFormatting&&(e.formatting="link");e=L(e);return e?e+=" ":e="",e+c.linkInline}function q(t,e){if(t.eatSpace())return null;var i,t=t.next();return"("===t||"["===t?(e.f=e.inline=(i="("===t?")":"]",function(t,e){if(t.next()!==i)return t.match(a[i]),e.linkHref=!0,L(e);e.f=e.inline=T,m.highlightFormatting&&(e.formatting="link-string");t=L(e);return e.linkHref=!1,t}),m.highlightFormatting&&(e.formatting="link-string"),e.linkHref=!0,L(e)):"error"}var a={")":/^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,"]":/^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/};function b(t,e){return t.match(/^([^\]\\]|\\.)*\]:/,!1)?(e.f=o,t.next(),m.highlightFormatting&&(e.formatting="link"),e.linkText=!0,L(e)):C(t,e,T)}function o(t,e){if(t.match("]:",!0)){e.f=e.inline=l,m.highlightFormatting&&(e.formatting="link");var i=L(e);return e.linkText=!1,i}return t.match(/^([^\]\\]|\\.)+/,!0),c.linkText}function l(t,e){return t.eatSpace()?null:(t.match(/^[^\s]+/,!0),void 0===t.peek()?e.linkTitle=!0:t.match(/^(?:\s+(?:"(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+'|\((?:[^)\\]|\\.)+\)))?/,!0),e.f=e.inline=T,c.linkHref+" url")}var h={startState:function(){return{f:r,prevLine:{stream:null},thisLine:{stream:null},block:r,htmlState:null,indentation:0,inline:T,text:e,formatting:!1,linkText:!1,linkHref:!1,linkTitle:!1,code:0,em:!1,strong:!1,header:0,setext:0,hr:!1,taskList:!1,list:!1,listStack:[],quote:0,trailingSpace:0,trailingSpaceNewLine:!1,strikethrough:!1,emoji:!1,fencedEndRE:null}},copyState:function(t){return{f:t.f,prevLine:t.prevLine,thisLine:t.thisLine,block:t.block,htmlState:t.htmlState&&w.copyState(d,t.htmlState),indentation:t.indentation,localMode:t.localMode,localState:t.localMode?w.copyState(t.localMode,t.localState):null,inline:t.inline,text:t.text,formatting:!1,linkText:t.linkText,linkTitle:t.linkTitle,linkHref:t.linkHref,code:t.code,em:t.em,strong:t.strong,strikethrough:t.strikethrough,emoji:t.emoji,header:t.header,setext:t.setext,hr:t.hr,taskList:t.taskList,list:t.list,listStack:t.listStack.slice(0),quote:t.quote,indentedCode:t.indentedCode,trailingSpace:t.trailingSpace,trailingSpaceNewLine:t.trailingSpaceNewLine,md_inside:t.md_inside,fencedEndRE:t.fencedEndRE}},token:function(t,e){if(e.formatting=!1,t!=e.thisLine.stream){if(e.header=0,e.hr=!1,t.match(/^\s*$/,!0))return n(e),null;if(e.prevLine=e.thisLine,e.thisLine={stream:t},e.taskList=!1,e.trailingSpace=0,e.trailingSpaceNewLine=!1,!e.localState&&(e.f=e.block,e.f!=v)){var i=t.match(/^\s*/,!0)[0].replace(/\t/g,"    ").length;if(e.indentation=i,e.indentationDiff=null,0<i)return null}}return e.f(t,e)},innerMode:function(t){return t.block==v?{state:t.htmlState,mode:d}:t.localState?{state:t.localState,mode:t.localMode}:{state:t,mode:h}},indent:function(t,e,i){return t.block==v&&d.indent?d.indent(t.htmlState,e,i):t.localState&&t.localMode.indent?t.localMode.indent(t.localState,e,i):w.Pass},blankLine:n,getType:L,blockCommentStart:"\x3c!--",blockCommentEnd:"--\x3e",closeBrackets:"()[]{}''\"\"``",fold:"markdown"};return h},"xml"),w.defineMIME("text/markdown","markdown"),w.defineMIME("text/x-markdown","markdown")});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"), require("../xml/xml"), require("../javascript/javascript"))
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror", "../xml/xml", "../javascript/javascript"], mod)
else // Plain browser env
 mod(CodeMirror)
})(function(CodeMirror) {
"use strict"

// Depth means the amount of open braces in JS context, in XML
// context 0 means not in tag, 1 means in tag, and 2 means in tag
// and js block comment.
function Context(state, mode, depth, prev) {
 this.state = state; this.mode = mode; this.depth = depth; this.prev = prev
}

function copyContext(context) {
 return new Context(CodeMirror.copyState(context.mode, context.state),
                    context.mode,
                    context.depth,
                    context.prev && copyContext(context.prev))
}

CodeMirror.defineMode("jsx", function(config, modeConfig) {
 var xmlMode = CodeMirror.getMode(config, {name: "xml", allowMissing: true, multilineTagIndentPastTag: false, allowMissingTagName: true})
 var jsMode = CodeMirror.getMode(config, modeConfig && modeConfig.base || "javascript")

 function flatXMLIndent(state) {
   var tagName = state.tagName
   state.tagName = null
   var result = xmlMode.indent(state, "", "")
   state.tagName = tagName
   return result
 }

 function token(stream, state) {
   if (state.context.mode == xmlMode)
     return xmlToken(stream, state, state.context)
   else
     return jsToken(stream, state, state.context)
 }

 function xmlToken(stream, state, cx) {
   if (cx.depth == 2) { // Inside a JS /* */ comment
     if (stream.match(/^.*?\*\//)) cx.depth = 1
     else stream.skipToEnd()
     return "comment"
   }

   if (stream.peek() == "{") {
     xmlMode.skipAttribute(cx.state)

     var indent = flatXMLIndent(cx.state), xmlContext = cx.state.context
     // If JS starts on same line as tag
     if (xmlContext && stream.match(/^[^>]*>\s*$/, false)) {
       while (xmlContext.prev && !xmlContext.startOfLine)
         xmlContext = xmlContext.prev
       // If tag starts the line, use XML indentation level
       if (xmlContext.startOfLine) indent -= config.indentUnit
       // Else use JS indentation level
       else if (cx.prev.state.lexical) indent = cx.prev.state.lexical.indented
     // Else if inside of tag
     } else if (cx.depth == 1) {
       indent += config.indentUnit
     }

     state.context = new Context(CodeMirror.startState(jsMode, indent),
                                 jsMode, 0, state.context)
     return null
   }

   if (cx.depth == 1) { // Inside of tag
     if (stream.peek() == "<") { // Tag inside of tag
       xmlMode.skipAttribute(cx.state)
       state.context = new Context(CodeMirror.startState(xmlMode, flatXMLIndent(cx.state)),
                                   xmlMode, 0, state.context)
       return null
     } else if (stream.match("//")) {
       stream.skipToEnd()
       return "comment"
     } else if (stream.match("/*")) {
       cx.depth = 2
       return token(stream, state)
     }
   }

   var style = xmlMode.token(stream, cx.state), cur = stream.current(), stop
   if (/\btag\b/.test(style)) {
     if (/>$/.test(cur)) {
       if (cx.state.context) cx.depth = 0
       else state.context = state.context.prev
     } else if (/^</.test(cur)) {
       cx.depth = 1
     }
   } else if (!style && (stop = cur.indexOf("{")) > -1) {
     stream.backUp(cur.length - stop)
   }
   return style
 }

 function jsToken(stream, state, cx) {
   if (stream.peek() == "<" && jsMode.expressionAllowed(stream, cx.state)) {
     jsMode.skipExpression(cx.state)
     state.context = new Context(CodeMirror.startState(xmlMode, jsMode.indent(cx.state, "", "")),
                                 xmlMode, 0, state.context)
     return null
   }

   var style = jsMode.token(stream, cx.state)
   if (!style && cx.depth != null) {
     var cur = stream.current()
     if (cur == "{") {
       cx.depth++
     } else if (cur == "}") {
       if (--cx.depth == 0) state.context = state.context.prev
     }
   }
   return style
 }

 return {
   startState: function() {
     return {context: new Context(CodeMirror.startState(jsMode), jsMode)}
   },

   copyState: function(state) {
     return {context: copyContext(state.context)}
   },

   token: token,

   indent: function(state, textAfter, fullLine) {
     return state.context.mode.indent(state.context.state, textAfter, fullLine)
   },

   innerMode: function(state) {
     return state.context
   }
 }
}, "xml", "javascript")

CodeMirror.defineMIME("text/jsx", "jsx")
CodeMirror.defineMIME("text/typescript-jsx", {name: "jsx", base: {name: "javascript", typescript: true}})
});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

function Context(indented, column, type, info, align, prev) {
this.indented = indented;
this.column = column;
this.type = type;
this.info = info;
this.align = align;
this.prev = prev;
}
function pushContext(state, col, type, info) {
var indent = state.indented;
if (state.context && state.context.type == "statement" && type != "statement")
 indent = state.context.indented;
return state.context = new Context(indent, col, type, info, null, state.context);
}
function popContext(state) {
var t = state.context.type;
if (t == ")" || t == "]" || t == "}")
 state.indented = state.context.indented;
return state.context = state.context.prev;
}

function typeBefore(stream, state, pos) {
if (state.prevToken == "variable" || state.prevToken == "type") return true;
if (/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(stream.string.slice(0, pos))) return true;
if (state.typeAtEndOfLine && stream.column() == stream.indentation()) return true;
}

function isTopScope(context) {
for (;;) {
 if (!context || context.type == "top") return true;
 if (context.type == "}" && context.prev.info != "namespace") return false;
 context = context.prev;
}
}

CodeMirror.defineMode("clike", function(config, parserConfig) {
var indentUnit = config.indentUnit,
   statementIndentUnit = parserConfig.statementIndentUnit || indentUnit,
   dontAlignCalls = parserConfig.dontAlignCalls,
   keywords = parserConfig.keywords || {},
   types = parserConfig.types || {},
   builtin = parserConfig.builtin || {},
   blockKeywords = parserConfig.blockKeywords || {},
   defKeywords = parserConfig.defKeywords || {},
   atoms = parserConfig.atoms || {},
   hooks = parserConfig.hooks || {},
   multiLineStrings = parserConfig.multiLineStrings,
   indentStatements = parserConfig.indentStatements !== false,
   indentSwitch = parserConfig.indentSwitch !== false,
   namespaceSeparator = parserConfig.namespaceSeparator,
   isPunctuationChar = parserConfig.isPunctuationChar || /[\[\]{}\(\),;\:\.]/,
   numberStart = parserConfig.numberStart || /[\d\.]/,
   number = parserConfig.number || /^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i,
   isOperatorChar = parserConfig.isOperatorChar || /[+\-*&%=<>!?|\/]/,
   isIdentifierChar = parserConfig.isIdentifierChar || /[\w\$_\xa1-\uffff]/,
   // An optional function that takes a {string} token and returns true if it
   // should be treated as a builtin.
   isReservedIdentifier = parserConfig.isReservedIdentifier || false;

var curPunc, isDefKeyword;

function tokenBase(stream, state) {
 var ch = stream.next();
 if (hooks[ch]) {
   var result = hooks[ch](stream, state);
   if (result !== false) return result;
 }
 if (ch == '"' || ch == "'") {
   state.tokenize = tokenString(ch);
   return state.tokenize(stream, state);
 }
 if (numberStart.test(ch)) {
   stream.backUp(1)
   if (stream.match(number)) return "number"
   stream.next()
 }
 if (isPunctuationChar.test(ch)) {
   curPunc = ch;
   return null;
 }
 if (ch == "/") {
   if (stream.eat("*")) {
     state.tokenize = tokenComment;
     return tokenComment(stream, state);
   }
   if (stream.eat("/")) {
     stream.skipToEnd();
     return "comment";
   }
 }
 if (isOperatorChar.test(ch)) {
   while (!stream.match(/^\/[\/*]/, false) && stream.eat(isOperatorChar)) {}
   return "operator";
 }
 stream.eatWhile(isIdentifierChar);
 if (namespaceSeparator) while (stream.match(namespaceSeparator))
   stream.eatWhile(isIdentifierChar);

 var cur = stream.current();
 if (contains(keywords, cur)) {
   if (contains(blockKeywords, cur)) curPunc = "newstatement";
   if (contains(defKeywords, cur)) isDefKeyword = true;
   return "keyword";
 }
 if (contains(types, cur)) return "type";
 if (contains(builtin, cur)
     || (isReservedIdentifier && isReservedIdentifier(cur))) {
   if (contains(blockKeywords, cur)) curPunc = "newstatement";
   return "builtin";
 }
 if (contains(atoms, cur)) return "atom";
 return "variable";
}

function tokenString(quote) {
 return function(stream, state) {
   var escaped = false, next, end = false;
   while ((next = stream.next()) != null) {
     if (next == quote && !escaped) {end = true; break;}
     escaped = !escaped && next == "\\";
   }
   if (end || !(escaped || multiLineStrings))
     state.tokenize = null;
   return "string";
 };
}

function tokenComment(stream, state) {
 var maybeEnd = false, ch;
 while (ch = stream.next()) {
   if (ch == "/" && maybeEnd) {
     state.tokenize = null;
     break;
   }
   maybeEnd = (ch == "*");
 }
 return "comment";
}

function maybeEOL(stream, state) {
 if (parserConfig.typeFirstDefinitions && stream.eol() && isTopScope(state.context))
   state.typeAtEndOfLine = typeBefore(stream, state, stream.pos)
}

// Interface

return {
 startState: function(basecolumn) {
   return {
     tokenize: null,
     context: new Context((basecolumn || 0) - indentUnit, 0, "top", null, false),
     indented: 0,
     startOfLine: true,
     prevToken: null
   };
 },

 token: function(stream, state) {
   var ctx = state.context;
   if (stream.sol()) {
     if (ctx.align == null) ctx.align = false;
     state.indented = stream.indentation();
     state.startOfLine = true;
   }
   if (stream.eatSpace()) { maybeEOL(stream, state); return null; }
   curPunc = isDefKeyword = null;
   var style = (state.tokenize || tokenBase)(stream, state);
   if (style == "comment" || style == "meta") return style;
   if (ctx.align == null) ctx.align = true;

   if (curPunc == ";" || curPunc == ":" || (curPunc == "," && stream.match(/^\s*(?:\/\/.*)?$/, false)))
     while (state.context.type == "statement") popContext(state);
   else if (curPunc == "{") pushContext(state, stream.column(), "}");
   else if (curPunc == "[") pushContext(state, stream.column(), "]");
   else if (curPunc == "(") pushContext(state, stream.column(), ")");
   else if (curPunc == "}") {
     while (ctx.type == "statement") ctx = popContext(state);
     if (ctx.type == "}") ctx = popContext(state);
     while (ctx.type == "statement") ctx = popContext(state);
   }
   else if (curPunc == ctx.type) popContext(state);
   else if (indentStatements &&
            (((ctx.type == "}" || ctx.type == "top") && curPunc != ";") ||
             (ctx.type == "statement" && curPunc == "newstatement"))) {
     pushContext(state, stream.column(), "statement", stream.current());
   }

   if (style == "variable" &&
       ((state.prevToken == "def" ||
         (parserConfig.typeFirstDefinitions && typeBefore(stream, state, stream.start) &&
          isTopScope(state.context) && stream.match(/^\s*\(/, false)))))
     style = "def";

   if (hooks.token) {
     var result = hooks.token(stream, state, style);
     if (result !== undefined) style = result;
   }

   if (style == "def" && parserConfig.styleDefs === false) style = "variable";

   state.startOfLine = false;
   state.prevToken = isDefKeyword ? "def" : style || curPunc;
   maybeEOL(stream, state);
   return style;
 },

 indent: function(state, textAfter) {
   if (state.tokenize != tokenBase && state.tokenize != null || state.typeAtEndOfLine) return CodeMirror.Pass;
   var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
   var closing = firstChar == ctx.type;
   if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
   if (parserConfig.dontIndentStatements)
     while (ctx.type == "statement" && parserConfig.dontIndentStatements.test(ctx.info))
       ctx = ctx.prev
   if (hooks.indent) {
     var hook = hooks.indent(state, ctx, textAfter, indentUnit);
     if (typeof hook == "number") return hook
   }
   var switchBlock = ctx.prev && ctx.prev.info == "switch";
   if (parserConfig.allmanIndentation && /[{(]/.test(firstChar)) {
     while (ctx.type != "top" && ctx.type != "}") ctx = ctx.prev
     return ctx.indented
   }
   if (ctx.type == "statement")
     return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit);
   if (ctx.align && (!dontAlignCalls || ctx.type != ")"))
     return ctx.column + (closing ? 0 : 1);
   if (ctx.type == ")" && !closing)
     return ctx.indented + statementIndentUnit;

   return ctx.indented + (closing ? 0 : indentUnit) +
     (!closing && switchBlock && !/^(?:case|default)\b/.test(textAfter) ? indentUnit : 0);
 },

 electricInput: indentSwitch ? /^\s*(?:case .*?:|default:|\{\}?|\})$/ : /^\s*[{}]$/,
 blockCommentStart: "/*",
 blockCommentEnd: "*/",
 blockCommentContinue: " * ",
 lineComment: "//",
 fold: "brace"
};
});

function words(str) {
 var obj = {}, words = str.split(" ");
 for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
 return obj;
}
function contains(words, word) {
 if (typeof words === "function") {
   return words(word);
 } else {
   return words.propertyIsEnumerable(word);
 }
}
var cKeywords = "auto if break case register continue return default do sizeof " +
 "static else struct switch extern typedef union for goto while enum const " +
 "volatile inline restrict asm fortran";

// Keywords from https://en.cppreference.com/w/cpp/keyword includes C++20.
var cppKeywords = "alignas alignof and and_eq audit axiom bitand bitor catch " +
"class compl concept constexpr const_cast decltype delete dynamic_cast " +
"explicit export final friend import module mutable namespace new noexcept " +
"not not_eq operator or or_eq override private protected public " +
"reinterpret_cast requires static_assert static_cast template this " +
"thread_local throw try typeid typename using virtual xor xor_eq";

var objCKeywords = "bycopy byref in inout oneway out self super atomic nonatomic retain copy " +
"readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd " +
"@interface @implementation @end @protocol @encode @property @synthesize @dynamic @class " +
"@public @package @private @protected @required @optional @try @catch @finally @import " +
"@selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available";

var objCBuiltins = "FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION " +
" NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER " +
"NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION " +
"NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT"

// Do not use this. Use the cTypes function below. This is global just to avoid
// excessive calls when cTypes is being called multiple times during a parse.
var basicCTypes = words("int long char short double float unsigned signed " +
 "void bool");

// Do not use this. Use the objCTypes function below. This is global just to avoid
// excessive calls when objCTypes is being called multiple times during a parse.
var basicObjCTypes = words("SEL instancetype id Class Protocol BOOL");

// Returns true if identifier is a "C" type.
// C type is defined as those that are reserved by the compiler (basicTypes),
// and those that end in _t (Reserved by POSIX for types)
// http://www.gnu.org/software/libc/manual/html_node/Reserved-Names.html
function cTypes(identifier) {
 return contains(basicCTypes, identifier) || /.+_t$/.test(identifier);
}

// Returns true if identifier is a "Objective C" type.
function objCTypes(identifier) {
 return cTypes(identifier) || contains(basicObjCTypes, identifier);
}

var cBlockKeywords = "case do else for if switch while struct enum union";
var cDefKeywords = "struct enum union";

function cppHook(stream, state) {
 if (!state.startOfLine) return false
 for (var ch, next = null; ch = stream.peek();) {
   if (ch == "\\" && stream.match(/^.$/)) {
     next = cppHook
     break
   } else if (ch == "/" && stream.match(/^\/[\/\*]/, false)) {
     break
   }
   stream.next()
 }
 state.tokenize = next
 return "meta"
}

function pointerHook(_stream, state) {
 if (state.prevToken == "type") return "type";
 return false;
}

// For C and C++ (and ObjC): identifiers starting with __
// or _ followed by a capital letter are reserved for the compiler.
function cIsReservedIdentifier(token) {
 if (!token || token.length < 2) return false;
 if (token[0] != '_') return false;
 return (token[1] == '_') || (token[1] !== token[1].toLowerCase());
}

function cpp14Literal(stream) {
 stream.eatWhile(/[\w\.']/);
 return "number";
}

function cpp11StringHook(stream, state) {
 stream.backUp(1);
 // Raw strings.
 if (stream.match(/^(?:R|u8R|uR|UR|LR)/)) {
   var match = stream.match(/^"([^\s\\()]{0,16})\(/);
   if (!match) {
     return false;
   }
   state.cpp11RawStringDelim = match[1];
   state.tokenize = tokenRawString;
   return tokenRawString(stream, state);
 }
 // Unicode strings/chars.
 if (stream.match(/^(?:u8|u|U|L)/)) {
   if (stream.match(/^["']/, /* eat */ false)) {
     return "string";
   }
   return false;
 }
 // Ignore this hook.
 stream.next();
 return false;
}

function cppLooksLikeConstructor(word) {
 var lastTwo = /(\w+)::~?(\w+)$/.exec(word);
 return lastTwo && lastTwo[1] == lastTwo[2];
}

// C#-style strings where "" escapes a quote.
function tokenAtString(stream, state) {
 var next;
 while ((next = stream.next()) != null) {
   if (next == '"' && !stream.eat('"')) {
     state.tokenize = null;
     break;
   }
 }
 return "string";
}

// C++11 raw string literal is <prefix>"<delim>( anything )<delim>", where
// <delim> can be a string up to 16 characters long.
function tokenRawString(stream, state) {
 // Escape characters that have special regex meanings.
 var delim = state.cpp11RawStringDelim.replace(/[^\w\s]/g, '\\$&');
 var match = stream.match(new RegExp(".*?\\)" + delim + '"'));
 if (match)
   state.tokenize = null;
 else
   stream.skipToEnd();
 return "string";
}

function def(mimes, mode) {
 if (typeof mimes == "string") mimes = [mimes];
 var words = [];
 function add(obj) {
   if (obj) for (var prop in obj) if (obj.hasOwnProperty(prop))
     words.push(prop);
 }
 add(mode.keywords);
 add(mode.types);
 add(mode.builtin);
 add(mode.atoms);
 if (words.length) {
   mode.helperType = mimes[0];
   CodeMirror.registerHelper("hintWords", mimes[0], words);
 }

 for (var i = 0; i < mimes.length; ++i)
   CodeMirror.defineMIME(mimes[i], mode);
}

def(["text/x-csrc", "text/x-c", "text/x-chdr"], {
 name: "clike",
 keywords: words(cKeywords),
 types: cTypes,
 blockKeywords: words(cBlockKeywords),
 defKeywords: words(cDefKeywords),
 typeFirstDefinitions: true,
 atoms: words("NULL true false"),
 isReservedIdentifier: cIsReservedIdentifier,
 hooks: {
   "#": cppHook,
   "*": pointerHook,
 },
 modeProps: {fold: ["brace", "include"]}
});

def(["text/x-c++src", "text/x-c++hdr"], {
 name: "clike",
 keywords: words(cKeywords + " " + cppKeywords),
 types: cTypes,
 blockKeywords: words(cBlockKeywords + " class try catch"),
 defKeywords: words(cDefKeywords + " class namespace"),
 typeFirstDefinitions: true,
 atoms: words("true false NULL nullptr"),
 dontIndentStatements: /^template$/,
 isIdentifierChar: /[\w\$_~\xa1-\uffff]/,
 isReservedIdentifier: cIsReservedIdentifier,
 hooks: {
   "#": cppHook,
   "*": pointerHook,
   "u": cpp11StringHook,
   "U": cpp11StringHook,
   "L": cpp11StringHook,
   "R": cpp11StringHook,
   "0": cpp14Literal,
   "1": cpp14Literal,
   "2": cpp14Literal,
   "3": cpp14Literal,
   "4": cpp14Literal,
   "5": cpp14Literal,
   "6": cpp14Literal,
   "7": cpp14Literal,
   "8": cpp14Literal,
   "9": cpp14Literal,
   token: function(stream, state, style) {
     if (style == "variable" && stream.peek() == "(" &&
         (state.prevToken == ";" || state.prevToken == null ||
          state.prevToken == "}") &&
         cppLooksLikeConstructor(stream.current()))
       return "def";
   }
 },
 namespaceSeparator: "::",
 modeProps: {fold: ["brace", "include"]}
});

def("text/x-java", {
 name: "clike",
 keywords: words("abstract assert break case catch class const continue default " +
                 "do else enum extends final finally for goto if implements import " +
                 "instanceof interface native new package private protected public " +
                 "return static strictfp super switch synchronized this throw throws transient " +
                 "try volatile while @interface"),
 types: words("byte short int long float double boolean char void Boolean Byte Character Double Float " +
              "Integer Long Number Object Short String StringBuffer StringBuilder Void"),
 blockKeywords: words("catch class do else finally for if switch try while"),
 defKeywords: words("class interface enum @interface"),
 typeFirstDefinitions: true,
 atoms: words("true false null"),
 number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+\.?\d*|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
 hooks: {
   "@": function(stream) {
     // Don't match the @interface keyword.
     if (stream.match('interface', false)) return false;

     stream.eatWhile(/[\w\$_]/);
     return "meta";
   }
 },
 modeProps: {fold: ["brace", "import"]}
});

def("text/x-csharp", {
 name: "clike",
 keywords: words("abstract as async await base break case catch checked class const continue" +
                 " default delegate do else enum event explicit extern finally fixed for" +
                 " foreach goto if implicit in interface internal is lock namespace new" +
                 " operator out override params private protected public readonly ref return sealed" +
                 " sizeof stackalloc static struct switch this throw try typeof unchecked" +
                 " unsafe using virtual void volatile while add alias ascending descending dynamic from get" +
                 " global group into join let orderby partial remove select set value var yield"),
 types: words("Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func" +
              " Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32" +
              " UInt64 bool byte char decimal double short int long object"  +
              " sbyte float string ushort uint ulong"),
 blockKeywords: words("catch class do else finally for foreach if struct switch try while"),
 defKeywords: words("class interface namespace struct var"),
 typeFirstDefinitions: true,
 atoms: words("true false null"),
 hooks: {
   "@": function(stream, state) {
     if (stream.eat('"')) {
       state.tokenize = tokenAtString;
       return tokenAtString(stream, state);
     }
     stream.eatWhile(/[\w\$_]/);
     return "meta";
   }
 }
});

function tokenTripleString(stream, state) {
 var escaped = false;
 while (!stream.eol()) {
   if (!escaped && stream.match('"""')) {
     state.tokenize = null;
     break;
   }
   escaped = stream.next() == "\\" && !escaped;
 }
 return "string";
}

function tokenNestedComment(depth) {
 return function (stream, state) {
   var ch
   while (ch = stream.next()) {
     if (ch == "*" && stream.eat("/")) {
       if (depth == 1) {
         state.tokenize = null
         break
       } else {
         state.tokenize = tokenNestedComment(depth - 1)
         return state.tokenize(stream, state)
       }
     } else if (ch == "/" && stream.eat("*")) {
       state.tokenize = tokenNestedComment(depth + 1)
       return state.tokenize(stream, state)
     }
   }
   return "comment"
 }
}

def("text/x-scala", {
 name: "clike",
 keywords: words(
   /* scala */
   "abstract case catch class def do else extends final finally for forSome if " +
   "implicit import lazy match new null object override package private protected return " +
   "sealed super this throw trait try type val var while with yield _ " +

   /* package scala */
   "assert assume require print println printf readLine readBoolean readByte readShort " +
   "readChar readInt readLong readFloat readDouble"
 ),
 types: words(
   "AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either " +
   "Enumeration Equiv Error Exception Fractional Function IndexedSeq Int Integral Iterable " +
   "Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering " +
   "Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder " +
   "StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector " +

   /* package java.lang */
   "Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable " +
   "Compiler Double Exception Float Integer Long Math Number Object Package Pair Process " +
   "Runtime Runnable SecurityManager Short StackTraceElement StrictMath String " +
   "StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"
 ),
 multiLineStrings: true,
 blockKeywords: words("catch class enum do else finally for forSome if match switch try while"),
 defKeywords: words("class enum def object package trait type val var"),
 atoms: words("true false null"),
 indentStatements: false,
 indentSwitch: false,
 isOperatorChar: /[+\-*&%=<>!?|\/#:@]/,
 hooks: {
   "@": function(stream) {
     stream.eatWhile(/[\w\$_]/);
     return "meta";
   },
   '"': function(stream, state) {
     if (!stream.match('""')) return false;
     state.tokenize = tokenTripleString;
     return state.tokenize(stream, state);
   },
   "'": function(stream) {
     stream.eatWhile(/[\w\$_\xa1-\uffff]/);
     return "atom";
   },
   "=": function(stream, state) {
     var cx = state.context
     if (cx.type == "}" && cx.align && stream.eat(">")) {
       state.context = new Context(cx.indented, cx.column, cx.type, cx.info, null, cx.prev)
       return "operator"
     } else {
       return false
     }
   },

   "/": function(stream, state) {
     if (!stream.eat("*")) return false
     state.tokenize = tokenNestedComment(1)
     return state.tokenize(stream, state)
   }
 },
 modeProps: {closeBrackets: {pairs: '()[]{}""', triples: '"'}}
});

function tokenKotlinString(tripleString){
 return function (stream, state) {
   var escaped = false, next, end = false;
   while (!stream.eol()) {
     if (!tripleString && !escaped && stream.match('"') ) {end = true; break;}
     if (tripleString && stream.match('"""')) {end = true; break;}
     next = stream.next();
     if(!escaped && next == "$" && stream.match('{'))
       stream.skipTo("}");
     escaped = !escaped && next == "\\" && !tripleString;
   }
   if (end || !tripleString)
     state.tokenize = null;
   return "string";
 }
}

def("text/x-kotlin", {
 name: "clike",
 keywords: words(
   /*keywords*/
   "package as typealias class interface this super val operator " +
   "var fun for is in This throw return annotation " +
   "break continue object if else while do try when !in !is as? " +

   /*soft keywords*/
   "file import where by get set abstract enum open inner override private public internal " +
   "protected catch finally out final vararg reified dynamic companion constructor init " +
   "sealed field property receiver param sparam lateinit data inline noinline tailrec " +
   "external annotation crossinline const operator infix suspend actual expect setparam"
 ),
 types: words(
   /* package java.lang */
   "Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable " +
   "Compiler Double Exception Float Integer Long Math Number Object Package Pair Process " +
   "Runtime Runnable SecurityManager Short StackTraceElement StrictMath String " +
   "StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void Annotation Any BooleanArray " +
   "ByteArray Char CharArray DeprecationLevel DoubleArray Enum FloatArray Function Int IntArray Lazy " +
   "LazyThreadSafetyMode LongArray Nothing ShortArray Unit"
 ),
 intendSwitch: false,
 indentStatements: false,
 multiLineStrings: true,
 number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
 blockKeywords: words("catch class do else finally for if where try while enum"),
 defKeywords: words("class val var object interface fun"),
 atoms: words("true false null this"),
 hooks: {
   "@": function(stream) {
     stream.eatWhile(/[\w\$_]/);
     return "meta";
   },
   '*': function(_stream, state) {
     return state.prevToken == '.' ? 'variable' : 'operator';
   },
   '"': function(stream, state) {
     state.tokenize = tokenKotlinString(stream.match('""'));
     return state.tokenize(stream, state);
   },
   "/": function(stream, state) {
     if (!stream.eat("*")) return false;
     state.tokenize = tokenNestedComment(1);
     return state.tokenize(stream, state)
   },
   indent: function(state, ctx, textAfter, indentUnit) {
     var firstChar = textAfter && textAfter.charAt(0);
     if ((state.prevToken == "}" || state.prevToken == ")") && textAfter == "")
       return state.indented;
     if ((state.prevToken == "operator" && textAfter != "}" && state.context.type != "}") ||
       state.prevToken == "variable" && firstChar == "." ||
       (state.prevToken == "}" || state.prevToken == ")") && firstChar == ".")
       return indentUnit * 2 + ctx.indented;
     if (ctx.align && ctx.type == "}")
       return ctx.indented + (state.context.type == (textAfter || "").charAt(0) ? 0 : indentUnit);
   }
 },
 modeProps: {closeBrackets: {triples: '"'}}
});

def(["x-shader/x-vertex", "x-shader/x-fragment"], {
 name: "clike",
 keywords: words("sampler1D sampler2D sampler3D samplerCube " +
                 "sampler1DShadow sampler2DShadow " +
                 "const attribute uniform varying " +
                 "break continue discard return " +
                 "for while do if else struct " +
                 "in out inout"),
 types: words("float int bool void " +
              "vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 " +
              "mat2 mat3 mat4"),
 blockKeywords: words("for while do if else struct"),
 builtin: words("radians degrees sin cos tan asin acos atan " +
                 "pow exp log exp2 sqrt inversesqrt " +
                 "abs sign floor ceil fract mod min max clamp mix step smoothstep " +
                 "length distance dot cross normalize ftransform faceforward " +
                 "reflect refract matrixCompMult " +
                 "lessThan lessThanEqual greaterThan greaterThanEqual " +
                 "equal notEqual any all not " +
                 "texture1D texture1DProj texture1DLod texture1DProjLod " +
                 "texture2D texture2DProj texture2DLod texture2DProjLod " +
                 "texture3D texture3DProj texture3DLod texture3DProjLod " +
                 "textureCube textureCubeLod " +
                 "shadow1D shadow2D shadow1DProj shadow2DProj " +
                 "shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod " +
                 "dFdx dFdy fwidth " +
                 "noise1 noise2 noise3 noise4"),
 atoms: words("true false " +
             "gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex " +
             "gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 " +
             "gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 " +
             "gl_FogCoord gl_PointCoord " +
             "gl_Position gl_PointSize gl_ClipVertex " +
             "gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor " +
             "gl_TexCoord gl_FogFragCoord " +
             "gl_FragCoord gl_FrontFacing " +
             "gl_FragData gl_FragDepth " +
             "gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix " +
             "gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse " +
             "gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse " +
             "gl_TextureMatrixTranspose gl_ModelViewMatrixInverseTranspose " +
             "gl_ProjectionMatrixInverseTranspose " +
             "gl_ModelViewProjectionMatrixInverseTranspose " +
             "gl_TextureMatrixInverseTranspose " +
             "gl_NormalScale gl_DepthRange gl_ClipPlane " +
             "gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel " +
             "gl_FrontLightModelProduct gl_BackLightModelProduct " +
             "gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ " +
             "gl_FogParameters " +
             "gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords " +
             "gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats " +
             "gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits " +
             "gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits " +
             "gl_MaxDrawBuffers"),
 indentSwitch: false,
 hooks: {"#": cppHook},
 modeProps: {fold: ["brace", "include"]}
});

def("text/x-nesc", {
 name: "clike",
 keywords: words(cKeywords + " as atomic async call command component components configuration event generic " +
                 "implementation includes interface module new norace nx_struct nx_union post provides " +
                 "signal task uses abstract extends"),
 types: cTypes,
 blockKeywords: words(cBlockKeywords),
 atoms: words("null true false"),
 hooks: {"#": cppHook},
 modeProps: {fold: ["brace", "include"]}
});

def("text/x-objectivec", {
 name: "clike",
 keywords: words(cKeywords + " " + objCKeywords),
 types: objCTypes,
 builtin: words(objCBuiltins),
 blockKeywords: words(cBlockKeywords + " @synthesize @try @catch @finally @autoreleasepool @synchronized"),
 defKeywords: words(cDefKeywords + " @interface @implementation @protocol @class"),
 dontIndentStatements: /^@.*$/,
 typeFirstDefinitions: true,
 atoms: words("YES NO NULL Nil nil true false nullptr"),
 isReservedIdentifier: cIsReservedIdentifier,
 hooks: {
   "#": cppHook,
   "*": pointerHook,
 },
 modeProps: {fold: ["brace", "include"]}
});

def("text/x-objectivec++", {
 name: "clike",
 keywords: words(cKeywords + " " + objCKeywords + " " + cppKeywords),
 types: objCTypes,
 builtin: words(objCBuiltins),
 blockKeywords: words(cBlockKeywords + " @synthesize @try @catch @finally @autoreleasepool @synchronized class try catch"),
 defKeywords: words(cDefKeywords + " @interface @implementation @protocol @class class namespace"),
 dontIndentStatements: /^@.*$|^template$/,
 typeFirstDefinitions: true,
 atoms: words("YES NO NULL Nil nil true false nullptr"),
 isReservedIdentifier: cIsReservedIdentifier,
 hooks: {
   "#": cppHook,
   "*": pointerHook,
   "u": cpp11StringHook,
   "U": cpp11StringHook,
   "L": cpp11StringHook,
   "R": cpp11StringHook,
   "0": cpp14Literal,
   "1": cpp14Literal,
   "2": cpp14Literal,
   "3": cpp14Literal,
   "4": cpp14Literal,
   "5": cpp14Literal,
   "6": cpp14Literal,
   "7": cpp14Literal,
   "8": cpp14Literal,
   "9": cpp14Literal,
   token: function(stream, state, style) {
     if (style == "variable" && stream.peek() == "(" &&
         (state.prevToken == ";" || state.prevToken == null ||
          state.prevToken == "}") &&
         cppLooksLikeConstructor(stream.current()))
       return "def";
   }
 },
 namespaceSeparator: "::",
 modeProps: {fold: ["brace", "include"]}
});

def("text/x-squirrel", {
 name: "clike",
 keywords: words("base break clone continue const default delete enum extends function in class" +
                 " foreach local resume return this throw typeof yield constructor instanceof static"),
 types: cTypes,
 blockKeywords: words("case catch class else for foreach if switch try while"),
 defKeywords: words("function local class"),
 typeFirstDefinitions: true,
 atoms: words("true false null"),
 hooks: {"#": cppHook},
 modeProps: {fold: ["brace", "include"]}
});

// Ceylon Strings need to deal with interpolation
var stringTokenizer = null;
function tokenCeylonString(type) {
 return function(stream, state) {
   var escaped = false, next, end = false;
   while (!stream.eol()) {
     if (!escaped && stream.match('"') &&
           (type == "single" || stream.match('""'))) {
       end = true;
       break;
     }
     if (!escaped && stream.match('``')) {
       stringTokenizer = tokenCeylonString(type);
       end = true;
       break;
     }
     next = stream.next();
     escaped = type == "single" && !escaped && next == "\\";
   }
   if (end)
       state.tokenize = null;
   return "string";
 }
}

def("text/x-ceylon", {
 name: "clike",
 keywords: words("abstracts alias assembly assert assign break case catch class continue dynamic else" +
                 " exists extends finally for function given if import in interface is let module new" +
                 " nonempty object of out outer package return satisfies super switch then this throw" +
                 " try value void while"),
 types: function(word) {
     // In Ceylon all identifiers that start with an uppercase are types
     var first = word.charAt(0);
     return (first === first.toUpperCase() && first !== first.toLowerCase());
 },
 blockKeywords: words("case catch class dynamic else finally for function if interface module new object switch try while"),
 defKeywords: words("class dynamic function interface module object package value"),
 builtin: words("abstract actual aliased annotation by default deprecated doc final formal late license" +
                " native optional sealed see serializable shared suppressWarnings tagged throws variable"),
 isPunctuationChar: /[\[\]{}\(\),;\:\.`]/,
 isOperatorChar: /[+\-*&%=<>!?|^~:\/]/,
 numberStart: /[\d#$]/,
 number: /^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,
 multiLineStrings: true,
 typeFirstDefinitions: true,
 atoms: words("true false null larger smaller equal empty finished"),
 indentSwitch: false,
 styleDefs: false,
 hooks: {
   "@": function(stream) {
     stream.eatWhile(/[\w\$_]/);
     return "meta";
   },
   '"': function(stream, state) {
       state.tokenize = tokenCeylonString(stream.match('""') ? "triple" : "single");
       return state.tokenize(stream, state);
     },
   '`': function(stream, state) {
       if (!stringTokenizer || !stream.match('`')) return false;
       state.tokenize = stringTokenizer;
       stringTokenizer = null;
       return state.tokenize(stream, state);
     },
   "'": function(stream) {
     stream.eatWhile(/[\w\$_\xa1-\uffff]/);
     return "atom";
   },
   token: function(_stream, state, style) {
       if ((style == "variable" || style == "type") &&
           state.prevToken == ".") {
         return "variable-2";
       }
     }
 },
 modeProps: {
     fold: ["brace", "import"],
     closeBrackets: {triples: '"'}
 }
});

});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("css", function(config, parserConfig) {
var inline = parserConfig.inline
if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

var indentUnit = config.indentUnit,
   tokenHooks = parserConfig.tokenHooks,
   documentTypes = parserConfig.documentTypes || {},
   mediaTypes = parserConfig.mediaTypes || {},
   mediaFeatures = parserConfig.mediaFeatures || {},
   mediaValueKeywords = parserConfig.mediaValueKeywords || {},
   propertyKeywords = parserConfig.propertyKeywords || {},
   nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
   fontProperties = parserConfig.fontProperties || {},
   counterDescriptors = parserConfig.counterDescriptors || {},
   colorKeywords = parserConfig.colorKeywords || {},
   valueKeywords = parserConfig.valueKeywords || {},
   allowNested = parserConfig.allowNested,
   lineComment = parserConfig.lineComment,
   supportsAtComponent = parserConfig.supportsAtComponent === true,
   highlightNonStandardPropertyKeywords = config.highlightNonStandardPropertyKeywords !== false;

var type, override;
function ret(style, tp) { type = tp; return style; }

// Tokenizers

function tokenBase(stream, state) {
 var ch = stream.next();
 if (tokenHooks[ch]) {
   var result = tokenHooks[ch](stream, state);
   if (result !== false) return result;
 }
 if (ch == "@") {
   stream.eatWhile(/[\w\\\-]/);
   return ret("def", stream.current());
 } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
   return ret(null, "compare");
 } else if (ch == "\"" || ch == "'") {
   state.tokenize = tokenString(ch);
   return state.tokenize(stream, state);
 } else if (ch == "#") {
   stream.eatWhile(/[\w\\\-]/);
   return ret("atom", "hash");
 } else if (ch == "!") {
   stream.match(/^\s*\w*/);
   return ret("keyword", "important");
 } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
   stream.eatWhile(/[\w.%]/);
   return ret("number", "unit");
 } else if (ch === "-") {
   if (/[\d.]/.test(stream.peek())) {
     stream.eatWhile(/[\w.%]/);
     return ret("number", "unit");
   } else if (stream.match(/^-[\w\\\-]*/)) {
     stream.eatWhile(/[\w\\\-]/);
     if (stream.match(/^\s*:/, false))
       return ret("variable-2", "variable-definition");
     return ret("variable-2", "variable");
   } else if (stream.match(/^\w+-/)) {
     return ret("meta", "meta");
   }
 } else if (/[,+>*\/]/.test(ch)) {
   return ret(null, "select-op");
 } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
   return ret("qualifier", "qualifier");
 } else if (/[:;{}\[\]\(\)]/.test(ch)) {
   return ret(null, ch);
 } else if (stream.match(/^[\w-.]+(?=\()/)) {
   if (/^(url(-prefix)?|domain|regexp)$/i.test(stream.current())) {
     state.tokenize = tokenParenthesized;
   }
   return ret("variable callee", "variable");
 } else if (/[\w\\\-]/.test(ch)) {
   stream.eatWhile(/[\w\\\-]/);
   return ret("property", "word");
 } else {
   return ret(null, null);
 }
}

function tokenString(quote) {
 return function(stream, state) {
   var escaped = false, ch;
   while ((ch = stream.next()) != null) {
     if (ch == quote && !escaped) {
       if (quote == ")") stream.backUp(1);
       break;
     }
     escaped = !escaped && ch == "\\";
   }
   if (ch == quote || !escaped && quote != ")") state.tokenize = null;
   return ret("string", "string");
 };
}

function tokenParenthesized(stream, state) {
 stream.next(); // Must be '('
 if (!stream.match(/^\s*[\"\')]/, false))
   state.tokenize = tokenString(")");
 else
   state.tokenize = null;
 return ret(null, "(");
}

// Context management

function Context(type, indent, prev) {
 this.type = type;
 this.indent = indent;
 this.prev = prev;
}

function pushContext(state, stream, type, indent) {
 state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
 return type;
}

function popContext(state) {
 if (state.context.prev)
   state.context = state.context.prev;
 return state.context.type;
}

function pass(type, stream, state) {
 return states[state.context.type](type, stream, state);
}
function popAndPass(type, stream, state, n) {
 for (var i = n || 1; i > 0; i--)
   state.context = state.context.prev;
 return pass(type, stream, state);
}

// Parser

function wordAsValue(stream) {
 var word = stream.current().toLowerCase();
 if (valueKeywords.hasOwnProperty(word))
   override = "atom";
 else if (colorKeywords.hasOwnProperty(word))
   override = "keyword";
 else
   override = "variable";
}

var states = {};

states.top = function(type, stream, state) {
 if (type == "{") {
   return pushContext(state, stream, "block");
 } else if (type == "}" && state.context.prev) {
   return popContext(state);
 } else if (supportsAtComponent && /@component/i.test(type)) {
   return pushContext(state, stream, "atComponentBlock");
 } else if (/^@(-moz-)?document$/i.test(type)) {
   return pushContext(state, stream, "documentTypes");
 } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type)) {
   return pushContext(state, stream, "atBlock");
 } else if (/^@(font-face|counter-style)/i.test(type)) {
   state.stateArg = type;
   return "restricted_atBlock_before";
 } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)) {
   return "keyframes";
 } else if (type && type.charAt(0) == "@") {
   return pushContext(state, stream, "at");
 } else if (type == "hash") {
   override = "builtin";
 } else if (type == "word") {
   override = "tag";
 } else if (type == "variable-definition") {
   return "maybeprop";
 } else if (type == "interpolation") {
   return pushContext(state, stream, "interpolation");
 } else if (type == ":") {
   return "pseudo";
 } else if (allowNested && type == "(") {
   return pushContext(state, stream, "parens");
 }
 return state.context.type;
};

states.block = function(type, stream, state) {
 if (type == "word") {
   var word = stream.current().toLowerCase();
   if (propertyKeywords.hasOwnProperty(word)) {
     override = "property";
     return "maybeprop";
   } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
     override = highlightNonStandardPropertyKeywords ? "string-2" : "property";
     return "maybeprop";
   } else if (allowNested) {
     override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
     return "block";
   } else {
     override += " error";
     return "maybeprop";
   }
 } else if (type == "meta") {
   return "block";
 } else if (!allowNested && (type == "hash" || type == "qualifier")) {
   override = "error";
   return "block";
 } else {
   return states.top(type, stream, state);
 }
};

states.maybeprop = function(type, stream, state) {
 if (type == ":") return pushContext(state, stream, "prop");
 return pass(type, stream, state);
};

states.prop = function(type, stream, state) {
 if (type == ";") return popContext(state);
 if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
 if (type == "}" || type == "{") return popAndPass(type, stream, state);
 if (type == "(") return pushContext(state, stream, "parens");

 if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
   override += " error";
 } else if (type == "word") {
   wordAsValue(stream);
 } else if (type == "interpolation") {
   return pushContext(state, stream, "interpolation");
 }
 return "prop";
};

states.propBlock = function(type, _stream, state) {
 if (type == "}") return popContext(state);
 if (type == "word") { override = "property"; return "maybeprop"; }
 return state.context.type;
};

states.parens = function(type, stream, state) {
 if (type == "{" || type == "}") return popAndPass(type, stream, state);
 if (type == ")") return popContext(state);
 if (type == "(") return pushContext(state, stream, "parens");
 if (type == "interpolation") return pushContext(state, stream, "interpolation");
 if (type == "word") wordAsValue(stream);
 return "parens";
};

states.pseudo = function(type, stream, state) {
 if (type == "meta") return "pseudo";

 if (type == "word") {
   override = "variable-3";
   return state.context.type;
 }
 return pass(type, stream, state);
};

states.documentTypes = function(type, stream, state) {
 if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
   override = "tag";
   return state.context.type;
 } else {
   return states.atBlock(type, stream, state);
 }
};

states.atBlock = function(type, stream, state) {
 if (type == "(") return pushContext(state, stream, "atBlock_parens");
 if (type == "}" || type == ";") return popAndPass(type, stream, state);
 if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");

 if (type == "interpolation") return pushContext(state, stream, "interpolation");

 if (type == "word") {
   var word = stream.current().toLowerCase();
   if (word == "only" || word == "not" || word == "and" || word == "or")
     override = "keyword";
   else if (mediaTypes.hasOwnProperty(word))
     override = "attribute";
   else if (mediaFeatures.hasOwnProperty(word))
     override = "property";
   else if (mediaValueKeywords.hasOwnProperty(word))
     override = "keyword";
   else if (propertyKeywords.hasOwnProperty(word))
     override = "property";
   else if (nonStandardPropertyKeywords.hasOwnProperty(word))
     override = highlightNonStandardPropertyKeywords ? "string-2" : "property";
   else if (valueKeywords.hasOwnProperty(word))
     override = "atom";
   else if (colorKeywords.hasOwnProperty(word))
     override = "keyword";
   else
     override = "error";
 }
 return state.context.type;
};

states.atComponentBlock = function(type, stream, state) {
 if (type == "}")
   return popAndPass(type, stream, state);
 if (type == "{")
   return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
 if (type == "word")
   override = "error";
 return state.context.type;
};

states.atBlock_parens = function(type, stream, state) {
 if (type == ")") return popContext(state);
 if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
 return states.atBlock(type, stream, state);
};

states.restricted_atBlock_before = function(type, stream, state) {
 if (type == "{")
   return pushContext(state, stream, "restricted_atBlock");
 if (type == "word" && state.stateArg == "@counter-style") {
   override = "variable";
   return "restricted_atBlock_before";
 }
 return pass(type, stream, state);
};

states.restricted_atBlock = function(type, stream, state) {
 if (type == "}") {
   state.stateArg = null;
   return popContext(state);
 }
 if (type == "word") {
   if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
       (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
     override = "error";
   else
     override = "property";
   return "maybeprop";
 }
 return "restricted_atBlock";
};

states.keyframes = function(type, stream, state) {
 if (type == "word") { override = "variable"; return "keyframes"; }
 if (type == "{") return pushContext(state, stream, "top");
 return pass(type, stream, state);
};

states.at = function(type, stream, state) {
 if (type == ";") return popContext(state);
 if (type == "{" || type == "}") return popAndPass(type, stream, state);
 if (type == "word") override = "tag";
 else if (type == "hash") override = "builtin";
 return "at";
};

states.interpolation = function(type, stream, state) {
 if (type == "}") return popContext(state);
 if (type == "{" || type == ";") return popAndPass(type, stream, state);
 if (type == "word") override = "variable";
 else if (type != "variable" && type != "(" && type != ")") override = "error";
 return "interpolation";
};

return {
 startState: function(base) {
   return {tokenize: null,
           state: inline ? "block" : "top",
           stateArg: null,
           context: new Context(inline ? "block" : "top", base || 0, null)};
 },

 token: function(stream, state) {
   if (!state.tokenize && stream.eatSpace()) return null;
   var style = (state.tokenize || tokenBase)(stream, state);
   if (style && typeof style == "object") {
     type = style[1];
     style = style[0];
   }
   override = style;
   if (type != "comment")
     state.state = states[state.state](type, stream, state);
   return override;
 },

 indent: function(state, textAfter) {
   var cx = state.context, ch = textAfter && textAfter.charAt(0);
   var indent = cx.indent;
   if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
   if (cx.prev) {
     if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                       cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
       // Resume indentation from parent context.
       cx = cx.prev;
       indent = cx.indent;
     } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
         ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
       // Dedent relative to current context.
       indent = Math.max(0, cx.indent - indentUnit);
     }
   }
   return indent;
 },

 electricChars: "}",
 blockCommentStart: "/*",
 blockCommentEnd: "*/",
 blockCommentContinue: " * ",
 lineComment: lineComment,
 fold: "brace"
};
});

function keySet(array) {
 var keys = {};
 for (var i = 0; i < array.length; ++i) {
   keys[array[i].toLowerCase()] = true;
 }
 return keys;
}

var documentTypes_ = [
 "domain", "regexp", "url", "url-prefix"
], documentTypes = keySet(documentTypes_);

var mediaTypes_ = [
 "all", "aural", "braille", "handheld", "print", "projection", "screen",
 "tty", "tv", "embossed"
], mediaTypes = keySet(mediaTypes_);

var mediaFeatures_ = [
 "width", "min-width", "max-width", "height", "min-height", "max-height",
 "device-width", "min-device-width", "max-device-width", "device-height",
 "min-device-height", "max-device-height", "aspect-ratio",
 "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
 "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
 "max-color", "color-index", "min-color-index", "max-color-index",
 "monochrome", "min-monochrome", "max-monochrome", "resolution",
 "min-resolution", "max-resolution", "scan", "grid", "orientation",
 "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio",
 "pointer", "any-pointer", "hover", "any-hover", "prefers-color-scheme"
], mediaFeatures = keySet(mediaFeatures_);

var mediaValueKeywords_ = [
 "landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover",
 "interlace", "progressive",
 "dark", "light"
], mediaValueKeywords = keySet(mediaValueKeywords_);

var propertyKeywords_ = [
 "align-content", "align-items", "align-self", "alignment-adjust",
 "alignment-baseline", "all", "anchor-point", "animation", "animation-delay",
 "animation-direction", "animation-duration", "animation-fill-mode",
 "animation-iteration-count", "animation-name", "animation-play-state",
 "animation-timing-function", "appearance", "azimuth", "backdrop-filter",
 "backface-visibility", "background", "background-attachment",
 "background-blend-mode", "background-clip", "background-color",
 "background-image", "background-origin", "background-position",
 "background-position-x", "background-position-y", "background-repeat",
 "background-size", "baseline-shift", "binding", "bleed", "block-size",
 "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target",
 "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius",
 "border-bottom-right-radius", "border-bottom-style", "border-bottom-width",
 "border-collapse", "border-color", "border-image", "border-image-outset",
 "border-image-repeat", "border-image-slice", "border-image-source",
 "border-image-width", "border-left", "border-left-color", "border-left-style",
 "border-left-width", "border-radius", "border-right", "border-right-color",
 "border-right-style", "border-right-width", "border-spacing", "border-style",
 "border-top", "border-top-color", "border-top-left-radius",
 "border-top-right-radius", "border-top-style", "border-top-width",
 "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing",
 "break-after", "break-before", "break-inside", "caption-side", "caret-color",
 "clear", "clip", "color", "color-profile", "column-count", "column-fill",
 "column-gap", "column-rule", "column-rule-color", "column-rule-style",
 "column-rule-width", "column-span", "column-width", "columns", "contain",
 "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after",
 "cue-before", "cursor", "direction", "display", "dominant-baseline",
 "drop-initial-after-adjust", "drop-initial-after-align",
 "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size",
 "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position",
 "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow",
 "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into",
 "font", "font-family", "font-feature-settings", "font-kerning",
 "font-language-override", "font-optical-sizing", "font-size",
 "font-size-adjust", "font-stretch", "font-style", "font-synthesis",
 "font-variant", "font-variant-alternates", "font-variant-caps",
 "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric",
 "font-variant-position", "font-variation-settings", "font-weight", "gap",
 "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows",
 "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start",
 "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start",
 "grid-template", "grid-template-areas", "grid-template-columns",
 "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon",
 "image-orientation", "image-rendering", "image-resolution", "inline-box-align",
 "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline",
 "inset-inline-end", "inset-inline-start", "isolation", "justify-content",
 "justify-items", "justify-self", "left", "letter-spacing", "line-break",
 "line-height", "line-height-step", "line-stacking", "line-stacking-ruby",
 "line-stacking-shift", "line-stacking-strategy", "list-style",
 "list-style-image", "list-style-position", "list-style-type", "margin",
 "margin-bottom", "margin-left", "margin-right", "margin-top", "marks",
 "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed",
 "marquee-style", "mask-clip", "mask-composite", "mask-image", "mask-mode",
 "mask-origin", "mask-position", "mask-repeat", "mask-size","mask-type",
 "max-block-size", "max-height", "max-inline-size",
 "max-width", "min-block-size", "min-height", "min-inline-size", "min-width",
 "mix-blend-mode", "move-to", "nav-down", "nav-index", "nav-left", "nav-right",
 "nav-up", "object-fit", "object-position", "offset", "offset-anchor",
 "offset-distance", "offset-path", "offset-position", "offset-rotate",
 "opacity", "order", "orphans", "outline", "outline-color", "outline-offset",
 "outline-style", "outline-width", "overflow", "overflow-style",
 "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom",
 "padding-left", "padding-right", "padding-top", "page", "page-break-after",
 "page-break-before", "page-break-inside", "page-policy", "pause",
 "pause-after", "pause-before", "perspective", "perspective-origin", "pitch",
 "pitch-range", "place-content", "place-items", "place-self", "play-during",
 "position", "presentation-level", "punctuation-trim", "quotes",
 "region-break-after", "region-break-before", "region-break-inside",
 "region-fragment", "rendering-intent", "resize", "rest", "rest-after",
 "rest-before", "richness", "right", "rotate", "rotation", "rotation-point",
 "row-gap", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span",
 "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block",
 "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom",
 "scroll-margin-inline", "scroll-margin-inline-end",
 "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right",
 "scroll-margin-top", "scroll-padding", "scroll-padding-block",
 "scroll-padding-block-end", "scroll-padding-block-start",
 "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end",
 "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right",
 "scroll-padding-top", "scroll-snap-align", "scroll-snap-type",
 "shape-image-threshold", "shape-inside", "shape-margin", "shape-outside",
 "size", "speak", "speak-as", "speak-header", "speak-numeral",
 "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size",
 "table-layout", "target", "target-name", "target-new", "target-position",
 "text-align", "text-align-last", "text-combine-upright", "text-decoration",
 "text-decoration-color", "text-decoration-line", "text-decoration-skip",
 "text-decoration-skip-ink", "text-decoration-style", "text-emphasis",
 "text-emphasis-color", "text-emphasis-position", "text-emphasis-style",
 "text-height", "text-indent", "text-justify", "text-orientation",
 "text-outline", "text-overflow", "text-rendering", "text-shadow",
 "text-size-adjust", "text-space-collapse", "text-transform",
 "text-underline-position", "text-wrap", "top", "touch-action", "transform", "transform-origin",
 "transform-style", "transition", "transition-delay", "transition-duration",
 "transition-property", "transition-timing-function", "translate",
 "unicode-bidi", "user-select", "vertical-align", "visibility", "voice-balance",
 "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate",
 "voice-stress", "voice-volume", "volume", "white-space", "widows", "width",
 "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index",
 // SVG-specific
 "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
 "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
 "color-interpolation", "color-interpolation-filters",
 "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
 "marker", "marker-end", "marker-mid", "marker-start", "paint-order", "shape-rendering", "stroke",
 "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
 "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
 "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
 "glyph-orientation-vertical", "text-anchor", "writing-mode",
], propertyKeywords = keySet(propertyKeywords_);

var nonStandardPropertyKeywords_ = [
 "border-block", "border-block-color", "border-block-end",
 "border-block-end-color", "border-block-end-style", "border-block-end-width",
 "border-block-start", "border-block-start-color", "border-block-start-style",
 "border-block-start-width", "border-block-style", "border-block-width",
 "border-inline", "border-inline-color", "border-inline-end",
 "border-inline-end-color", "border-inline-end-style",
 "border-inline-end-width", "border-inline-start", "border-inline-start-color",
 "border-inline-start-style", "border-inline-start-width",
 "border-inline-style", "border-inline-width", "margin-block",
 "margin-block-end", "margin-block-start", "margin-inline", "margin-inline-end",
 "margin-inline-start", "padding-block", "padding-block-end",
 "padding-block-start", "padding-inline", "padding-inline-end",
 "padding-inline-start", "scroll-snap-stop", "scrollbar-3d-light-color",
 "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color",
 "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color",
 "scrollbar-track-color", "searchfield-cancel-button", "searchfield-decoration",
 "searchfield-results-button", "searchfield-results-decoration", "shape-inside", "zoom"
], nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);

var fontProperties_ = [
 "font-display", "font-family", "src", "unicode-range", "font-variant",
  "font-feature-settings", "font-stretch", "font-weight", "font-style"
], fontProperties = keySet(fontProperties_);

var counterDescriptors_ = [
 "additive-symbols", "fallback", "negative", "pad", "prefix", "range",
 "speak-as", "suffix", "symbols", "system"
], counterDescriptors = keySet(counterDescriptors_);

var colorKeywords_ = [
 "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
 "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
 "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
 "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
 "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
 "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
 "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
 "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
 "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
 "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
 "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
 "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
 "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
 "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
 "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
 "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
 "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
 "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
 "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
 "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
 "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
 "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
 "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
 "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
 "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
 "whitesmoke", "yellow", "yellowgreen"
], colorKeywords = keySet(colorKeywords_);

var valueKeywords_ = [
 "above", "absolute", "activeborder", "additive", "activecaption", "afar",
 "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate",
 "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
 "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page",
 "avoid-region", "axis-pan", "background", "backwards", "baseline", "below", "bidi-override", "binary",
 "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
 "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
 "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
 "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
 "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
 "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
 "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse",
 "compact", "condensed", "contain", "content", "contents",
 "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop",
 "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal",
 "decimal-leading-zero", "default", "default-button", "dense", "destination-atop",
 "destination-in", "destination-out", "destination-over", "devanagari", "difference",
 "disc", "discard", "disclosure-closed", "disclosure-open", "document",
 "dot-dash", "dot-dot-dash",
 "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
 "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
 "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
 "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
 "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
 "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
 "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
 "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig",
 "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed",
 "extra-expanded", "fantasy", "fast", "fill", "fill-box", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes",
 "forwards", "from", "geometricPrecision", "georgian", "graytext", "grid", "groove",
 "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew",
 "help", "hidden", "hide", "higher", "highlight", "highlighttext",
 "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore",
 "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
 "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
 "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert",
 "italic", "japanese-formal", "japanese-informal", "justify", "kannada",
 "katakana", "katakana-iroha", "keep-all", "khmer",
 "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal",
 "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten",
 "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem",
 "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
 "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
 "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "manipulation", "match", "matrix", "matrix3d",
 "media-controls-background", "media-current-time-display",
 "media-fullscreen-button", "media-mute-button", "media-play-button",
 "media-return-to-realtime-button", "media-rewind-button",
 "media-seek-back-button", "media-seek-forward-button", "media-slider",
 "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
 "media-volume-slider-container", "media-volume-sliderthumb", "medium",
 "menu", "menulist", "menulist-button", "menulist-text",
 "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
 "mix", "mongolian", "monospace", "move", "multiple", "multiple_mask_images", "multiply", "myanmar", "n-resize",
 "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
 "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
 "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote",
 "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
 "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
 "painted", "page", "paused", "persian", "perspective", "pinch-zoom", "plus-darker", "plus-lighter",
 "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d",
 "progress", "push-button", "radial-gradient", "radio", "read-only",
 "read-write", "read-write-plaintext-only", "rectangle", "region",
 "relative", "repeat", "repeating-linear-gradient",
 "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse",
 "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY",
 "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running",
 "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen",
 "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield",
 "searchfield-cancel-button", "searchfield-decoration",
 "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end",
 "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
 "simp-chinese-formal", "simp-chinese-informal", "single",
 "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
 "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
 "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali",
 "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square",
 "square-button", "start", "static", "status-bar", "stretch", "stroke", "stroke-box", "sub",
 "subpixel-antialiased", "svg_masks", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table",
 "table-caption", "table-cell", "table-column", "table-column-group",
 "table-footer-group", "table-header-group", "table-row", "table-row-group",
 "tamil",
 "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
 "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
 "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
 "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
 "trad-chinese-formal", "trad-chinese-informal", "transform",
 "translate", "translate3d", "translateX", "translateY", "translateZ",
 "transparent", "ultra-condensed", "ultra-expanded", "underline", "unidirectional-pan", "unset", "up",
 "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
 "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
 "var", "vertical", "vertical-text", "view-box", "visible", "visibleFill", "visiblePainted",
 "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
 "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor",
 "xx-large", "xx-small"
], valueKeywords = keySet(valueKeywords_);

var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_)
 .concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_)
 .concat(valueKeywords_);
CodeMirror.registerHelper("hintWords", "css", allWords);

function tokenCComment(stream, state) {
 var maybeEnd = false, ch;
 while ((ch = stream.next()) != null) {
   if (maybeEnd && ch == "/") {
     state.tokenize = null;
     break;
   }
   maybeEnd = (ch == "*");
 }
 return ["comment", "comment"];
}

CodeMirror.defineMIME("text/css", {
 documentTypes: documentTypes,
 mediaTypes: mediaTypes,
 mediaFeatures: mediaFeatures,
 mediaValueKeywords: mediaValueKeywords,
 propertyKeywords: propertyKeywords,
 nonStandardPropertyKeywords: nonStandardPropertyKeywords,
 fontProperties: fontProperties,
 counterDescriptors: counterDescriptors,
 colorKeywords: colorKeywords,
 valueKeywords: valueKeywords,
 tokenHooks: {
   "/": function(stream, state) {
     if (!stream.eat("*")) return false;
     state.tokenize = tokenCComment;
     return tokenCComment(stream, state);
   }
 },
 name: "css"
});

CodeMirror.defineMIME("text/x-scss", {
 mediaTypes: mediaTypes,
 mediaFeatures: mediaFeatures,
 mediaValueKeywords: mediaValueKeywords,
 propertyKeywords: propertyKeywords,
 nonStandardPropertyKeywords: nonStandardPropertyKeywords,
 colorKeywords: colorKeywords,
 valueKeywords: valueKeywords,
 fontProperties: fontProperties,
 allowNested: true,
 lineComment: "//",
 tokenHooks: {
   "/": function(stream, state) {
     if (stream.eat("/")) {
       stream.skipToEnd();
       return ["comment", "comment"];
     } else if (stream.eat("*")) {
       state.tokenize = tokenCComment;
       return tokenCComment(stream, state);
     } else {
       return ["operator", "operator"];
     }
   },
   ":": function(stream) {
     if (stream.match(/^\s*\{/, false))
       return [null, null]
     return false;
   },
   "$": function(stream) {
     stream.match(/^[\w-]+/);
     if (stream.match(/^\s*:/, false))
       return ["variable-2", "variable-definition"];
     return ["variable-2", "variable"];
   },
   "#": function(stream) {
     if (!stream.eat("{")) return false;
     return [null, "interpolation"];
   }
 },
 name: "css",
 helperType: "scss"
});

CodeMirror.defineMIME("text/x-less", {
 mediaTypes: mediaTypes,
 mediaFeatures: mediaFeatures,
 mediaValueKeywords: mediaValueKeywords,
 propertyKeywords: propertyKeywords,
 nonStandardPropertyKeywords: nonStandardPropertyKeywords,
 colorKeywords: colorKeywords,
 valueKeywords: valueKeywords,
 fontProperties: fontProperties,
 allowNested: true,
 lineComment: "//",
 tokenHooks: {
   "/": function(stream, state) {
     if (stream.eat("/")) {
       stream.skipToEnd();
       return ["comment", "comment"];
     } else if (stream.eat("*")) {
       state.tokenize = tokenCComment;
       return tokenCComment(stream, state);
     } else {
       return ["operator", "operator"];
     }
   },
   "@": function(stream) {
     if (stream.eat("{")) return [null, "interpolation"];
     if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false)) return false;
     stream.eatWhile(/[\w\\\-]/);
     if (stream.match(/^\s*:/, false))
       return ["variable-2", "variable-definition"];
     return ["variable-2", "variable"];
   },
   "&": function() {
     return ["atom", "atom"];
   }
 },
 name: "css",
 helperType: "less"
});

CodeMirror.defineMIME("text/x-gss", {
 documentTypes: documentTypes,
 mediaTypes: mediaTypes,
 mediaFeatures: mediaFeatures,
 propertyKeywords: propertyKeywords,
 nonStandardPropertyKeywords: nonStandardPropertyKeywords,
 fontProperties: fontProperties,
 counterDescriptors: counterDescriptors,
 colorKeywords: colorKeywords,
 valueKeywords: valueKeywords,
 supportsAtComponent: true,
 tokenHooks: {
   "/": function(stream, state) {
     if (!stream.eat("*")) return false;
     state.tokenize = tokenCComment;
     return tokenCComment(stream, state);
   }
 },
 name: "css",
 helperType: "gss"
});

});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

function wordRegexp(words) {
 return new RegExp("^((" + words.join(")|(") + "))\\b");
}

var wordOperators = wordRegexp(["and", "or", "not", "is"]);
var commonKeywords = ["as", "assert", "break", "class", "continue",
                     "def", "del", "elif", "else", "except", "finally",
                     "for", "from", "global", "if", "import",
                     "lambda", "pass", "raise", "return",
                     "try", "while", "with", "yield", "in"];
var commonBuiltins = ["abs", "all", "any", "bin", "bool", "bytearray", "callable", "chr",
                     "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod",
                     "enumerate", "eval", "filter", "float", "format", "frozenset",
                     "getattr", "globals", "hasattr", "hash", "help", "hex", "id",
                     "input", "int", "isinstance", "issubclass", "iter", "len",
                     "list", "locals", "map", "max", "memoryview", "min", "next",
                     "object", "oct", "open", "ord", "pow", "property", "range",
                     "repr", "reversed", "round", "set", "setattr", "slice",
                     "sorted", "staticmethod", "str", "sum", "super", "tuple",
                     "type", "vars", "zip", "__import__", "NotImplemented",
                     "Ellipsis", "__debug__"];
CodeMirror.registerHelper("hintWords", "python", commonKeywords.concat(commonBuiltins));

function top(state) {
 return state.scopes[state.scopes.length - 1];
}

CodeMirror.defineMode("python", function(conf, parserConf) {
 var ERRORCLASS = "error";

 var delimiters = parserConf.delimiters || parserConf.singleDelimiters || /^[\(\)\[\]\{\}@,:`=;\.\\]/;
 //               (Backwards-compatibility with old, cumbersome config system)
 var operators = [parserConf.singleOperators, parserConf.doubleOperators, parserConf.doubleDelimiters, parserConf.tripleDelimiters,
                  parserConf.operators || /^([-+*/%\/&|^]=?|[<>=]+|\/\/=?|\*\*=?|!=|[~!@]|\.\.\.)/]
 for (var i = 0; i < operators.length; i++) if (!operators[i]) operators.splice(i--, 1)

 var hangingIndent = parserConf.hangingIndent || conf.indentUnit;

 var myKeywords = commonKeywords, myBuiltins = commonBuiltins;
 if (parserConf.extra_keywords != undefined)
   myKeywords = myKeywords.concat(parserConf.extra_keywords);

 if (parserConf.extra_builtins != undefined)
   myBuiltins = myBuiltins.concat(parserConf.extra_builtins);

 var py3 = !(parserConf.version && Number(parserConf.version) < 3)
 if (py3) {
   // since http://legacy.python.org/dev/peps/pep-0465/ @ is also an operator
   var identifiers = parserConf.identifiers|| /^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/;
   myKeywords = myKeywords.concat(["nonlocal", "False", "True", "None", "async", "await"]);
   myBuiltins = myBuiltins.concat(["ascii", "bytes", "exec", "print"]);
   var stringPrefixes = new RegExp("^(([rbuf]|(br)|(fr))?('{3}|\"{3}|['\"]))", "i");
 } else {
   var identifiers = parserConf.identifiers|| /^[_A-Za-z][_A-Za-z0-9]*/;
   myKeywords = myKeywords.concat(["exec", "print"]);
   myBuiltins = myBuiltins.concat(["apply", "basestring", "buffer", "cmp", "coerce", "execfile",
                                   "file", "intern", "long", "raw_input", "reduce", "reload",
                                   "unichr", "unicode", "xrange", "False", "True", "None"]);
   var stringPrefixes = new RegExp("^(([rubf]|(ur)|(br))?('{3}|\"{3}|['\"]))", "i");
 }
 var keywords = wordRegexp(myKeywords);
 var builtins = wordRegexp(myBuiltins);

 // tokenizers
 function tokenBase(stream, state) {
   var sol = stream.sol() && state.lastToken != "\\"
   if (sol) state.indent = stream.indentation()
   // Handle scope changes
   if (sol && top(state).type == "py") {
     var scopeOffset = top(state).offset;
     if (stream.eatSpace()) {
       var lineOffset = stream.indentation();
       if (lineOffset > scopeOffset)
         pushPyScope(state);
       else if (lineOffset < scopeOffset && dedent(stream, state) && stream.peek() != "#")
         state.errorToken = true;
       return null;
     } else {
       var style = tokenBaseInner(stream, state);
       if (scopeOffset > 0 && dedent(stream, state))
         style += " " + ERRORCLASS;
       return style;
     }
   }
   return tokenBaseInner(stream, state);
 }

 function tokenBaseInner(stream, state, inFormat) {
   if (stream.eatSpace()) return null;

   // Handle Comments
   if (!inFormat && stream.match(/^#.*/)) return "comment";

   // Handle Number Literals
   if (stream.match(/^[0-9\.]/, false)) {
     var floatLiteral = false;
     // Floats
     if (stream.match(/^[\d_]*\.\d+(e[\+\-]?\d+)?/i)) { floatLiteral = true; }
     if (stream.match(/^[\d_]+\.\d*/)) { floatLiteral = true; }
     if (stream.match(/^\.\d+/)) { floatLiteral = true; }
     if (floatLiteral) {
       // Float literals may be "imaginary"
       stream.eat(/J/i);
       return "number";
     }
     // Integers
     var intLiteral = false;
     // Hex
     if (stream.match(/^0x[0-9a-f_]+/i)) intLiteral = true;
     // Binary
     if (stream.match(/^0b[01_]+/i)) intLiteral = true;
     // Octal
     if (stream.match(/^0o[0-7_]+/i)) intLiteral = true;
     // Decimal
     if (stream.match(/^[1-9][\d_]*(e[\+\-]?[\d_]+)?/)) {
       // Decimal literals may be "imaginary"
       stream.eat(/J/i);
       // TODO - Can you have imaginary longs?
       intLiteral = true;
     }
     // Zero by itself with no other piece of number.
     if (stream.match(/^0(?![\dx])/i)) intLiteral = true;
     if (intLiteral) {
       // Integer literals may be "long"
       stream.eat(/L/i);
       return "number";
     }
   }

   // Handle Strings
   if (stream.match(stringPrefixes)) {
     var isFmtString = stream.current().toLowerCase().indexOf('f') !== -1;
     if (!isFmtString) {
       state.tokenize = tokenStringFactory(stream.current(), state.tokenize);
       return state.tokenize(stream, state);
     } else {
       state.tokenize = formatStringFactory(stream.current(), state.tokenize);
       return state.tokenize(stream, state);
     }
   }

   for (var i = 0; i < operators.length; i++)
     if (stream.match(operators[i])) return "operator"

   if (stream.match(delimiters)) return "punctuation";

   if (state.lastToken == "." && stream.match(identifiers))
     return "property";

   if (stream.match(keywords) || stream.match(wordOperators))
     return "keyword";

   if (stream.match(builtins))
     return "builtin";

   if (stream.match(/^(self|cls)\b/))
     return "variable-2";

   if (stream.match(identifiers)) {
     if (state.lastToken == "def" || state.lastToken == "class")
       return "def";
     return "variable";
   }

   // Handle non-detected items
   stream.next();
   return inFormat ? null :ERRORCLASS;
 }

 function formatStringFactory(delimiter, tokenOuter) {
   while ("rubf".indexOf(delimiter.charAt(0).toLowerCase()) >= 0)
     delimiter = delimiter.substr(1);

   var singleline = delimiter.length == 1;
   var OUTCLASS = "string";

   function tokenNestedExpr(depth) {
     return function(stream, state) {
       var inner = tokenBaseInner(stream, state, true)
       if (inner == "punctuation") {
         if (stream.current() == "{") {
           state.tokenize = tokenNestedExpr(depth + 1)
         } else if (stream.current() == "}") {
           if (depth > 1) state.tokenize = tokenNestedExpr(depth - 1)
           else state.tokenize = tokenString
         }
       }
       return inner
     }
   }

   function tokenString(stream, state) {
     while (!stream.eol()) {
       stream.eatWhile(/[^'"\{\}\\]/);
       if (stream.eat("\\")) {
         stream.next();
         if (singleline && stream.eol())
           return OUTCLASS;
       } else if (stream.match(delimiter)) {
         state.tokenize = tokenOuter;
         return OUTCLASS;
       } else if (stream.match('{{')) {
         // ignore {{ in f-str
         return OUTCLASS;
       } else if (stream.match('{', false)) {
         // switch to nested mode
         state.tokenize = tokenNestedExpr(0)
         if (stream.current()) return OUTCLASS;
         else return state.tokenize(stream, state)
       } else if (stream.match('}}')) {
         return OUTCLASS;
       } else if (stream.match('}')) {
         // single } in f-string is an error
         return ERRORCLASS;
       } else {
         stream.eat(/['"]/);
       }
     }
     if (singleline) {
       if (parserConf.singleLineStringErrors)
         return ERRORCLASS;
       else
         state.tokenize = tokenOuter;
     }
     return OUTCLASS;
   }
   tokenString.isString = true;
   return tokenString;
 }

 function tokenStringFactory(delimiter, tokenOuter) {
   while ("rubf".indexOf(delimiter.charAt(0).toLowerCase()) >= 0)
     delimiter = delimiter.substr(1);

   var singleline = delimiter.length == 1;
   var OUTCLASS = "string";

   function tokenString(stream, state) {
     while (!stream.eol()) {
       stream.eatWhile(/[^'"\\]/);
       if (stream.eat("\\")) {
         stream.next();
         if (singleline && stream.eol())
           return OUTCLASS;
       } else if (stream.match(delimiter)) {
         state.tokenize = tokenOuter;
         return OUTCLASS;
       } else {
         stream.eat(/['"]/);
       }
     }
     if (singleline) {
       if (parserConf.singleLineStringErrors)
         return ERRORCLASS;
       else
         state.tokenize = tokenOuter;
     }
     return OUTCLASS;
   }
   tokenString.isString = true;
   return tokenString;
 }

 function pushPyScope(state) {
   while (top(state).type != "py") state.scopes.pop()
   state.scopes.push({offset: top(state).offset + conf.indentUnit,
                      type: "py",
                      align: null})
 }

 function pushBracketScope(stream, state, type) {
   var align = stream.match(/^[\s\[\{\(]*(?:#|$)/, false) ? null : stream.column() + 1
   state.scopes.push({offset: state.indent + hangingIndent,
                      type: type,
                      align: align})
 }

 function dedent(stream, state) {
   var indented = stream.indentation();
   while (state.scopes.length > 1 && top(state).offset > indented) {
     if (top(state).type != "py") return true;
     state.scopes.pop();
   }
   return top(state).offset != indented;
 }

 function tokenLexer(stream, state) {
   if (stream.sol()) state.beginningOfLine = true;

   var style = state.tokenize(stream, state);
   var current = stream.current();

   // Handle decorators
   if (state.beginningOfLine && current == "@")
     return stream.match(identifiers, false) ? "meta" : py3 ? "operator" : ERRORCLASS;

   if (/\S/.test(current)) state.beginningOfLine = false;

   if ((style == "variable" || style == "builtin")
       && state.lastToken == "meta")
     style = "meta";

   // Handle scope changes.
   if (current == "pass" || current == "return")
     state.dedent += 1;

   if (current == "lambda") state.lambda = true;
   if (current == ":" && !state.lambda && top(state).type == "py")
     pushPyScope(state);

   if (current.length == 1 && !/string|comment/.test(style)) {
     var delimiter_index = "[({".indexOf(current);
     if (delimiter_index != -1)
       pushBracketScope(stream, state, "])}".slice(delimiter_index, delimiter_index+1));

     delimiter_index = "])}".indexOf(current);
     if (delimiter_index != -1) {
       if (top(state).type == current) state.indent = state.scopes.pop().offset - hangingIndent
       else return ERRORCLASS;
     }
   }
   if (state.dedent > 0 && stream.eol() && top(state).type == "py") {
     if (state.scopes.length > 1) state.scopes.pop();
     state.dedent -= 1;
   }

   return style;
 }

 var external = {
   startState: function(basecolumn) {
     return {
       tokenize: tokenBase,
       scopes: [{offset: basecolumn || 0, type: "py", align: null}],
       indent: basecolumn || 0,
       lastToken: null,
       lambda: false,
       dedent: 0
     };
   },

   token: function(stream, state) {
     var addErr = state.errorToken;
     if (addErr) state.errorToken = false;
     var style = tokenLexer(stream, state);

     if (style && style != "comment")
       state.lastToken = (style == "keyword" || style == "punctuation") ? stream.current() : style;
     if (style == "punctuation") style = null;

     if (stream.eol() && state.lambda)
       state.lambda = false;
     return addErr ? style + " " + ERRORCLASS : style;
   },

   indent: function(state, textAfter) {
     if (state.tokenize != tokenBase)
       return state.tokenize.isString ? CodeMirror.Pass : 0;

     var scope = top(state), closing = scope.type == textAfter.charAt(0)
     if (scope.align != null)
       return scope.align - (closing ? 1 : 0)
     else
       return scope.offset - (closing ? hangingIndent : 0)
   },

   electricInput: /^\s*[\}\]\)]$/,
   closeBrackets: {triples: "'\""},
   lineComment: "#",
   fold: "indent"
 };
 return external;
});

CodeMirror.defineMIME("text/x-python", "python");

var words = function(str) { return str.split(" "); };

CodeMirror.defineMIME("text/x-cython", {
 name: "python",
 extra_keywords: words("by cdef cimport cpdef ctypedef enum except "+
                       "extern gil include nogil property public "+
                       "readonly struct union DEF IF ELIF ELSE")
});

});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

//LUA mode. Ported to CodeMirror 2 from Franciszek Wawrzak's
//CodeMirror 1 mode.
//highlights keywords, strings, comments (no leveling supported! ("[==[")), tokens, basic indenting

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("lua", function(config, parserConfig) {
var indentUnit = config.indentUnit;

function prefixRE(words) {
 return new RegExp("^(?:" + words.join("|") + ")", "i");
}
function wordRE(words) {
 return new RegExp("^(?:" + words.join("|") + ")$", "i");
}
var specials = wordRE(parserConfig.specials || []);

// long list of standard functions from lua manual
var builtins = wordRE([
 "_G","_VERSION","assert","collectgarbage","dofile","error","getfenv","getmetatable","ipairs","load",
 "loadfile","loadstring","module","next","pairs","pcall","print","rawequal","rawget","rawset","require",
 "select","setfenv","setmetatable","tonumber","tostring","type","unpack","xpcall",

 "coroutine.create","coroutine.resume","coroutine.running","coroutine.status","coroutine.wrap","coroutine.yield",

 "debug.debug","debug.getfenv","debug.gethook","debug.getinfo","debug.getlocal","debug.getmetatable",
 "debug.getregistry","debug.getupvalue","debug.setfenv","debug.sethook","debug.setlocal","debug.setmetatable",
 "debug.setupvalue","debug.traceback",

 "close","flush","lines","read","seek","setvbuf","write",

 "io.close","io.flush","io.input","io.lines","io.open","io.output","io.popen","io.read","io.stderr","io.stdin",
 "io.stdout","io.tmpfile","io.type","io.write",

 "math.abs","math.acos","math.asin","math.atan","math.atan2","math.ceil","math.cos","math.cosh","math.deg",
 "math.exp","math.floor","math.fmod","math.frexp","math.huge","math.ldexp","math.log","math.log10","math.max",
 "math.min","math.modf","math.pi","math.pow","math.rad","math.random","math.randomseed","math.sin","math.sinh",
 "math.sqrt","math.tan","math.tanh",

 "os.clock","os.date","os.difftime","os.execute","os.exit","os.getenv","os.remove","os.rename","os.setlocale",
 "os.time","os.tmpname",

 "package.cpath","package.loaded","package.loaders","package.loadlib","package.path","package.preload",
 "package.seeall",

 "string.byte","string.char","string.dump","string.find","string.format","string.gmatch","string.gsub",
 "string.len","string.lower","string.match","string.rep","string.reverse","string.sub","string.upper",

 "table.concat","table.insert","table.maxn","table.remove","table.sort"
]);
var keywords = wordRE(["and","break","elseif","false","nil","not","or","return",
                      "true","function", "end", "if", "then", "else", "do",
                      "while", "repeat", "until", "for", "in", "local" ]);

var indentTokens = wordRE(["function", "if","repeat","do", "\\(", "{"]);
var dedentTokens = wordRE(["end", "until", "\\)", "}"]);
var dedentPartial = prefixRE(["end", "until", "\\)", "}", "else", "elseif"]);

function readBracket(stream) {
 var level = 0;
 while (stream.eat("=")) ++level;
 stream.eat("[");
 return level;
}

function normal(stream, state) {
 var ch = stream.next();
 if (ch == "-" && stream.eat("-")) {
   if (stream.eat("[") && stream.eat("["))
     return (state.cur = bracketed(readBracket(stream), "comment"))(stream, state);
   stream.skipToEnd();
   return "comment";
 }
 if (ch == "\"" || ch == "'")
   return (state.cur = string(ch))(stream, state);
 if (ch == "[" && /[\[=]/.test(stream.peek()))
   return (state.cur = bracketed(readBracket(stream), "string"))(stream, state);
 if (/\d/.test(ch)) {
   stream.eatWhile(/[\w.%]/);
   return "number";
 }
 if (/[\w_]/.test(ch)) {
   stream.eatWhile(/[\w\\\-_.]/);
   return "variable";
 }
 return null;
}

function bracketed(level, style) {
 return function(stream, state) {
   var curlev = null, ch;
   while ((ch = stream.next()) != null) {
     if (curlev == null) {if (ch == "]") curlev = 0;}
     else if (ch == "=") ++curlev;
     else if (ch == "]" && curlev == level) { state.cur = normal; break; }
     else curlev = null;
   }
   return style;
 };
}

function string(quote) {
 return function(stream, state) {
   var escaped = false, ch;
   while ((ch = stream.next()) != null) {
     if (ch == quote && !escaped) break;
     escaped = !escaped && ch == "\\";
   }
   if (!escaped) state.cur = normal;
   return "string";
 };
}

return {
 startState: function(basecol) {
   return {basecol: basecol || 0, indentDepth: 0, cur: normal};
 },

 token: function(stream, state) {
   if (stream.eatSpace()) return null;
   var style = state.cur(stream, state);
   var word = stream.current();
   if (style == "variable") {
     if (keywords.test(word)) style = "keyword";
     else if (builtins.test(word)) style = "builtin";
     else if (specials.test(word)) style = "variable-2";
   }
   if ((style != "comment") && (style != "string")){
     if (indentTokens.test(word)) ++state.indentDepth;
     else if (dedentTokens.test(word)) --state.indentDepth;
   }
   return style;
 },

 indent: function(state, textAfter) {
   var closing = dedentPartial.test(textAfter);
   return state.basecol + indentUnit * (state.indentDepth - (closing ? 1 : 0));
 },

 electricInput: /^\s*(?:end|until|else|\)|\})$/,
 lineComment: "--",
 blockCommentStart: "--[[",
 blockCommentEnd: "]]"
};
});

CodeMirror.defineMIME("text/x-lua", "lua");

});

//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"), require("../xml/xml"), require("../javascript/javascript"), require("../css/css"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror", "../xml/xml", "../javascript/javascript", "../css/css"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

var defaultTags = {
 script: [
   ["lang", /(javascript|babel)/i, "javascript"],
   ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"],
   ["type", /./, "text/plain"],
   [null, null, "javascript"]
 ],
 style:  [
   ["lang", /^css$/i, "css"],
   ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
   ["type", /./, "text/plain"],
   [null, null, "css"]
 ]
};

function maybeBackup(stream, pat, style) {
 var cur = stream.current(), close = cur.search(pat);
 if (close > -1) {
   stream.backUp(cur.length - close);
 } else if (cur.match(/<\/?$/)) {
   stream.backUp(cur.length);
   if (!stream.match(pat, false)) stream.match(cur);
 }
 return style;
}

var attrRegexpCache = {};
function getAttrRegexp(attr) {
 var regexp = attrRegexpCache[attr];
 if (regexp) return regexp;
 return attrRegexpCache[attr] = new RegExp("\\s+" + attr + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*");
}

function getAttrValue(text, attr) {
 var match = text.match(getAttrRegexp(attr))
 return match ? /^\s*(.*?)\s*$/.exec(match[2])[1] : ""
}

function getTagRegexp(tagName, anchored) {
 return new RegExp((anchored ? "^" : "") + "<\/\s*" + tagName + "\s*>", "i");
}

function addTags(from, to) {
 for (var tag in from) {
   var dest = to[tag] || (to[tag] = []);
   var source = from[tag];
   for (var i = source.length - 1; i >= 0; i--)
     dest.unshift(source[i])
 }
}

function findMatchingMode(tagInfo, tagText) {
 for (var i = 0; i < tagInfo.length; i++) {
   var spec = tagInfo[i];
   if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];
 }
}

CodeMirror.defineMode("htmlmixed", function (config, parserConfig) {
 var htmlMode = CodeMirror.getMode(config, {
   name: "xml",
   htmlMode: true,
   multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
   multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag,
   allowMissingTagName: parserConfig.allowMissingTagName,
 });

 var tags = {};
 var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
 addTags(defaultTags, tags);
 if (configTags) addTags(configTags, tags);
 if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
   tags.script.unshift(["type", configScript[i].matches, configScript[i].mode])

 function html(stream, state) {
   var style = htmlMode.token(stream, state.htmlState), tag = /\btag\b/.test(style), tagName
   if (tag && !/[<>\s\/]/.test(stream.current()) &&
       (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) &&
       tags.hasOwnProperty(tagName)) {
     state.inTag = tagName + " "
   } else if (state.inTag && tag && />$/.test(stream.current())) {
     var inTag = /^([\S]+) (.*)/.exec(state.inTag)
     state.inTag = null
     var modeSpec = stream.current() == ">" && findMatchingMode(tags[inTag[1]], inTag[2])
     var mode = CodeMirror.getMode(config, modeSpec)
     var endTagA = getTagRegexp(inTag[1], true), endTag = getTagRegexp(inTag[1], false);
     state.token = function (stream, state) {
       if (stream.match(endTagA, false)) {
         state.token = html;
         state.localState = state.localMode = null;
         return null;
       }
       return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));
     };
     state.localMode = mode;
     state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, "", ""));
   } else if (state.inTag) {
     state.inTag += stream.current()
     if (stream.eol()) state.inTag += " "
   }
   return style;
 };

 return {
   startState: function () {
     var state = CodeMirror.startState(htmlMode);
     return {token: html, inTag: null, localMode: null, localState: null, htmlState: state};
   },

   copyState: function (state) {
     var local;
     if (state.localState) {
       local = CodeMirror.copyState(state.localMode, state.localState);
     }
     return {token: state.token, inTag: state.inTag,
             localMode: state.localMode, localState: local,
             htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
   },

   token: function (stream, state) {
     return state.token(stream, state);
   },

   indent: function (state, textAfter, line) {
     if (!state.localMode || /^\s*<\//.test(textAfter))
       return htmlMode.indent(state.htmlState, textAfter, line);
     else if (state.localMode.indent)
       return state.localMode.indent(state.localState, textAfter, line);
     else
       return CodeMirror.Pass;
   },

   innerMode: function (state) {
     return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};
   }
 };
}, "xml", "javascript", "css");

CodeMirror.defineMIME("text/html", "htmlmixed");
});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("groovy", function(config) {
function words(str) {
 var obj = {}, words = str.split(" ");
 for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
 return obj;
}
var keywords = words(
 "abstract as assert boolean break byte case catch char class const continue def default " +
 "do double else enum extends final finally float for goto if implements import in " +
 "instanceof int interface long native new package private protected public return " +
 "short static strictfp super switch synchronized threadsafe throw throws trait transient " +
 "try void volatile while");
var blockKeywords = words("catch class def do else enum finally for if interface switch trait try while");
var standaloneKeywords = words("return break continue");
var atoms = words("null true false this");

var curPunc;
function tokenBase(stream, state) {
 var ch = stream.next();
 if (ch == '"' || ch == "'") {
   return startString(ch, stream, state);
 }
 if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
   curPunc = ch;
   return null;
 }
 if (/\d/.test(ch)) {
   stream.eatWhile(/[\w\.]/);
   if (stream.eat(/eE/)) { stream.eat(/\+\-/); stream.eatWhile(/\d/); }
   return "number";
 }
 if (ch == "/") {
   if (stream.eat("*")) {
     state.tokenize.push(tokenComment);
     return tokenComment(stream, state);
   }
   if (stream.eat("/")) {
     stream.skipToEnd();
     return "comment";
   }
   if (expectExpression(state.lastToken, false)) {
     return startString(ch, stream, state);
   }
 }
 if (ch == "-" && stream.eat(">")) {
   curPunc = "->";
   return null;
 }
 if (/[+\-*&%=<>!?|\/~]/.test(ch)) {
   stream.eatWhile(/[+\-*&%=<>|~]/);
   return "operator";
 }
 stream.eatWhile(/[\w\$_]/);
 if (ch == "@") { stream.eatWhile(/[\w\$_\.]/); return "meta"; }
 if (state.lastToken == ".") return "property";
 if (stream.eat(":")) { curPunc = "proplabel"; return "property"; }
 var cur = stream.current();
 if (atoms.propertyIsEnumerable(cur)) { return "atom"; }
 if (keywords.propertyIsEnumerable(cur)) {
   if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
   else if (standaloneKeywords.propertyIsEnumerable(cur)) curPunc = "standalone";
   return "keyword";
 }
 return "variable";
}
tokenBase.isBase = true;

function startString(quote, stream, state) {
 var tripleQuoted = false;
 if (quote != "/" && stream.eat(quote)) {
   if (stream.eat(quote)) tripleQuoted = true;
   else return "string";
 }
 function t(stream, state) {
   var escaped = false, next, end = !tripleQuoted;
   while ((next = stream.next()) != null) {
     if (next == quote && !escaped) {
       if (!tripleQuoted) { break; }
       if (stream.match(quote + quote)) { end = true; break; }
     }
     if (quote == '"' && next == "$" && !escaped && stream.eat("{")) {
       state.tokenize.push(tokenBaseUntilBrace());
       return "string";
     }
     escaped = !escaped && next == "\\";
   }
   if (end) state.tokenize.pop();
   return "string";
 }
 state.tokenize.push(t);
 return t(stream, state);
}

function tokenBaseUntilBrace() {
 var depth = 1;
 function t(stream, state) {
   if (stream.peek() == "}") {
     depth--;
     if (depth == 0) {
       state.tokenize.pop();
       return state.tokenize[state.tokenize.length-1](stream, state);
     }
   } else if (stream.peek() == "{") {
     depth++;
   }
   return tokenBase(stream, state);
 }
 t.isBase = true;
 return t;
}

function tokenComment(stream, state) {
 var maybeEnd = false, ch;
 while (ch = stream.next()) {
   if (ch == "/" && maybeEnd) {
     state.tokenize.pop();
     break;
   }
   maybeEnd = (ch == "*");
 }
 return "comment";
}

function expectExpression(last, newline) {
 return !last || last == "operator" || last == "->" || /[\.\[\{\(,;:]/.test(last) ||
   last == "newstatement" || last == "keyword" || last == "proplabel" ||
   (last == "standalone" && !newline);
}

function Context(indented, column, type, align, prev) {
 this.indented = indented;
 this.column = column;
 this.type = type;
 this.align = align;
 this.prev = prev;
}
function pushContext(state, col, type) {
 return state.context = new Context(state.indented, col, type, null, state.context);
}
function popContext(state) {
 var t = state.context.type;
 if (t == ")" || t == "]" || t == "}")
   state.indented = state.context.indented;
 return state.context = state.context.prev;
}

// Interface

return {
 startState: function(basecolumn) {
   return {
     tokenize: [tokenBase],
     context: new Context((basecolumn || 0) - config.indentUnit, 0, "top", false),
     indented: 0,
     startOfLine: true,
     lastToken: null
   };
 },

 token: function(stream, state) {
   var ctx = state.context;
   if (stream.sol()) {
     if (ctx.align == null) ctx.align = false;
     state.indented = stream.indentation();
     state.startOfLine = true;
     // Automatic semicolon insertion
     if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) {
       popContext(state); ctx = state.context;
     }
   }
   if (stream.eatSpace()) return null;
   curPunc = null;
   var style = state.tokenize[state.tokenize.length-1](stream, state);
   if (style == "comment") return style;
   if (ctx.align == null) ctx.align = true;

   if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
   // Handle indentation for {x -> \n ... }
   else if (curPunc == "->" && ctx.type == "statement" && ctx.prev.type == "}") {
     popContext(state);
     state.context.align = false;
   }
   else if (curPunc == "{") pushContext(state, stream.column(), "}");
   else if (curPunc == "[") pushContext(state, stream.column(), "]");
   else if (curPunc == "(") pushContext(state, stream.column(), ")");
   else if (curPunc == "}") {
     while (ctx.type == "statement") ctx = popContext(state);
     if (ctx.type == "}") ctx = popContext(state);
     while (ctx.type == "statement") ctx = popContext(state);
   }
   else if (curPunc == ctx.type) popContext(state);
   else if (ctx.type == "}" || ctx.type == "top" || (ctx.type == "statement" && curPunc == "newstatement"))
     pushContext(state, stream.column(), "statement");
   state.startOfLine = false;
   state.lastToken = curPunc || style;
   return style;
 },

 indent: function(state, textAfter) {
   if (!state.tokenize[state.tokenize.length-1].isBase) return CodeMirror.Pass;
   var firstChar = textAfter && textAfter.charAt(0), ctx = state.context;
   if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) ctx = ctx.prev;
   var closing = firstChar == ctx.type;
   if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : config.indentUnit);
   else if (ctx.align) return ctx.column + (closing ? 0 : 1);
   else return ctx.indented + (closing ? 0 : config.indentUnit);
 },

 electricChars: "{}",
 closeBrackets: {triples: "'\""},
 fold: "brace",
 blockCommentStart: "/*",
 blockCommentEnd: "*/",
 lineComment: "//"
};
});

CodeMirror.defineMIME("text/x-groovy", "groovy");

});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

//CodeMirror2 mode/perl/perl.js (text/x-perl) beta 0.10 (2011-11-08)
//This is a part of CodeMirror from https://github.com/sabaca/CodeMirror_mode_perl (mail@sabaca.com)

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("perl",function(){
     // http://perldoc.perl.org
     var PERL={                                      //   null - magic touch
                                                     //   1 - keyword
                                                     //   2 - def
                                                     //   3 - atom
                                                     //   4 - operator
                                                     //   5 - variable-2 (predefined)
                                                     //   [x,y] - x=1,2,3; y=must be defined if x{...}
                                             //      PERL operators
             '->'                            :   4,
             '++'                            :   4,
             '--'                            :   4,
             '**'                            :   4,
                                                     //   ! ~ \ and unary + and -
             '=~'                            :   4,
             '!~'                            :   4,
             '*'                             :   4,
             '/'                             :   4,
             '%'                             :   4,
             'x'                             :   4,
             '+'                             :   4,
             '-'                             :   4,
             '.'                             :   4,
             '<<'                            :   4,
             '>>'                            :   4,
                                                     //   named unary operators
             '<'                             :   4,
             '>'                             :   4,
             '<='                            :   4,
             '>='                            :   4,
             'lt'                            :   4,
             'gt'                            :   4,
             'le'                            :   4,
             'ge'                            :   4,
             '=='                            :   4,
             '!='                            :   4,
             '<=>'                           :   4,
             'eq'                            :   4,
             'ne'                            :   4,
             'cmp'                           :   4,
             '~~'                            :   4,
             '&'                             :   4,
             '|'                             :   4,
             '^'                             :   4,
             '&&'                            :   4,
             '||'                            :   4,
             '//'                            :   4,
             '..'                            :   4,
             '...'                           :   4,
             '?'                             :   4,
             ':'                             :   4,
             '='                             :   4,
             '+='                            :   4,
             '-='                            :   4,
             '*='                            :   4,  //   etc. ???
             ','                             :   4,
             '=>'                            :   4,
             '::'                            :   4,
                                                     //   list operators (rightward)
             'not'                           :   4,
             'and'                           :   4,
             'or'                            :   4,
             'xor'                           :   4,
                                             //      PERL predefined variables (I know, what this is a paranoid idea, but may be needed for people, who learn PERL, and for me as well, ...and may be for you?;)
             'BEGIN'                         :   [5,1],
             'END'                           :   [5,1],
             'PRINT'                         :   [5,1],
             'PRINTF'                        :   [5,1],
             'GETC'                          :   [5,1],
             'READ'                          :   [5,1],
             'READLINE'                      :   [5,1],
             'DESTROY'                       :   [5,1],
             'TIE'                           :   [5,1],
             'TIEHANDLE'                     :   [5,1],
             'UNTIE'                         :   [5,1],
             'STDIN'                         :    5,
             'STDIN_TOP'                     :    5,
             'STDOUT'                        :    5,
             'STDOUT_TOP'                    :    5,
             'STDERR'                        :    5,
             'STDERR_TOP'                    :    5,
             '$ARG'                          :    5,
             '$_'                            :    5,
             '@ARG'                          :    5,
             '@_'                            :    5,
             '$LIST_SEPARATOR'               :    5,
             '$"'                            :    5,
             '$PROCESS_ID'                   :    5,
             '$PID'                          :    5,
             '$$'                            :    5,
             '$REAL_GROUP_ID'                :    5,
             '$GID'                          :    5,
             '$('                            :    5,
             '$EFFECTIVE_GROUP_ID'           :    5,
             '$EGID'                         :    5,
             '$)'                            :    5,
             '$PROGRAM_NAME'                 :    5,
             '$0'                            :    5,
             '$SUBSCRIPT_SEPARATOR'          :    5,
             '$SUBSEP'                       :    5,
             '$;'                            :    5,
             '$REAL_USER_ID'                 :    5,
             '$UID'                          :    5,
             '$<'                            :    5,
             '$EFFECTIVE_USER_ID'            :    5,
             '$EUID'                         :    5,
             '$>'                            :    5,
             '$a'                            :    5,
             '$b'                            :    5,
             '$COMPILING'                    :    5,
             '$^C'                           :    5,
             '$DEBUGGING'                    :    5,
             '$^D'                           :    5,
             '${^ENCODING}'                  :    5,
             '$ENV'                          :    5,
             '%ENV'                          :    5,
             '$SYSTEM_FD_MAX'                :    5,
             '$^F'                           :    5,
             '@F'                            :    5,
             '${^GLOBAL_PHASE}'              :    5,
             '$^H'                           :    5,
             '%^H'                           :    5,
             '@INC'                          :    5,
             '%INC'                          :    5,
             '$INPLACE_EDIT'                 :    5,
             '$^I'                           :    5,
             '$^M'                           :    5,
             '$OSNAME'                       :    5,
             '$^O'                           :    5,
             '${^OPEN}'                      :    5,
             '$PERLDB'                       :    5,
             '$^P'                           :    5,
             '$SIG'                          :    5,
             '%SIG'                          :    5,
             '$BASETIME'                     :    5,
             '$^T'                           :    5,
             '${^TAINT}'                     :    5,
             '${^UNICODE}'                   :    5,
             '${^UTF8CACHE}'                 :    5,
             '${^UTF8LOCALE}'                :    5,
             '$PERL_VERSION'                 :    5,
             '$^V'                           :    5,
             '${^WIN32_SLOPPY_STAT}'         :    5,
             '$EXECUTABLE_NAME'              :    5,
             '$^X'                           :    5,
             '$1'                            :    5, // - regexp $1, $2...
             '$MATCH'                        :    5,
             '$&'                            :    5,
             '${^MATCH}'                     :    5,
             '$PREMATCH'                     :    5,
             '$`'                            :    5,
             '${^PREMATCH}'                  :    5,
             '$POSTMATCH'                    :    5,
             "$'"                            :    5,
             '${^POSTMATCH}'                 :    5,
             '$LAST_PAREN_MATCH'             :    5,
             '$+'                            :    5,
             '$LAST_SUBMATCH_RESULT'         :    5,
             '$^N'                           :    5,
             '@LAST_MATCH_END'               :    5,
             '@+'                            :    5,
             '%LAST_PAREN_MATCH'             :    5,
             '%+'                            :    5,
             '@LAST_MATCH_START'             :    5,
             '@-'                            :    5,
             '%LAST_MATCH_START'             :    5,
             '%-'                            :    5,
             '$LAST_REGEXP_CODE_RESULT'      :    5,
             '$^R'                           :    5,
             '${^RE_DEBUG_FLAGS}'            :    5,
             '${^RE_TRIE_MAXBUF}'            :    5,
             '$ARGV'                         :    5,
             '@ARGV'                         :    5,
             'ARGV'                          :    5,
             'ARGVOUT'                       :    5,
             '$OUTPUT_FIELD_SEPARATOR'       :    5,
             '$OFS'                          :    5,
             '$,'                            :    5,
             '$INPUT_LINE_NUMBER'            :    5,
             '$NR'                           :    5,
             '$.'                            :    5,
             '$INPUT_RECORD_SEPARATOR'       :    5,
             '$RS'                           :    5,
             '$/'                            :    5,
             '$OUTPUT_RECORD_SEPARATOR'      :    5,
             '$ORS'                          :    5,
             '$\\'                           :    5,
             '$OUTPUT_AUTOFLUSH'             :    5,
             '$|'                            :    5,
             '$ACCUMULATOR'                  :    5,
             '$^A'                           :    5,
             '$FORMAT_FORMFEED'              :    5,
             '$^L'                           :    5,
             '$FORMAT_PAGE_NUMBER'           :    5,
             '$%'                            :    5,
             '$FORMAT_LINES_LEFT'            :    5,
             '$-'                            :    5,
             '$FORMAT_LINE_BREAK_CHARACTERS' :    5,
             '$:'                            :    5,
             '$FORMAT_LINES_PER_PAGE'        :    5,
             '$='                            :    5,
             '$FORMAT_TOP_NAME'              :    5,
             '$^'                            :    5,
             '$FORMAT_NAME'                  :    5,
             '$~'                            :    5,
             '${^CHILD_ERROR_NATIVE}'        :    5,
             '$EXTENDED_OS_ERROR'            :    5,
             '$^E'                           :    5,
             '$EXCEPTIONS_BEING_CAUGHT'      :    5,
             '$^S'                           :    5,
             '$WARNING'                      :    5,
             '$^W'                           :    5,
             '${^WARNING_BITS}'              :    5,
             '$OS_ERROR'                     :    5,
             '$ERRNO'                        :    5,
             '$!'                            :    5,
             '%OS_ERROR'                     :    5,
             '%ERRNO'                        :    5,
             '%!'                            :    5,
             '$CHILD_ERROR'                  :    5,
             '$?'                            :    5,
             '$EVAL_ERROR'                   :    5,
             '$@'                            :    5,
             '$OFMT'                         :    5,
             '$#'                            :    5,
             '$*'                            :    5,
             '$ARRAY_BASE'                   :    5,
             '$['                            :    5,
             '$OLD_PERL_VERSION'             :    5,
             '$]'                            :    5,
                                             //      PERL blocks
             'if'                            :[1,1],
             elsif                           :[1,1],
             'else'                          :[1,1],
             'while'                         :[1,1],
             unless                          :[1,1],
             'for'                           :[1,1],
             foreach                         :[1,1],
                                             //      PERL functions
             'abs'                           :1,     // - absolute value function
             accept                          :1,     // - accept an incoming socket connect
             alarm                           :1,     // - schedule a SIGALRM
             'atan2'                         :1,     // - arctangent of Y/X in the range -PI to PI
             bind                            :1,     // - binds an address to a socket
             binmode                         :1,     // - prepare binary files for I/O
             bless                           :1,     // - create an object
             bootstrap                       :1,     //
             'break'                         :1,     // - break out of a "given" block
             caller                          :1,     // - get context of the current subroutine call
             chdir                           :1,     // - change your current working directory
             chmod                           :1,     // - changes the permissions on a list of files
             chomp                           :1,     // - remove a trailing record separator from a string
             chop                            :1,     // - remove the last character from a string
             chown                           :1,     // - change the ownership on a list of files
             chr                             :1,     // - get character this number represents
             chroot                          :1,     // - make directory new root for path lookups
             close                           :1,     // - close file (or pipe or socket) handle
             closedir                        :1,     // - close directory handle
             connect                         :1,     // - connect to a remote socket
             'continue'                      :[1,1], // - optional trailing block in a while or foreach
             'cos'                           :1,     // - cosine function
             crypt                           :1,     // - one-way passwd-style encryption
             dbmclose                        :1,     // - breaks binding on a tied dbm file
             dbmopen                         :1,     // - create binding on a tied dbm file
             'default'                       :1,     //
             defined                         :1,     // - test whether a value, variable, or function is defined
             'delete'                        :1,     // - deletes a value from a hash
             die                             :1,     // - raise an exception or bail out
             'do'                            :1,     // - turn a BLOCK into a TERM
             dump                            :1,     // - create an immediate core dump
             each                            :1,     // - retrieve the next key/value pair from a hash
             endgrent                        :1,     // - be done using group file
             endhostent                      :1,     // - be done using hosts file
             endnetent                       :1,     // - be done using networks file
             endprotoent                     :1,     // - be done using protocols file
             endpwent                        :1,     // - be done using passwd file
             endservent                      :1,     // - be done using services file
             eof                             :1,     // - test a filehandle for its end
             'eval'                          :1,     // - catch exceptions or compile and run code
             'exec'                          :1,     // - abandon this program to run another
             exists                          :1,     // - test whether a hash key is present
             exit                            :1,     // - terminate this program
             'exp'                           :1,     // - raise I to a power
             fcntl                           :1,     // - file control system call
             fileno                          :1,     // - return file descriptor from filehandle
             flock                           :1,     // - lock an entire file with an advisory lock
             fork                            :1,     // - create a new process just like this one
             format                          :1,     // - declare a picture format with use by the write() function
             formline                        :1,     // - internal function used for formats
             getc                            :1,     // - get the next character from the filehandle
             getgrent                        :1,     // - get next group record
             getgrgid                        :1,     // - get group record given group user ID
             getgrnam                        :1,     // - get group record given group name
             gethostbyaddr                   :1,     // - get host record given its address
             gethostbyname                   :1,     // - get host record given name
             gethostent                      :1,     // - get next hosts record
             getlogin                        :1,     // - return who logged in at this tty
             getnetbyaddr                    :1,     // - get network record given its address
             getnetbyname                    :1,     // - get networks record given name
             getnetent                       :1,     // - get next networks record
             getpeername                     :1,     // - find the other end of a socket connection
             getpgrp                         :1,     // - get process group
             getppid                         :1,     // - get parent process ID
             getpriority                     :1,     // - get current nice value
             getprotobyname                  :1,     // - get protocol record given name
             getprotobynumber                :1,     // - get protocol record numeric protocol
             getprotoent                     :1,     // - get next protocols record
             getpwent                        :1,     // - get next passwd record
             getpwnam                        :1,     // - get passwd record given user login name
             getpwuid                        :1,     // - get passwd record given user ID
             getservbyname                   :1,     // - get services record given its name
             getservbyport                   :1,     // - get services record given numeric port
             getservent                      :1,     // - get next services record
             getsockname                     :1,     // - retrieve the sockaddr for a given socket
             getsockopt                      :1,     // - get socket options on a given socket
             given                           :1,     //
             glob                            :1,     // - expand filenames using wildcards
             gmtime                          :1,     // - convert UNIX time into record or string using Greenwich time
             'goto'                          :1,     // - create spaghetti code
             grep                            :1,     // - locate elements in a list test true against a given criterion
             hex                             :1,     // - convert a string to a hexadecimal number
             'import'                        :1,     // - patch a module's namespace into your own
             index                           :1,     // - find a substring within a string
             'int'                           :1,     // - get the integer portion of a number
             ioctl                           :1,     // - system-dependent device control system call
             'join'                          :1,     // - join a list into a string using a separator
             keys                            :1,     // - retrieve list of indices from a hash
             kill                            :1,     // - send a signal to a process or process group
             last                            :1,     // - exit a block prematurely
             lc                              :1,     // - return lower-case version of a string
             lcfirst                         :1,     // - return a string with just the next letter in lower case
             length                          :1,     // - return the number of bytes in a string
             'link'                          :1,     // - create a hard link in the filesystem
             listen                          :1,     // - register your socket as a server
             local                           : 2,    // - create a temporary value for a global variable (dynamic scoping)
             localtime                       :1,     // - convert UNIX time into record or string using local time
             lock                            :1,     // - get a thread lock on a variable, subroutine, or method
             'log'                           :1,     // - retrieve the natural logarithm for a number
             lstat                           :1,     // - stat a symbolic link
             m                               :null,  // - match a string with a regular expression pattern
             map                             :1,     // - apply a change to a list to get back a new list with the changes
             mkdir                           :1,     // - create a directory
             msgctl                          :1,     // - SysV IPC message control operations
             msgget                          :1,     // - get SysV IPC message queue
             msgrcv                          :1,     // - receive a SysV IPC message from a message queue
             msgsnd                          :1,     // - send a SysV IPC message to a message queue
             my                              : 2,    // - declare and assign a local variable (lexical scoping)
             'new'                           :1,     //
             next                            :1,     // - iterate a block prematurely
             no                              :1,     // - unimport some module symbols or semantics at compile time
             oct                             :1,     // - convert a string to an octal number
             open                            :1,     // - open a file, pipe, or descriptor
             opendir                         :1,     // - open a directory
             ord                             :1,     // - find a character's numeric representation
             our                             : 2,    // - declare and assign a package variable (lexical scoping)
             pack                            :1,     // - convert a list into a binary representation
             'package'                       :1,     // - declare a separate global namespace
             pipe                            :1,     // - open a pair of connected filehandles
             pop                             :1,     // - remove the last element from an array and return it
             pos                             :1,     // - find or set the offset for the last/next m//g search
             print                           :1,     // - output a list to a filehandle
             printf                          :1,     // - output a formatted list to a filehandle
             prototype                       :1,     // - get the prototype (if any) of a subroutine
             push                            :1,     // - append one or more elements to an array
             q                               :null,  // - singly quote a string
             qq                              :null,  // - doubly quote a string
             qr                              :null,  // - Compile pattern
             quotemeta                       :null,  // - quote regular expression magic characters
             qw                              :null,  // - quote a list of words
             qx                              :null,  // - backquote quote a string
             rand                            :1,     // - retrieve the next pseudorandom number
             read                            :1,     // - fixed-length buffered input from a filehandle
             readdir                         :1,     // - get a directory from a directory handle
             readline                        :1,     // - fetch a record from a file
             readlink                        :1,     // - determine where a symbolic link is pointing
             readpipe                        :1,     // - execute a system command and collect standard output
             recv                            :1,     // - receive a message over a Socket
             redo                            :1,     // - start this loop iteration over again
             ref                             :1,     // - find out the type of thing being referenced
             rename                          :1,     // - change a filename
             require                         :1,     // - load in external functions from a library at runtime
             reset                           :1,     // - clear all variables of a given name
             'return'                        :1,     // - get out of a function early
             reverse                         :1,     // - flip a string or a list
             rewinddir                       :1,     // - reset directory handle
             rindex                          :1,     // - right-to-left substring search
             rmdir                           :1,     // - remove a directory
             s                               :null,  // - replace a pattern with a string
             say                             :1,     // - print with newline
             scalar                          :1,     // - force a scalar context
             seek                            :1,     // - reposition file pointer for random-access I/O
             seekdir                         :1,     // - reposition directory pointer
             select                          :1,     // - reset default output or do I/O multiplexing
             semctl                          :1,     // - SysV semaphore control operations
             semget                          :1,     // - get set of SysV semaphores
             semop                           :1,     // - SysV semaphore operations
             send                            :1,     // - send a message over a socket
             setgrent                        :1,     // - prepare group file for use
             sethostent                      :1,     // - prepare hosts file for use
             setnetent                       :1,     // - prepare networks file for use
             setpgrp                         :1,     // - set the process group of a process
             setpriority                     :1,     // - set a process's nice value
             setprotoent                     :1,     // - prepare protocols file for use
             setpwent                        :1,     // - prepare passwd file for use
             setservent                      :1,     // - prepare services file for use
             setsockopt                      :1,     // - set some socket options
             shift                           :1,     // - remove the first element of an array, and return it
             shmctl                          :1,     // - SysV shared memory operations
             shmget                          :1,     // - get SysV shared memory segment identifier
             shmread                         :1,     // - read SysV shared memory
             shmwrite                        :1,     // - write SysV shared memory
             shutdown                        :1,     // - close down just half of a socket connection
             'sin'                           :1,     // - return the sine of a number
             sleep                           :1,     // - block for some number of seconds
             socket                          :1,     // - create a socket
             socketpair                      :1,     // - create a pair of sockets
             'sort'                          :1,     // - sort a list of values
             splice                          :1,     // - add or remove elements anywhere in an array
             'split'                         :1,     // - split up a string using a regexp delimiter
             sprintf                         :1,     // - formatted print into a string
             'sqrt'                          :1,     // - square root function
             srand                           :1,     // - seed the random number generator
             stat                            :1,     // - get a file's status information
             state                           :1,     // - declare and assign a state variable (persistent lexical scoping)
             study                           :1,     // - optimize input data for repeated searches
             'sub'                           :1,     // - declare a subroutine, possibly anonymously
             'substr'                        :1,     // - get or alter a portion of a string
             symlink                         :1,     // - create a symbolic link to a file
             syscall                         :1,     // - execute an arbitrary system call
             sysopen                         :1,     // - open a file, pipe, or descriptor
             sysread                         :1,     // - fixed-length unbuffered input from a filehandle
             sysseek                         :1,     // - position I/O pointer on handle used with sysread and syswrite
             system                          :1,     // - run a separate program
             syswrite                        :1,     // - fixed-length unbuffered output to a filehandle
             tell                            :1,     // - get current seekpointer on a filehandle
             telldir                         :1,     // - get current seekpointer on a directory handle
             tie                             :1,     // - bind a variable to an object class
             tied                            :1,     // - get a reference to the object underlying a tied variable
             time                            :1,     // - return number of seconds since 1970
             times                           :1,     // - return elapsed time for self and child processes
             tr                              :null,  // - transliterate a string
             truncate                        :1,     // - shorten a file
             uc                              :1,     // - return upper-case version of a string
             ucfirst                         :1,     // - return a string with just the next letter in upper case
             umask                           :1,     // - set file creation mode mask
             undef                           :1,     // - remove a variable or function definition
             unlink                          :1,     // - remove one link to a file
             unpack                          :1,     // - convert binary structure into normal perl variables
             unshift                         :1,     // - prepend more elements to the beginning of a list
             untie                           :1,     // - break a tie binding to a variable
             use                             :1,     // - load in a module at compile time
             utime                           :1,     // - set a file's last access and modify times
             values                          :1,     // - return a list of the values in a hash
             vec                             :1,     // - test or set particular bits in a string
             wait                            :1,     // - wait for any child process to die
             waitpid                         :1,     // - wait for a particular child process to die
             wantarray                       :1,     // - get void vs scalar vs list context of current subroutine call
             warn                            :1,     // - print debugging info
             when                            :1,     //
             write                           :1,     // - print a picture record
             y                               :null}; // - transliterate a string

     var RXstyle="string-2";
     var RXmodifiers=/[goseximacplud]/;              // NOTE: "m", "s", "y" and "tr" need to correct real modifiers for each regexp type

     function tokenChain(stream,state,chain,style,tail){     // NOTE: chain.length > 2 is not working now (it's for s[...][...]geos;)
             state.chain=null;                               //                                                          12   3tail
             state.style=null;
             state.tail=null;
             state.tokenize=function(stream,state){
                     var e=false,c,i=0;
                     while(c=stream.next()){
                             if(c===chain[i]&&!e){
                                     if(chain[++i]!==undefined){
                                             state.chain=chain[i];
                                             state.style=style;
                                             state.tail=tail;}
                                     else if(tail)
                                             stream.eatWhile(tail);
                                     state.tokenize=tokenPerl;
                                     return style;}
                             e=!e&&c=="\\";}
                     return style;};
             return state.tokenize(stream,state);}

     function tokenSOMETHING(stream,state,string){
             state.tokenize=function(stream,state){
                     if(stream.string==string)
                             state.tokenize=tokenPerl;
                     stream.skipToEnd();
                     return "string";};
             return state.tokenize(stream,state);}

     function tokenPerl(stream,state){
             if(stream.eatSpace())
                     return null;
             if(state.chain)
                     return tokenChain(stream,state,state.chain,state.style,state.tail);
             if(stream.match(/^\-?[\d\.]/,false))
                     if(stream.match(/^(\-?(\d*\.\d+(e[+-]?\d+)?|\d+\.\d*)|0x[\da-fA-F]+|0b[01]+|\d+(e[+-]?\d+)?)/))
                             return 'number';
             if(stream.match(/^<<(?=[_a-zA-Z])/)){                  // NOTE: <<SOMETHING\n...\nSOMETHING\n
                     stream.eatWhile(/\w/);
                     return tokenSOMETHING(stream,state,stream.current().substr(2));}
             if(stream.sol()&&stream.match(/^\=item(?!\w)/)){// NOTE: \n=item...\n=cut\n
                     return tokenSOMETHING(stream,state,'=cut');}
             var ch=stream.next();
             if(ch=='"'||ch=="'"){                           // NOTE: ' or " or <<'SOMETHING'\n...\nSOMETHING\n or <<"SOMETHING"\n...\nSOMETHING\n
                     if(prefix(stream, 3)=="<<"+ch){
                             var p=stream.pos;
                             stream.eatWhile(/\w/);
                             var n=stream.current().substr(1);
                             if(n&&stream.eat(ch))
                                     return tokenSOMETHING(stream,state,n);
                             stream.pos=p;}
                     return tokenChain(stream,state,[ch],"string");}
             if(ch=="q"){
                     var c=look(stream, -2);
                     if(!(c&&/\w/.test(c))){
                             c=look(stream, 0);
                             if(c=="x"){
                                     c=look(stream, 1);
                                     if(c=="("){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[")"],RXstyle,RXmodifiers);}
                                     if(c=="["){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["]"],RXstyle,RXmodifiers);}
                                     if(c=="{"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["}"],RXstyle,RXmodifiers);}
                                     if(c=="<"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[">"],RXstyle,RXmodifiers);}
                                     if(/[\^'"!~\/]/.test(c)){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,[stream.eat(c)],RXstyle,RXmodifiers);}}
                             else if(c=="q"){
                                     c=look(stream, 1);
                                     if(c=="("){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[")"],"string");}
                                     if(c=="["){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["]"],"string");}
                                     if(c=="{"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["}"],"string");}
                                     if(c=="<"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[">"],"string");}
                                     if(/[\^'"!~\/]/.test(c)){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,[stream.eat(c)],"string");}}
                             else if(c=="w"){
                                     c=look(stream, 1);
                                     if(c=="("){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[")"],"bracket");}
                                     if(c=="["){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["]"],"bracket");}
                                     if(c=="{"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["}"],"bracket");}
                                     if(c=="<"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[">"],"bracket");}
                                     if(/[\^'"!~\/]/.test(c)){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,[stream.eat(c)],"bracket");}}
                             else if(c=="r"){
                                     c=look(stream, 1);
                                     if(c=="("){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[")"],RXstyle,RXmodifiers);}
                                     if(c=="["){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["]"],RXstyle,RXmodifiers);}
                                     if(c=="{"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,["}"],RXstyle,RXmodifiers);}
                                     if(c=="<"){
                                             eatSuffix(stream, 2);
                                             return tokenChain(stream,state,[">"],RXstyle,RXmodifiers);}
                                     if(/[\^'"!~\/]/.test(c)){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,[stream.eat(c)],RXstyle,RXmodifiers);}}
                             else if(/[\^'"!~\/(\[{<]/.test(c)){
                                     if(c=="("){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,[")"],"string");}
                                     if(c=="["){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,["]"],"string");}
                                     if(c=="{"){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,["}"],"string");}
                                     if(c=="<"){
                                             eatSuffix(stream, 1);
                                             return tokenChain(stream,state,[">"],"string");}
                                     if(/[\^'"!~\/]/.test(c)){
                                             return tokenChain(stream,state,[stream.eat(c)],"string");}}}}
             if(ch=="m"){
                     var c=look(stream, -2);
                     if(!(c&&/\w/.test(c))){
                             c=stream.eat(/[(\[{<\^'"!~\/]/);
                             if(c){
                                     if(/[\^'"!~\/]/.test(c)){
                                             return tokenChain(stream,state,[c],RXstyle,RXmodifiers);}
                                     if(c=="("){
                                             return tokenChain(stream,state,[")"],RXstyle,RXmodifiers);}
                                     if(c=="["){
                                             return tokenChain(stream,state,["]"],RXstyle,RXmodifiers);}
                                     if(c=="{"){
                                             return tokenChain(stream,state,["}"],RXstyle,RXmodifiers);}
                                     if(c=="<"){
                                             return tokenChain(stream,state,[">"],RXstyle,RXmodifiers);}}}}
             if(ch=="s"){
                     var c=/[\/>\]})\w]/.test(look(stream, -2));
                     if(!c){
                             c=stream.eat(/[(\[{<\^'"!~\/]/);
                             if(c){
                                     if(c=="[")
                                             return tokenChain(stream,state,["]","]"],RXstyle,RXmodifiers);
                                     if(c=="{")
                                             return tokenChain(stream,state,["}","}"],RXstyle,RXmodifiers);
                                     if(c=="<")
                                             return tokenChain(stream,state,[">",">"],RXstyle,RXmodifiers);
                                     if(c=="(")
                                             return tokenChain(stream,state,[")",")"],RXstyle,RXmodifiers);
                                     return tokenChain(stream,state,[c,c],RXstyle,RXmodifiers);}}}
             if(ch=="y"){
                     var c=/[\/>\]})\w]/.test(look(stream, -2));
                     if(!c){
                             c=stream.eat(/[(\[{<\^'"!~\/]/);
                             if(c){
                                     if(c=="[")
                                             return tokenChain(stream,state,["]","]"],RXstyle,RXmodifiers);
                                     if(c=="{")
                                             return tokenChain(stream,state,["}","}"],RXstyle,RXmodifiers);
                                     if(c=="<")
                                             return tokenChain(stream,state,[">",">"],RXstyle,RXmodifiers);
                                     if(c=="(")
                                             return tokenChain(stream,state,[")",")"],RXstyle,RXmodifiers);
                                     return tokenChain(stream,state,[c,c],RXstyle,RXmodifiers);}}}
             if(ch=="t"){
                     var c=/[\/>\]})\w]/.test(look(stream, -2));
                     if(!c){
                             c=stream.eat("r");if(c){
                             c=stream.eat(/[(\[{<\^'"!~\/]/);
                             if(c){
                                     if(c=="[")
                                             return tokenChain(stream,state,["]","]"],RXstyle,RXmodifiers);
                                     if(c=="{")
                                             return tokenChain(stream,state,["}","}"],RXstyle,RXmodifiers);
                                     if(c=="<")
                                             return tokenChain(stream,state,[">",">"],RXstyle,RXmodifiers);
                                     if(c=="(")
                                             return tokenChain(stream,state,[")",")"],RXstyle,RXmodifiers);
                                     return tokenChain(stream,state,[c,c],RXstyle,RXmodifiers);}}}}
             if(ch=="`"){
                     return tokenChain(stream,state,[ch],"variable-2");}
             if(ch=="/"){
                     if(!/~\s*$/.test(prefix(stream)))
                             return "operator";
                     else
                             return tokenChain(stream,state,[ch],RXstyle,RXmodifiers);}
             if(ch=="$"){
                     var p=stream.pos;
                     if(stream.eatWhile(/\d/)||stream.eat("{")&&stream.eatWhile(/\d/)&&stream.eat("}"))
                             return "variable-2";
                     else
                             stream.pos=p;}
             if(/[$@%]/.test(ch)){
                     var p=stream.pos;
                     if(stream.eat("^")&&stream.eat(/[A-Z]/)||!/[@$%&]/.test(look(stream, -2))&&stream.eat(/[=|\\\-#?@;:&`~\^!\[\]*'"$+.,\/<>()]/)){
                             var c=stream.current();
                             if(PERL[c])
                                     return "variable-2";}
                     stream.pos=p;}
             if(/[$@%&]/.test(ch)){
                     if(stream.eatWhile(/[\w$]/)||stream.eat("{")&&stream.eatWhile(/[\w$]/)&&stream.eat("}")){
                             var c=stream.current();
                             if(PERL[c])
                                     return "variable-2";
                             else
                                     return "variable";}}
             if(ch=="#"){
                     if(look(stream, -2)!="$"){
                             stream.skipToEnd();
                             return "comment";}}
             if(/[:+\-\^*$&%@=<>!?|\/~\.]/.test(ch)){
                     var p=stream.pos;
                     stream.eatWhile(/[:+\-\^*$&%@=<>!?|\/~\.]/);
                     if(PERL[stream.current()])
                             return "operator";
                     else
                             stream.pos=p;}
             if(ch=="_"){
                     if(stream.pos==1){
                             if(suffix(stream, 6)=="_END__"){
                                     return tokenChain(stream,state,['\0'],"comment");}
                             else if(suffix(stream, 7)=="_DATA__"){
                                     return tokenChain(stream,state,['\0'],"variable-2");}
                             else if(suffix(stream, 7)=="_C__"){
                                     return tokenChain(stream,state,['\0'],"string");}}}
             if(/\w/.test(ch)){
                     var p=stream.pos;
                     if(look(stream, -2)=="{"&&(look(stream, 0)=="}"||stream.eatWhile(/\w/)&&look(stream, 0)=="}"))
                             return "string";
                     else
                             stream.pos=p;}
             if(/[A-Z]/.test(ch)){
                     var l=look(stream, -2);
                     var p=stream.pos;
                     stream.eatWhile(/[A-Z_]/);
                     if(/[\da-z]/.test(look(stream, 0))){
                             stream.pos=p;}
                     else{
                             var c=PERL[stream.current()];
                             if(!c)
                                     return "meta";
                             if(c[1])
                                     c=c[0];
                             if(l!=":"){
                                     if(c==1)
                                             return "keyword";
                                     else if(c==2)
                                             return "def";
                                     else if(c==3)
                                             return "atom";
                                     else if(c==4)
                                             return "operator";
                                     else if(c==5)
                                             return "variable-2";
                                     else
                                             return "meta";}
                             else
                                     return "meta";}}
             if(/[a-zA-Z_]/.test(ch)){
                     var l=look(stream, -2);
                     stream.eatWhile(/\w/);
                     var c=PERL[stream.current()];
                     if(!c)
                             return "meta";
                     if(c[1])
                             c=c[0];
                     if(l!=":"){
                             if(c==1)
                                     return "keyword";
                             else if(c==2)
                                     return "def";
                             else if(c==3)
                                     return "atom";
                             else if(c==4)
                                     return "operator";
                             else if(c==5)
                                     return "variable-2";
                             else
                                     return "meta";}
                     else
                             return "meta";}
             return null;}

     return {
         startState: function() {
             return {
                 tokenize: tokenPerl,
                 chain: null,
                 style: null,
                 tail: null
             };
         },
         token: function(stream, state) {
             return (state.tokenize || tokenPerl)(stream, state);
         },
         lineComment: '#'
     };
});

CodeMirror.registerHelper("wordChars", "perl", /[\w$]/);

CodeMirror.defineMIME("text/x-perl", "perl");

//it's like "peek", but need for look-ahead or look-behind if index < 0
function look(stream, c){
return stream.string.charAt(stream.pos+(c||0));
}

//return a part of prefix of current stream from current position
function prefix(stream, c){
if(c){
 var x=stream.pos-c;
 return stream.string.substr((x>=0?x:0),c);}
else{
 return stream.string.substr(0,stream.pos-1);
}
}

//return a part of suffix of current stream from current position
function suffix(stream, c){
var y=stream.string.length;
var x=y-stream.pos+1;
return stream.string.substr(stream.pos,(c&&c<y?c:x));
}

//eating and vomiting a part of stream from current position
function eatSuffix(stream, c){
var x=stream.pos+c;
var y;
if(x<=0)
 stream.pos=0;
else if(x>=(y=stream.string.length-1))
 stream.pos=y;
else
 stream.pos=x;
}

});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"), require("../htmlmixed/htmlmixed"), require("../clike/clike"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror", "../htmlmixed/htmlmixed", "../clike/clike"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

function keywords(str) {
 var obj = {}, words = str.split(" ");
 for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
 return obj;
}

// Helper for phpString
function matchSequence(list, end, escapes) {
 if (list.length == 0) return phpString(end);
 return function (stream, state) {
   var patterns = list[0];
   for (var i = 0; i < patterns.length; i++) if (stream.match(patterns[i][0])) {
     state.tokenize = matchSequence(list.slice(1), end);
     return patterns[i][1];
   }
   state.tokenize = phpString(end, escapes);
   return "string";
 };
}
function phpString(closing, escapes) {
 return function(stream, state) { return phpString_(stream, state, closing, escapes); };
}
function phpString_(stream, state, closing, escapes) {
 // "Complex" syntax
 if (escapes !== false && stream.match("${", false) || stream.match("{$", false)) {
   state.tokenize = null;
   return "string";
 }

 // Simple syntax
 if (escapes !== false && stream.match(/^\$[a-zA-Z_][a-zA-Z0-9_]*/)) {
   // After the variable name there may appear array or object operator.
   if (stream.match("[", false)) {
     // Match array operator
     state.tokenize = matchSequence([
       [["[", null]],
       [[/\d[\w\.]*/, "number"],
        [/\$[a-zA-Z_][a-zA-Z0-9_]*/, "variable-2"],
        [/[\w\$]+/, "variable"]],
       [["]", null]]
     ], closing, escapes);
   }
   if (stream.match(/^->\w/, false)) {
     // Match object operator
     state.tokenize = matchSequence([
       [["->", null]],
       [[/[\w]+/, "variable"]]
     ], closing, escapes);
   }
   return "variable-2";
 }

 var escaped = false;
 // Normal string
 while (!stream.eol() &&
        (escaped || escapes === false ||
         (!stream.match("{$", false) &&
          !stream.match(/^(\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{)/, false)))) {
   if (!escaped && stream.match(closing)) {
     state.tokenize = null;
     state.tokStack.pop(); state.tokStack.pop();
     break;
   }
   escaped = stream.next() == "\\" && !escaped;
 }
 return "string";
}

var phpKeywords = "abstract and array as break case catch class clone const continue declare default " +
 "do else elseif enddeclare endfor endforeach endif endswitch endwhile extends final " +
 "for foreach function global goto if implements interface instanceof namespace " +
 "new or private protected public static switch throw trait try use var while xor " +
 "die echo empty exit eval include include_once isset list require require_once return " +
 "print unset __halt_compiler self static parent yield insteadof finally";
var phpAtoms = "true false null TRUE FALSE NULL __CLASS__ __DIR__ __FILE__ __LINE__ __METHOD__ __FUNCTION__ __NAMESPACE__ __TRAIT__";
var phpBuiltin = "func_num_args func_get_arg func_get_args strlen strcmp strncmp strcasecmp strncasecmp each error_reporting define defined trigger_error user_error set_error_handler restore_error_handler get_declared_classes get_loaded_extensions extension_loaded get_extension_funcs debug_backtrace constant bin2hex hex2bin sleep usleep time mktime gmmktime strftime gmstrftime strtotime date gmdate getdate localtime checkdate flush wordwrap htmlspecialchars htmlentities html_entity_decode md5 md5_file crc32 getimagesize image_type_to_mime_type phpinfo phpversion phpcredits strnatcmp strnatcasecmp substr_count strspn strcspn strtok strtoupper strtolower strpos strrpos strrev hebrev hebrevc nl2br basename dirname pathinfo stripslashes stripcslashes strstr stristr strrchr str_shuffle str_word_count strcoll substr substr_replace quotemeta ucfirst ucwords strtr addslashes addcslashes rtrim str_replace str_repeat count_chars chunk_split trim ltrim strip_tags similar_text explode implode setlocale localeconv parse_str str_pad chop strchr sprintf printf vprintf vsprintf sscanf fscanf parse_url urlencode urldecode rawurlencode rawurldecode readlink linkinfo link unlink exec system escapeshellcmd escapeshellarg passthru shell_exec proc_open proc_close rand srand getrandmax mt_rand mt_srand mt_getrandmax base64_decode base64_encode abs ceil floor round is_finite is_nan is_infinite bindec hexdec octdec decbin decoct dechex base_convert number_format fmod ip2long long2ip getenv putenv getopt microtime gettimeofday getrusage uniqid quoted_printable_decode set_time_limit get_cfg_var magic_quotes_runtime set_magic_quotes_runtime get_magic_quotes_gpc get_magic_quotes_runtime import_request_variables error_log serialize unserialize memory_get_usage var_dump var_export debug_zval_dump print_r highlight_file show_source highlight_string ini_get ini_get_all ini_set ini_alter ini_restore get_include_path set_include_path restore_include_path setcookie header headers_sent connection_aborted connection_status ignore_user_abort parse_ini_file is_uploaded_file move_uploaded_file intval floatval doubleval strval gettype settype is_null is_resource is_bool is_long is_float is_int is_integer is_double is_real is_numeric is_string is_array is_object is_scalar ereg ereg_replace eregi eregi_replace split spliti join sql_regcase dl pclose popen readfile rewind rmdir umask fclose feof fgetc fgets fgetss fread fopen fpassthru ftruncate fstat fseek ftell fflush fwrite fputs mkdir rename copy tempnam tmpfile file file_get_contents file_put_contents stream_select stream_context_create stream_context_set_params stream_context_set_option stream_context_get_options stream_filter_prepend stream_filter_append fgetcsv flock get_meta_tags stream_set_write_buffer set_file_buffer set_socket_blocking stream_set_blocking socket_set_blocking stream_get_meta_data stream_register_wrapper stream_wrapper_register stream_set_timeout socket_set_timeout socket_get_status realpath fnmatch fsockopen pfsockopen pack unpack get_browser crypt opendir closedir chdir getcwd rewinddir readdir dir glob fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype file_exists is_writable is_writeable is_readable is_executable is_file is_dir is_link stat lstat chown touch clearstatcache mail ob_start ob_flush ob_clean ob_end_flush ob_end_clean ob_get_flush ob_get_clean ob_get_length ob_get_level ob_get_status ob_get_contents ob_implicit_flush ob_list_handlers ksort krsort natsort natcasesort asort arsort sort rsort usort uasort uksort shuffle array_walk count end prev next reset current key min max in_array array_search extract compact array_fill range array_multisort array_push array_pop array_shift array_unshift array_splice array_slice array_merge array_merge_recursive array_keys array_values array_count_values array_reverse array_reduce array_pad array_flip array_change_key_case array_rand array_unique array_intersect array_intersect_assoc array_diff array_diff_assoc array_sum array_filter array_map array_chunk array_key_exists array_intersect_key array_combine array_column pos sizeof key_exists assert assert_options version_compare ftok str_rot13 aggregate session_name session_module_name session_save_path session_id session_regenerate_id session_decode session_register session_unregister session_is_registered session_encode session_start session_destroy session_unset session_set_save_handler session_cache_limiter session_cache_expire session_set_cookie_params session_get_cookie_params session_write_close preg_match preg_match_all preg_replace preg_replace_callback preg_split preg_quote preg_grep overload ctype_alnum ctype_alpha ctype_cntrl ctype_digit ctype_lower ctype_graph ctype_print ctype_punct ctype_space ctype_upper ctype_xdigit virtual apache_request_headers apache_note apache_lookup_uri apache_child_terminate apache_setenv apache_response_headers apache_get_version getallheaders mysql_connect mysql_pconnect mysql_close mysql_select_db mysql_create_db mysql_drop_db mysql_query mysql_unbuffered_query mysql_db_query mysql_list_dbs mysql_list_tables mysql_list_fields mysql_list_processes mysql_error mysql_errno mysql_affected_rows mysql_insert_id mysql_result mysql_num_rows mysql_num_fields mysql_fetch_row mysql_fetch_array mysql_fetch_assoc mysql_fetch_object mysql_data_seek mysql_fetch_lengths mysql_fetch_field mysql_field_seek mysql_free_result mysql_field_name mysql_field_table mysql_field_len mysql_field_type mysql_field_flags mysql_escape_string mysql_real_escape_string mysql_stat mysql_thread_id mysql_client_encoding mysql_get_client_info mysql_get_host_info mysql_get_proto_info mysql_get_server_info mysql_info mysql mysql_fieldname mysql_fieldtable mysql_fieldlen mysql_fieldtype mysql_fieldflags mysql_selectdb mysql_createdb mysql_dropdb mysql_freeresult mysql_numfields mysql_numrows mysql_listdbs mysql_listtables mysql_listfields mysql_db_name mysql_dbname mysql_tablename mysql_table_name pg_connect pg_pconnect pg_close pg_connection_status pg_connection_busy pg_connection_reset pg_host pg_dbname pg_port pg_tty pg_options pg_ping pg_query pg_send_query pg_cancel_query pg_fetch_result pg_fetch_row pg_fetch_assoc pg_fetch_array pg_fetch_object pg_fetch_all pg_affected_rows pg_get_result pg_result_seek pg_result_status pg_free_result pg_last_oid pg_num_rows pg_num_fields pg_field_name pg_field_num pg_field_size pg_field_type pg_field_prtlen pg_field_is_null pg_get_notify pg_get_pid pg_result_error pg_last_error pg_last_notice pg_put_line pg_end_copy pg_copy_to pg_copy_from pg_trace pg_untrace pg_lo_create pg_lo_unlink pg_lo_open pg_lo_close pg_lo_read pg_lo_write pg_lo_read_all pg_lo_import pg_lo_export pg_lo_seek pg_lo_tell pg_escape_string pg_escape_bytea pg_unescape_bytea pg_client_encoding pg_set_client_encoding pg_meta_data pg_convert pg_insert pg_update pg_delete pg_select pg_exec pg_getlastoid pg_cmdtuples pg_errormessage pg_numrows pg_numfields pg_fieldname pg_fieldsize pg_fieldtype pg_fieldnum pg_fieldprtlen pg_fieldisnull pg_freeresult pg_result pg_loreadall pg_locreate pg_lounlink pg_loopen pg_loclose pg_loread pg_lowrite pg_loimport pg_loexport http_response_code get_declared_traits getimagesizefromstring socket_import_stream stream_set_chunk_size trait_exists header_register_callback class_uses session_status session_register_shutdown echo print global static exit array empty eval isset unset die include require include_once require_once json_decode json_encode json_last_error json_last_error_msg curl_close curl_copy_handle curl_errno curl_error curl_escape curl_exec curl_file_create curl_getinfo curl_init curl_multi_add_handle curl_multi_close curl_multi_exec curl_multi_getcontent curl_multi_info_read curl_multi_init curl_multi_remove_handle curl_multi_select curl_multi_setopt curl_multi_strerror curl_pause curl_reset curl_setopt_array curl_setopt curl_share_close curl_share_init curl_share_setopt curl_strerror curl_unescape curl_version mysqli_affected_rows mysqli_autocommit mysqli_change_user mysqli_character_set_name mysqli_close mysqli_commit mysqli_connect_errno mysqli_connect_error mysqli_connect mysqli_data_seek mysqli_debug mysqli_dump_debug_info mysqli_errno mysqli_error_list mysqli_error mysqli_fetch_all mysqli_fetch_array mysqli_fetch_assoc mysqli_fetch_field_direct mysqli_fetch_field mysqli_fetch_fields mysqli_fetch_lengths mysqli_fetch_object mysqli_fetch_row mysqli_field_count mysqli_field_seek mysqli_field_tell mysqli_free_result mysqli_get_charset mysqli_get_client_info mysqli_get_client_stats mysqli_get_client_version mysqli_get_connection_stats mysqli_get_host_info mysqli_get_proto_info mysqli_get_server_info mysqli_get_server_version mysqli_info mysqli_init mysqli_insert_id mysqli_kill mysqli_more_results mysqli_multi_query mysqli_next_result mysqli_num_fields mysqli_num_rows mysqli_options mysqli_ping mysqli_prepare mysqli_query mysqli_real_connect mysqli_real_escape_string mysqli_real_query mysqli_reap_async_query mysqli_refresh mysqli_rollback mysqli_select_db mysqli_set_charset mysqli_set_local_infile_default mysqli_set_local_infile_handler mysqli_sqlstate mysqli_ssl_set mysqli_stat mysqli_stmt_init mysqli_store_result mysqli_thread_id mysqli_thread_safe mysqli_use_result mysqli_warning_count";
CodeMirror.registerHelper("hintWords", "php", [phpKeywords, phpAtoms, phpBuiltin].join(" ").split(" "));
CodeMirror.registerHelper("wordChars", "php", /[\w$]/);

var phpConfig = {
 name: "clike",
 helperType: "php",
 keywords: keywords(phpKeywords),
 blockKeywords: keywords("catch do else elseif for foreach if switch try while finally"),
 defKeywords: keywords("class function interface namespace trait"),
 atoms: keywords(phpAtoms),
 builtin: keywords(phpBuiltin),
 multiLineStrings: true,
 hooks: {
   "$": function(stream) {
     stream.eatWhile(/[\w\$_]/);
     return "variable-2";
   },
   "<": function(stream, state) {
     var before;
     if (before = stream.match(/^<<\s*/)) {
       var quoted = stream.eat(/['"]/);
       stream.eatWhile(/[\w\.]/);
       var delim = stream.current().slice(before[0].length + (quoted ? 2 : 1));
       if (quoted) stream.eat(quoted);
       if (delim) {
         (state.tokStack || (state.tokStack = [])).push(delim, 0);
         state.tokenize = phpString(delim, quoted != "'");
         return "string";
       }
     }
     return false;
   },
   "#": function(stream) {
     while (!stream.eol() && !stream.match("?>", false)) stream.next();
     return "comment";
   },
   "/": function(stream) {
     if (stream.eat("/")) {
       while (!stream.eol() && !stream.match("?>", false)) stream.next();
       return "comment";
     }
     return false;
   },
   '"': function(_stream, state) {
     (state.tokStack || (state.tokStack = [])).push('"', 0);
     state.tokenize = phpString('"');
     return "string";
   },
   "{": function(_stream, state) {
     if (state.tokStack && state.tokStack.length)
       state.tokStack[state.tokStack.length - 1]++;
     return false;
   },
   "}": function(_stream, state) {
     if (state.tokStack && state.tokStack.length > 0 &&
         !--state.tokStack[state.tokStack.length - 1]) {
       state.tokenize = phpString(state.tokStack[state.tokStack.length - 2]);
     }
     return false;
   }
 }
};

CodeMirror.defineMode("php", function(config, parserConfig) {
 var htmlMode = CodeMirror.getMode(config, (parserConfig && parserConfig.htmlMode) || "text/html");
 var phpMode = CodeMirror.getMode(config, phpConfig);

 function dispatch(stream, state) {
   var isPHP = state.curMode == phpMode;
   if (stream.sol() && state.pending && state.pending != '"' && state.pending != "'") state.pending = null;
   if (!isPHP) {
     if (stream.match(/^<\?\w*/)) {
       state.curMode = phpMode;
       if (!state.php) state.php = CodeMirror.startState(phpMode, htmlMode.indent(state.html, "", ""))
       state.curState = state.php;
       return "meta";
     }
     if (state.pending == '"' || state.pending == "'") {
       while (!stream.eol() && stream.next() != state.pending) {}
       var style = "string";
     } else if (state.pending && stream.pos < state.pending.end) {
       stream.pos = state.pending.end;
       var style = state.pending.style;
     } else {
       var style = htmlMode.token(stream, state.curState);
     }
     if (state.pending) state.pending = null;
     var cur = stream.current(), openPHP = cur.search(/<\?/), m;
     if (openPHP != -1) {
       if (style == "string" && (m = cur.match(/[\'\"]$/)) && !/\?>/.test(cur)) state.pending = m[0];
       else state.pending = {end: stream.pos, style: style};
       stream.backUp(cur.length - openPHP);
     }
     return style;
   } else if (isPHP && state.php.tokenize == null && stream.match("?>")) {
     state.curMode = htmlMode;
     state.curState = state.html;
     if (!state.php.context.prev) state.php = null;
     return "meta";
   } else {
     return phpMode.token(stream, state.curState);
   }
 }

 return {
   startState: function() {
     var html = CodeMirror.startState(htmlMode)
     var php = parserConfig.startOpen ? CodeMirror.startState(phpMode) : null
     return {html: html,
             php: php,
             curMode: parserConfig.startOpen ? phpMode : htmlMode,
             curState: parserConfig.startOpen ? php : html,
             pending: null};
   },

   copyState: function(state) {
     var html = state.html, htmlNew = CodeMirror.copyState(htmlMode, html),
         php = state.php, phpNew = php && CodeMirror.copyState(phpMode, php), cur;
     if (state.curMode == htmlMode) cur = htmlNew;
     else cur = phpNew;
     return {html: htmlNew, php: phpNew, curMode: state.curMode, curState: cur,
             pending: state.pending};
   },

   token: dispatch,

   indent: function(state, textAfter, line) {
     if ((state.curMode != phpMode && /^\s*<\//.test(textAfter)) ||
         (state.curMode == phpMode && /^\?>/.test(textAfter)))
       return htmlMode.indent(state.html, textAfter, line);
     return state.curMode.indent(state.curState, textAfter, line);
   },

   blockCommentStart: "/*",
   blockCommentEnd: "*/",
   lineComment: "//",

   innerMode: function(state) { return {state: state.curState, mode: state.curMode}; }
 };
}, "htmlmixed", "clike");

CodeMirror.defineMIME("application/x-httpd-php", "php");
CodeMirror.defineMIME("application/x-httpd-php-open", {name: "php", startOpen: true});
CodeMirror.defineMIME("text/x-php", phpConfig);
});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
'use strict';
if (typeof exports == 'object' && typeof module == 'object') // CommonJS
 mod(require('../../lib/codemirror'));
else if (typeof define == 'function' && define.amd) // AMD
 define(['../../lib/codemirror'], mod);
else // Plain browser env
 mod(window.CodeMirror);
})(function(CodeMirror) {
'use strict';

CodeMirror.defineMode('powershell', function() {
function buildRegexp(patterns, options) {
 options = options || {};
 var prefix = options.prefix !== undefined ? options.prefix : '^';
 var suffix = options.suffix !== undefined ? options.suffix : '\\b';

 for (var i = 0; i < patterns.length; i++) {
   if (patterns[i] instanceof RegExp) {
     patterns[i] = patterns[i].source;
   }
   else {
     patterns[i] = patterns[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
   }
 }

 return new RegExp(prefix + '(' + patterns.join('|') + ')' + suffix, 'i');
}

var notCharacterOrDash = '(?=[^A-Za-z\\d\\-_]|$)';
var varNames = /[\w\-:]/
var keywords = buildRegexp([
 /begin|break|catch|continue|data|default|do|dynamicparam/,
 /else|elseif|end|exit|filter|finally|for|foreach|from|function|if|in/,
 /param|process|return|switch|throw|trap|try|until|where|while/
], { suffix: notCharacterOrDash });

var punctuation = /[\[\]{},;`\\\.]|@[({]/;
var wordOperators = buildRegexp([
 'f',
 /b?not/,
 /[ic]?split/, 'join',
 /is(not)?/, 'as',
 /[ic]?(eq|ne|[gl][te])/,
 /[ic]?(not)?(like|match|contains)/,
 /[ic]?replace/,
 /b?(and|or|xor)/
], { prefix: '-' });
var symbolOperators = /[+\-*\/%]=|\+\+|--|\.\.|[+\-*&^%:=!|\/]|<(?!#)|(?!#)>/;
var operators = buildRegexp([wordOperators, symbolOperators], { suffix: '' });

var numbers = /^((0x[\da-f]+)|((\d+\.\d+|\d\.|\.\d+|\d+)(e[\+\-]?\d+)?))[ld]?([kmgtp]b)?/i;

var identifiers = /^[A-Za-z\_][A-Za-z\-\_\d]*\b/;

var symbolBuiltins = /[A-Z]:|%|\?/i;
var namedBuiltins = buildRegexp([
 /Add-(Computer|Content|History|Member|PSSnapin|Type)/,
 /Checkpoint-Computer/,
 /Clear-(Content|EventLog|History|Host|Item(Property)?|Variable)/,
 /Compare-Object/,
 /Complete-Transaction/,
 /Connect-PSSession/,
 /ConvertFrom-(Csv|Json|SecureString|StringData)/,
 /Convert-Path/,
 /ConvertTo-(Csv|Html|Json|SecureString|Xml)/,
 /Copy-Item(Property)?/,
 /Debug-Process/,
 /Disable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)/,
 /Disconnect-PSSession/,
 /Enable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)/,
 /(Enter|Exit)-PSSession/,
 /Export-(Alias|Clixml|Console|Counter|Csv|FormatData|ModuleMember|PSSession)/,
 /ForEach-Object/,
 /Format-(Custom|List|Table|Wide)/,
 new RegExp('Get-(Acl|Alias|AuthenticodeSignature|ChildItem|Command|ComputerRestorePoint|Content|ControlPanelItem|Counter|Credential'
   + '|Culture|Date|Event|EventLog|EventSubscriber|ExecutionPolicy|FormatData|Help|History|Host|HotFix|Item|ItemProperty|Job'
   + '|Location|Member|Module|PfxCertificate|Process|PSBreakpoint|PSCallStack|PSDrive|PSProvider|PSSession|PSSessionConfiguration'
   + '|PSSnapin|Random|Service|TraceSource|Transaction|TypeData|UICulture|Unique|Variable|Verb|WinEvent|WmiObject)'),
 /Group-Object/,
 /Import-(Alias|Clixml|Counter|Csv|LocalizedData|Module|PSSession)/,
 /ImportSystemModules/,
 /Invoke-(Command|Expression|History|Item|RestMethod|WebRequest|WmiMethod)/,
 /Join-Path/,
 /Limit-EventLog/,
 /Measure-(Command|Object)/,
 /Move-Item(Property)?/,
 new RegExp('New-(Alias|Event|EventLog|Item(Property)?|Module|ModuleManifest|Object|PSDrive|PSSession|PSSessionConfigurationFile'
   + '|PSSessionOption|PSTransportOption|Service|TimeSpan|Variable|WebServiceProxy|WinEvent)'),
 /Out-(Default|File|GridView|Host|Null|Printer|String)/,
 /Pause/,
 /(Pop|Push)-Location/,
 /Read-Host/,
 /Receive-(Job|PSSession)/,
 /Register-(EngineEvent|ObjectEvent|PSSessionConfiguration|WmiEvent)/,
 /Remove-(Computer|Event|EventLog|Item(Property)?|Job|Module|PSBreakpoint|PSDrive|PSSession|PSSnapin|TypeData|Variable|WmiObject)/,
 /Rename-(Computer|Item(Property)?)/,
 /Reset-ComputerMachinePassword/,
 /Resolve-Path/,
 /Restart-(Computer|Service)/,
 /Restore-Computer/,
 /Resume-(Job|Service)/,
 /Save-Help/,
 /Select-(Object|String|Xml)/,
 /Send-MailMessage/,
 new RegExp('Set-(Acl|Alias|AuthenticodeSignature|Content|Date|ExecutionPolicy|Item(Property)?|Location|PSBreakpoint|PSDebug' +
            '|PSSessionConfiguration|Service|StrictMode|TraceSource|Variable|WmiInstance)'),
 /Show-(Command|ControlPanelItem|EventLog)/,
 /Sort-Object/,
 /Split-Path/,
 /Start-(Job|Process|Service|Sleep|Transaction|Transcript)/,
 /Stop-(Computer|Job|Process|Service|Transcript)/,
 /Suspend-(Job|Service)/,
 /TabExpansion2/,
 /Tee-Object/,
 /Test-(ComputerSecureChannel|Connection|ModuleManifest|Path|PSSessionConfigurationFile)/,
 /Trace-Command/,
 /Unblock-File/,
 /Undo-Transaction/,
 /Unregister-(Event|PSSessionConfiguration)/,
 /Update-(FormatData|Help|List|TypeData)/,
 /Use-Transaction/,
 /Wait-(Event|Job|Process)/,
 /Where-Object/,
 /Write-(Debug|Error|EventLog|Host|Output|Progress|Verbose|Warning)/,
 /cd|help|mkdir|more|oss|prompt/,
 /ac|asnp|cat|cd|chdir|clc|clear|clhy|cli|clp|cls|clv|cnsn|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|dnsn|ebp/,
 /echo|epal|epcsv|epsn|erase|etsn|exsn|fc|fl|foreach|ft|fw|gal|gbp|gc|gci|gcm|gcs|gdr|ghy|gi|gjb|gl|gm|gmo|gp|gps/,
 /group|gsn|gsnp|gsv|gu|gv|gwmi|h|history|icm|iex|ihy|ii|ipal|ipcsv|ipmo|ipsn|irm|ise|iwmi|iwr|kill|lp|ls|man|md/,
 /measure|mi|mount|move|mp|mv|nal|ndr|ni|nmo|npssc|nsn|nv|ogv|oh|popd|ps|pushd|pwd|r|rbp|rcjb|rcsn|rd|rdr|ren|ri/,
 /rjb|rm|rmdir|rmo|rni|rnp|rp|rsn|rsnp|rujb|rv|rvpa|rwmi|sajb|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls/,
 /sort|sp|spjb|spps|spsv|start|sujb|sv|swmi|tee|trcm|type|where|wjb|write/
], { prefix: '', suffix: '' });
var variableBuiltins = buildRegexp([
 /[$?^_]|Args|ConfirmPreference|ConsoleFileName|DebugPreference|Error|ErrorActionPreference|ErrorView|ExecutionContext/,
 /FormatEnumerationLimit|Home|Host|Input|MaximumAliasCount|MaximumDriveCount|MaximumErrorCount|MaximumFunctionCount/,
 /MaximumHistoryCount|MaximumVariableCount|MyInvocation|NestedPromptLevel|OutputEncoding|Pid|Profile|ProgressPreference/,
 /PSBoundParameters|PSCommandPath|PSCulture|PSDefaultParameterValues|PSEmailServer|PSHome|PSScriptRoot|PSSessionApplicationName/,
 /PSSessionConfigurationName|PSSessionOption|PSUICulture|PSVersionTable|Pwd|ShellId|StackTrace|VerbosePreference/,
 /WarningPreference|WhatIfPreference/,

 /Event|EventArgs|EventSubscriber|Sender/,
 /Matches|Ofs|ForEach|LastExitCode|PSCmdlet|PSItem|PSSenderInfo|This/,
 /true|false|null/
], { prefix: '\\$', suffix: '' });

var builtins = buildRegexp([symbolBuiltins, namedBuiltins, variableBuiltins], { suffix: notCharacterOrDash });

var grammar = {
 keyword: keywords,
 number: numbers,
 operator: operators,
 builtin: builtins,
 punctuation: punctuation,
 identifier: identifiers
};

// tokenizers
function tokenBase(stream, state) {
 // Handle Comments
 //var ch = stream.peek();

 var parent = state.returnStack[state.returnStack.length - 1];
 if (parent && parent.shouldReturnFrom(state)) {
   state.tokenize = parent.tokenize;
   state.returnStack.pop();
   return state.tokenize(stream, state);
 }

 if (stream.eatSpace()) {
   return null;
 }

 if (stream.eat('(')) {
   state.bracketNesting += 1;
   return 'punctuation';
 }

 if (stream.eat(')')) {
   state.bracketNesting -= 1;
   return 'punctuation';
 }

 for (var key in grammar) {
   if (stream.match(grammar[key])) {
     return key;
   }
 }

 var ch = stream.next();

 // single-quote string
 if (ch === "'") {
   return tokenSingleQuoteString(stream, state);
 }

 if (ch === '$') {
   return tokenVariable(stream, state);
 }

 // double-quote string
 if (ch === '"') {
   return tokenDoubleQuoteString(stream, state);
 }

 if (ch === '<' && stream.eat('#')) {
   state.tokenize = tokenComment;
   return tokenComment(stream, state);
 }

 if (ch === '#') {
   stream.skipToEnd();
   return 'comment';
 }

 if (ch === '@') {
   var quoteMatch = stream.eat(/["']/);
   if (quoteMatch && stream.eol()) {
     state.tokenize = tokenMultiString;
     state.startQuote = quoteMatch[0];
     return tokenMultiString(stream, state);
   } else if (stream.eol()) {
     return 'error';
   } else if (stream.peek().match(/[({]/)) {
     return 'punctuation';
   } else if (stream.peek().match(varNames)) {
     // splatted variable
     return tokenVariable(stream, state);
   }
 }
 return 'error';
}

function tokenSingleQuoteString(stream, state) {
 var ch;
 while ((ch = stream.peek()) != null) {
   stream.next();

   if (ch === "'" && !stream.eat("'")) {
     state.tokenize = tokenBase;
     return 'string';
   }
 }

 return 'error';
}

function tokenDoubleQuoteString(stream, state) {
 var ch;
 while ((ch = stream.peek()) != null) {
   if (ch === '$') {
     state.tokenize = tokenStringInterpolation;
     return 'string';
   }

   stream.next();
   if (ch === '`') {
     stream.next();
     continue;
   }

   if (ch === '"' && !stream.eat('"')) {
     state.tokenize = tokenBase;
     return 'string';
   }
 }

 return 'error';
}

function tokenStringInterpolation(stream, state) {
 return tokenInterpolation(stream, state, tokenDoubleQuoteString);
}

function tokenMultiStringReturn(stream, state) {
 state.tokenize = tokenMultiString;
 state.startQuote = '"'
 return tokenMultiString(stream, state);
}

function tokenHereStringInterpolation(stream, state) {
 return tokenInterpolation(stream, state, tokenMultiStringReturn);
}

function tokenInterpolation(stream, state, parentTokenize) {
 if (stream.match('$(')) {
   var savedBracketNesting = state.bracketNesting;
   state.returnStack.push({
     /*jshint loopfunc:true */
     shouldReturnFrom: function(state) {
       return state.bracketNesting === savedBracketNesting;
     },
     tokenize: parentTokenize
   });
   state.tokenize = tokenBase;
   state.bracketNesting += 1;
   return 'punctuation';
 } else {
   stream.next();
   state.returnStack.push({
     shouldReturnFrom: function() { return true; },
     tokenize: parentTokenize
   });
   state.tokenize = tokenVariable;
   return state.tokenize(stream, state);
 }
}

function tokenComment(stream, state) {
 var maybeEnd = false, ch;
 while ((ch = stream.next()) != null) {
   if (maybeEnd && ch == '>') {
       state.tokenize = tokenBase;
       break;
   }
   maybeEnd = (ch === '#');
 }
 return 'comment';
}

function tokenVariable(stream, state) {
 var ch = stream.peek();
 if (stream.eat('{')) {
   state.tokenize = tokenVariableWithBraces;
   return tokenVariableWithBraces(stream, state);
 } else if (ch != undefined && ch.match(varNames)) {
   stream.eatWhile(varNames);
   state.tokenize = tokenBase;
   return 'variable-2';
 } else {
   state.tokenize = tokenBase;
   return 'error';
 }
}

function tokenVariableWithBraces(stream, state) {
 var ch;
 while ((ch = stream.next()) != null) {
   if (ch === '}') {
     state.tokenize = tokenBase;
     break;
   }
 }
 return 'variable-2';
}

function tokenMultiString(stream, state) {
 var quote = state.startQuote;
 if (stream.sol() && stream.match(new RegExp(quote + '@'))) {
   state.tokenize = tokenBase;
 }
 else if (quote === '"') {
   while (!stream.eol()) {
     var ch = stream.peek();
     if (ch === '$') {
       state.tokenize = tokenHereStringInterpolation;
       return 'string';
     }

     stream.next();
     if (ch === '`') {
       stream.next();
     }
   }
 }
 else {
   stream.skipToEnd();
 }

 return 'string';
}

var external = {
 startState: function() {
   return {
     returnStack: [],
     bracketNesting: 0,
     tokenize: tokenBase
   };
 },

 token: function(stream, state) {
   return state.tokenize(stream, state);
 },

 blockCommentStart: '<#',
 blockCommentEnd: '#>',
 lineComment: '#',
 fold: 'brace'
};
return external;
});

CodeMirror.defineMIME('application/x-powershell', 'powershell');
});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

function wordObj(words) {
var o = {};
for (var i = 0, e = words.length; i < e; ++i) o[words[i]] = true;
return o;
}

var keywordList = [
"alias", "and", "BEGIN", "begin", "break", "case", "class", "def", "defined?", "do", "else",
"elsif", "END", "end", "ensure", "false", "for", "if", "in", "module", "next", "not", "or",
"redo", "rescue", "retry", "return", "self", "super", "then", "true", "undef", "unless",
"until", "when", "while", "yield", "nil", "raise", "throw", "catch", "fail", "loop", "callcc",
"caller", "lambda", "proc", "public", "protected", "private", "require", "load",
"require_relative", "extend", "autoload", "__END__", "__FILE__", "__LINE__", "__dir__"
], keywords = wordObj(keywordList);

var indentWords = wordObj(["def", "class", "case", "for", "while", "until", "module", "then",
                        "catch", "loop", "proc", "begin"]);
var dedentWords = wordObj(["end", "until"]);
var opening = {"[": "]", "{": "}", "(": ")"};
var closing = {"]": "[", "}": "{", ")": "("};

CodeMirror.defineMode("ruby", function(config) {
var curPunc;

function chain(newtok, stream, state) {
 state.tokenize.push(newtok);
 return newtok(stream, state);
}

function tokenBase(stream, state) {
 if (stream.sol() && stream.match("=begin") && stream.eol()) {
   state.tokenize.push(readBlockComment);
   return "comment";
 }
 if (stream.eatSpace()) return null;
 var ch = stream.next(), m;
 if (ch == "`" || ch == "'" || ch == '"') {
   return chain(readQuoted(ch, "string", ch == '"' || ch == "`"), stream, state);
 } else if (ch == "/") {
   if (regexpAhead(stream))
     return chain(readQuoted(ch, "string-2", true), stream, state);
   else
     return "operator";
 } else if (ch == "%") {
   var style = "string", embed = true;
   if (stream.eat("s")) style = "atom";
   else if (stream.eat(/[WQ]/)) style = "string";
   else if (stream.eat(/[r]/)) style = "string-2";
   else if (stream.eat(/[wxq]/)) { style = "string"; embed = false; }
   var delim = stream.eat(/[^\w\s=]/);
   if (!delim) return "operator";
   if (opening.propertyIsEnumerable(delim)) delim = opening[delim];
   return chain(readQuoted(delim, style, embed, true), stream, state);
 } else if (ch == "#") {
   stream.skipToEnd();
   return "comment";
 } else if (ch == "<" && (m = stream.match(/^<([-~])[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/))) {
   return chain(readHereDoc(m[2], m[1]), stream, state);
 } else if (ch == "0") {
   if (stream.eat("x")) stream.eatWhile(/[\da-fA-F]/);
   else if (stream.eat("b")) stream.eatWhile(/[01]/);
   else stream.eatWhile(/[0-7]/);
   return "number";
 } else if (/\d/.test(ch)) {
   stream.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/);
   return "number";
 } else if (ch == "?") {
   while (stream.match(/^\\[CM]-/)) {}
   if (stream.eat("\\")) stream.eatWhile(/\w/);
   else stream.next();
   return "string";
 } else if (ch == ":") {
   if (stream.eat("'")) return chain(readQuoted("'", "atom", false), stream, state);
   if (stream.eat('"')) return chain(readQuoted('"', "atom", true), stream, state);

   // :> :>> :< :<< are valid symbols
   if (stream.eat(/[\<\>]/)) {
     stream.eat(/[\<\>]/);
     return "atom";
   }

   // :+ :- :/ :* :| :& :! are valid symbols
   if (stream.eat(/[\+\-\*\/\&\|\:\!]/)) {
     return "atom";
   }

   // Symbols can't start by a digit
   if (stream.eat(/[a-zA-Z$@_\xa1-\uffff]/)) {
     stream.eatWhile(/[\w$\xa1-\uffff]/);
     // Only one ? ! = is allowed and only as the last character
     stream.eat(/[\?\!\=]/);
     return "atom";
   }
   return "operator";
 } else if (ch == "@" && stream.match(/^@?[a-zA-Z_\xa1-\uffff]/)) {
   stream.eat("@");
   stream.eatWhile(/[\w\xa1-\uffff]/);
   return "variable-2";
 } else if (ch == "$") {
   if (stream.eat(/[a-zA-Z_]/)) {
     stream.eatWhile(/[\w]/);
   } else if (stream.eat(/\d/)) {
     stream.eat(/\d/);
   } else {
     stream.next(); // Must be a special global like $: or $!
   }
   return "variable-3";
 } else if (/[a-zA-Z_\xa1-\uffff]/.test(ch)) {
   stream.eatWhile(/[\w\xa1-\uffff]/);
   stream.eat(/[\?\!]/);
   if (stream.eat(":")) return "atom";
   return "ident";
 } else if (ch == "|" && (state.varList || state.lastTok == "{" || state.lastTok == "do")) {
   curPunc = "|";
   return null;
 } else if (/[\(\)\[\]{}\\;]/.test(ch)) {
   curPunc = ch;
   return null;
 } else if (ch == "-" && stream.eat(">")) {
   return "arrow";
 } else if (/[=+\-\/*:\.^%<>~|]/.test(ch)) {
   var more = stream.eatWhile(/[=+\-\/*:\.^%<>~|]/);
   if (ch == "." && !more) curPunc = ".";
   return "operator";
 } else {
   return null;
 }
}

function regexpAhead(stream) {
 var start = stream.pos, depth = 0, next, found = false, escaped = false
 while ((next = stream.next()) != null) {
   if (!escaped) {
     if ("[{(".indexOf(next) > -1) {
       depth++
     } else if ("]})".indexOf(next) > -1) {
       depth--
       if (depth < 0) break
     } else if (next == "/" && depth == 0) {
       found = true
       break
     }
     escaped = next == "\\"
   } else {
     escaped = false
   }
 }
 stream.backUp(stream.pos - start)
 return found
}

function tokenBaseUntilBrace(depth) {
 if (!depth) depth = 1;
 return function(stream, state) {
   if (stream.peek() == "}") {
     if (depth == 1) {
       state.tokenize.pop();
       return state.tokenize[state.tokenize.length-1](stream, state);
     } else {
       state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth - 1);
     }
   } else if (stream.peek() == "{") {
     state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth + 1);
   }
   return tokenBase(stream, state);
 };
}
function tokenBaseOnce() {
 var alreadyCalled = false;
 return function(stream, state) {
   if (alreadyCalled) {
     state.tokenize.pop();
     return state.tokenize[state.tokenize.length-1](stream, state);
   }
   alreadyCalled = true;
   return tokenBase(stream, state);
 };
}
function readQuoted(quote, style, embed, unescaped) {
 return function(stream, state) {
   var escaped = false, ch;

   if (state.context.type === 'read-quoted-paused') {
     state.context = state.context.prev;
     stream.eat("}");
   }

   while ((ch = stream.next()) != null) {
     if (ch == quote && (unescaped || !escaped)) {
       state.tokenize.pop();
       break;
     }
     if (embed && ch == "#" && !escaped) {
       if (stream.eat("{")) {
         if (quote == "}") {
           state.context = {prev: state.context, type: 'read-quoted-paused'};
         }
         state.tokenize.push(tokenBaseUntilBrace());
         break;
       } else if (/[@\$]/.test(stream.peek())) {
         state.tokenize.push(tokenBaseOnce());
         break;
       }
     }
     escaped = !escaped && ch == "\\";
   }
   return style;
 };
}
function readHereDoc(phrase, mayIndent) {
 return function(stream, state) {
   if (mayIndent) stream.eatSpace()
   if (stream.match(phrase)) state.tokenize.pop();
   else stream.skipToEnd();
   return "string";
 };
}
function readBlockComment(stream, state) {
 if (stream.sol() && stream.match("=end") && stream.eol())
   state.tokenize.pop();
 stream.skipToEnd();
 return "comment";
}

return {
 startState: function() {
   return {tokenize: [tokenBase],
           indented: 0,
           context: {type: "top", indented: -config.indentUnit},
           continuedLine: false,
           lastTok: null,
           varList: false};
 },

 token: function(stream, state) {
   curPunc = null;
   if (stream.sol()) state.indented = stream.indentation();
   var style = state.tokenize[state.tokenize.length-1](stream, state), kwtype;
   var thisTok = curPunc;
   if (style == "ident") {
     var word = stream.current();
     style = state.lastTok == "." ? "property"
       : keywords.propertyIsEnumerable(stream.current()) ? "keyword"
       : /^[A-Z]/.test(word) ? "tag"
       : (state.lastTok == "def" || state.lastTok == "class" || state.varList) ? "def"
       : "variable";
     if (style == "keyword") {
       thisTok = word;
       if (indentWords.propertyIsEnumerable(word)) kwtype = "indent";
       else if (dedentWords.propertyIsEnumerable(word)) kwtype = "dedent";
       else if ((word == "if" || word == "unless") && stream.column() == stream.indentation())
         kwtype = "indent";
       else if (word == "do" && state.context.indented < state.indented)
         kwtype = "indent";
     }
   }
   if (curPunc || (style && style != "comment")) state.lastTok = thisTok;
   if (curPunc == "|") state.varList = !state.varList;

   if (kwtype == "indent" || /[\(\[\{]/.test(curPunc))
     state.context = {prev: state.context, type: curPunc || style, indented: state.indented};
   else if ((kwtype == "dedent" || /[\)\]\}]/.test(curPunc)) && state.context.prev)
     state.context = state.context.prev;

   if (stream.eol())
     state.continuedLine = (curPunc == "\\" || style == "operator");
   return style;
 },

 indent: function(state, textAfter) {
   if (state.tokenize[state.tokenize.length-1] != tokenBase) return CodeMirror.Pass;
   var firstChar = textAfter && textAfter.charAt(0);
   var ct = state.context;
   var closed = ct.type == closing[firstChar] ||
     ct.type == "keyword" && /^(?:end|until|else|elsif|when|rescue)\b/.test(textAfter);
   return ct.indented + (closed ? 0 : config.indentUnit) +
     (state.continuedLine ? config.indentUnit : 0);
 },

 electricInput: /^\s*(?:end|rescue|elsif|else|\})$/,
 lineComment: "#",
 fold: "indent"
};
});

CodeMirror.defineMIME("text/x-ruby", "ruby");

CodeMirror.registerHelper("hintWords", "ruby", keywordList);

});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode('shell', function() {

var words = {};
function define(style, dict) {
 for(var i = 0; i < dict.length; i++) {
   words[dict[i]] = style;
 }
};

var commonAtoms = ["true", "false"];
var commonKeywords = ["if", "then", "do", "else", "elif", "while", "until", "for", "in", "esac", "fi",
 "fin", "fil", "done", "exit", "set", "unset", "export", "function"];
var commonCommands = ["ab", "awk", "bash", "beep", "cat", "cc", "cd", "chown", "chmod", "chroot", "clear",
 "cp", "curl", "cut", "diff", "echo", "find", "gawk", "gcc", "get", "git", "grep", "hg", "kill", "killall",
 "ln", "ls", "make", "mkdir", "openssl", "mv", "nc", "nl", "node", "npm", "ping", "ps", "restart", "rm",
 "rmdir", "sed", "service", "sh", "shopt", "shred", "source", "sort", "sleep", "ssh", "start", "stop",
 "su", "sudo", "svn", "tee", "telnet", "top", "touch", "vi", "vim", "wall", "wc", "wget", "who", "write",
 "yes", "zsh"];

CodeMirror.registerHelper("hintWords", "shell", commonAtoms.concat(commonKeywords, commonCommands));

define('atom', commonAtoms);
define('keyword', commonKeywords);
define('builtin', commonCommands);

function tokenBase(stream, state) {
 if (stream.eatSpace()) return null;

 var sol = stream.sol();
 var ch = stream.next();

 if (ch === '\\') {
   stream.next();
   return null;
 }
 if (ch === '\'' || ch === '"' || ch === '`') {
   state.tokens.unshift(tokenString(ch, ch === "`" ? "quote" : "string"));
   return tokenize(stream, state);
 }
 if (ch === '#') {
   if (sol && stream.eat('!')) {
     stream.skipToEnd();
     return 'meta'; // 'comment'?
   }
   stream.skipToEnd();
   return 'comment';
 }
 if (ch === '$') {
   state.tokens.unshift(tokenDollar);
   return tokenize(stream, state);
 }
 if (ch === '+' || ch === '=') {
   return 'operator';
 }
 if (ch === '-') {
   stream.eat('-');
   stream.eatWhile(/\w/);
   return 'attribute';
 }
 if (ch == "<") {
   if (stream.match("<<")) return "operator"
   var heredoc = stream.match(/^<-?\s*['"]?([^'"]*)['"]?/)
   if (heredoc) {
     state.tokens.unshift(tokenHeredoc(heredoc[1]))
     return 'string-2'
   }
 }
 if (/\d/.test(ch)) {
   stream.eatWhile(/\d/);
   if(stream.eol() || !/\w/.test(stream.peek())) {
     return 'number';
   }
 }
 stream.eatWhile(/[\w-]/);
 var cur = stream.current();
 if (stream.peek() === '=' && /\w+/.test(cur)) return 'def';
 return words.hasOwnProperty(cur) ? words[cur] : null;
}

function tokenString(quote, style) {
 var close = quote == "(" ? ")" : quote == "{" ? "}" : quote
 return function(stream, state) {
   var next, escaped = false;
   while ((next = stream.next()) != null) {
     if (next === close && !escaped) {
       state.tokens.shift();
       break;
     } else if (next === '$' && !escaped && quote !== "'" && stream.peek() != close) {
       escaped = true;
       stream.backUp(1);
       state.tokens.unshift(tokenDollar);
       break;
     } else if (!escaped && quote !== close && next === quote) {
       state.tokens.unshift(tokenString(quote, style))
       return tokenize(stream, state)
     } else if (!escaped && /['"]/.test(next) && !/['"]/.test(quote)) {
       state.tokens.unshift(tokenStringStart(next, "string"));
       stream.backUp(1);
       break;
     }
     escaped = !escaped && next === '\\';
   }
   return style;
 };
};

function tokenStringStart(quote, style) {
 return function(stream, state) {
   state.tokens[0] = tokenString(quote, style)
   stream.next()
   return tokenize(stream, state)
 }
}

var tokenDollar = function(stream, state) {
 if (state.tokens.length > 1) stream.eat('$');
 var ch = stream.next()
 if (/['"({]/.test(ch)) {
   state.tokens[0] = tokenString(ch, ch == "(" ? "quote" : ch == "{" ? "def" : "string");
   return tokenize(stream, state);
 }
 if (!/\d/.test(ch)) stream.eatWhile(/\w/);
 state.tokens.shift();
 return 'def';
};

function tokenHeredoc(delim) {
 return function(stream, state) {
   if (stream.sol() && stream.string == delim) state.tokens.shift()
   stream.skipToEnd()
   return "string-2"
 }
}

function tokenize(stream, state) {
 return (state.tokens[0] || tokenBase) (stream, state);
};

return {
 startState: function() {return {tokens:[]};},
 token: function(stream, state) {
   return tokenize(stream, state);
 },
 closeBrackets: "()[]{}''\"\"``",
 lineComment: '#',
 fold: "brace"
};
});

CodeMirror.defineMIME('text/x-sh', 'shell');
//Apache uses a slightly different Media Type for Shell scripts
//http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
CodeMirror.defineMIME('application/x-sh', 'shell');

});

//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("vb", function(conf, parserConf) {
 var ERRORCLASS = 'error';

 function wordRegexp(words) {
     return new RegExp("^((" + words.join(")|(") + "))\\b", "i");
 }

 var singleOperators = new RegExp("^[\\+\\-\\*/%&\\\\|\\^~<>!]");
 var singleDelimiters = new RegExp('^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]');
 var doubleOperators = new RegExp("^((==)|(<>)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))");
 var doubleDelimiters = new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))");
 var tripleDelimiters = new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))");
 var identifiers = new RegExp("^[_A-Za-z][_A-Za-z0-9]*");

 var openingKeywords = ['class','module', 'sub','enum','select','while','if','function', 'get','set','property', 'try', 'structure', 'synclock', 'using', 'with'];
 var middleKeywords = ['else','elseif','case', 'catch', 'finally'];
 var endKeywords = ['next','loop'];

 var operatorKeywords = ['and', "andalso", 'or', 'orelse', 'xor', 'in', 'not', 'is', 'isnot', 'like'];
 var wordOperators = wordRegexp(operatorKeywords);

 var commonKeywords = ["#const", "#else", "#elseif", "#end", "#if", "#region", "addhandler", "addressof", "alias", "as", "byref", "byval", "cbool", "cbyte", "cchar", "cdate", "cdbl", "cdec", "cint", "clng", "cobj", "compare", "const", "continue", "csbyte", "cshort", "csng", "cstr", "cuint", "culng", "cushort", "declare", "default", "delegate", "dim", "directcast", "each", "erase", "error", "event", "exit", "explicit", "false", "for", "friend", "gettype", "goto", "handles", "implements", "imports", "infer", "inherits", "interface", "isfalse", "istrue", "lib", "me", "mod", "mustinherit", "mustoverride", "my", "mybase", "myclass", "namespace", "narrowing", "new", "nothing", "notinheritable", "notoverridable", "of", "off", "on", "operator", "option", "optional", "out", "overloads", "overridable", "overrides", "paramarray", "partial", "private", "protected", "public", "raiseevent", "readonly", "redim", "removehandler", "resume", "return", "shadows", "shared", "static", "step", "stop", "strict", "then", "throw", "to", "true", "trycast", "typeof", "until", "until", "when", "widening", "withevents", "writeonly"];

 var commontypes = ['object', 'boolean', 'char', 'string', 'byte', 'sbyte', 'short', 'ushort', 'int16', 'uint16', 'integer', 'uinteger', 'int32', 'uint32', 'long', 'ulong', 'int64', 'uint64', 'decimal', 'single', 'double', 'float', 'date', 'datetime', 'intptr', 'uintptr'];

 var keywords = wordRegexp(commonKeywords);
 var types = wordRegexp(commontypes);
 var stringPrefixes = '"';

 var opening = wordRegexp(openingKeywords);
 var middle = wordRegexp(middleKeywords);
 var closing = wordRegexp(endKeywords);
 var doubleClosing = wordRegexp(['end']);
 var doOpening = wordRegexp(['do']);

 var indentInfo = null;

 CodeMirror.registerHelper("hintWords", "vb", openingKeywords.concat(middleKeywords).concat(endKeywords)
                             .concat(operatorKeywords).concat(commonKeywords).concat(commontypes));

 function indent(_stream, state) {
   state.currentIndent++;
 }

 function dedent(_stream, state) {
   state.currentIndent--;
 }
 // tokenizers
 function tokenBase(stream, state) {
     if (stream.eatSpace()) {
         return null;
     }

     var ch = stream.peek();

     // Handle Comments
     if (ch === "'") {
         stream.skipToEnd();
         return 'comment';
     }


     // Handle Number Literals
     if (stream.match(/^((&H)|(&O))?[0-9\.a-f]/i, false)) {
         var floatLiteral = false;
         // Floats
         if (stream.match(/^\d*\.\d+F?/i)) { floatLiteral = true; }
         else if (stream.match(/^\d+\.\d*F?/)) { floatLiteral = true; }
         else if (stream.match(/^\.\d+F?/)) { floatLiteral = true; }

         if (floatLiteral) {
             // Float literals may be "imaginary"
             stream.eat(/J/i);
             return 'number';
         }
         // Integers
         var intLiteral = false;
         // Hex
         if (stream.match(/^&H[0-9a-f]+/i)) { intLiteral = true; }
         // Octal
         else if (stream.match(/^&O[0-7]+/i)) { intLiteral = true; }
         // Decimal
         else if (stream.match(/^[1-9]\d*F?/)) {
             // Decimal literals may be "imaginary"
             stream.eat(/J/i);
             // TODO - Can you have imaginary longs?
             intLiteral = true;
         }
         // Zero by itself with no other piece of number.
         else if (stream.match(/^0(?![\dx])/i)) { intLiteral = true; }
         if (intLiteral) {
             // Integer literals may be "long"
             stream.eat(/L/i);
             return 'number';
         }
     }

     // Handle Strings
     if (stream.match(stringPrefixes)) {
         state.tokenize = tokenStringFactory(stream.current());
         return state.tokenize(stream, state);
     }

     // Handle operators and Delimiters
     if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters)) {
         return null;
     }
     if (stream.match(doubleOperators)
         || stream.match(singleOperators)
         || stream.match(wordOperators)) {
         return 'operator';
     }
     if (stream.match(singleDelimiters)) {
         return null;
     }
     if (stream.match(doOpening)) {
         indent(stream,state);
         state.doInCurrentLine = true;
         return 'keyword';
     }
     if (stream.match(opening)) {
         if (! state.doInCurrentLine)
           indent(stream,state);
         else
           state.doInCurrentLine = false;
         return 'keyword';
     }
     if (stream.match(middle)) {
         return 'keyword';
     }

     if (stream.match(doubleClosing)) {
         dedent(stream,state);
         dedent(stream,state);
         return 'keyword';
     }
     if (stream.match(closing)) {
         dedent(stream,state);
         return 'keyword';
     }

     if (stream.match(types)) {
         return 'keyword';
     }

     if (stream.match(keywords)) {
         return 'keyword';
     }

     if (stream.match(identifiers)) {
         return 'variable';
     }

     // Handle non-detected items
     stream.next();
     return ERRORCLASS;
 }

 function tokenStringFactory(delimiter) {
     var singleline = delimiter.length == 1;
     var OUTCLASS = 'string';

     return function(stream, state) {
         while (!stream.eol()) {
             stream.eatWhile(/[^'"]/);
             if (stream.match(delimiter)) {
                 state.tokenize = tokenBase;
                 return OUTCLASS;
             } else {
                 stream.eat(/['"]/);
             }
         }
         if (singleline) {
             if (parserConf.singleLineStringErrors) {
                 return ERRORCLASS;
             } else {
                 state.tokenize = tokenBase;
             }
         }
         return OUTCLASS;
     };
 }


 function tokenLexer(stream, state) {
     var style = state.tokenize(stream, state);
     var current = stream.current();

     // Handle '.' connected identifiers
     if (current === '.') {
         style = state.tokenize(stream, state);
         if (style === 'variable') {
             return 'variable';
         } else {
             return ERRORCLASS;
         }
     }


     var delimiter_index = '[({'.indexOf(current);
     if (delimiter_index !== -1) {
         indent(stream, state );
     }
     if (indentInfo === 'dedent') {
         if (dedent(stream, state)) {
             return ERRORCLASS;
         }
     }
     delimiter_index = '])}'.indexOf(current);
     if (delimiter_index !== -1) {
         if (dedent(stream, state)) {
             return ERRORCLASS;
         }
     }

     return style;
 }

 var external = {
     electricChars:"dDpPtTfFeE ",
     startState: function() {
         return {
           tokenize: tokenBase,
           lastToken: null,
           currentIndent: 0,
           nextLineIndent: 0,
           doInCurrentLine: false


       };
     },

     token: function(stream, state) {
         if (stream.sol()) {
           state.currentIndent += state.nextLineIndent;
           state.nextLineIndent = 0;
           state.doInCurrentLine = 0;
         }
         var style = tokenLexer(stream, state);

         state.lastToken = {style:style, content: stream.current()};



         return style;
     },

     indent: function(state, textAfter) {
         var trueText = textAfter.replace(/^\s+|\s+$/g, '') ;
         if (trueText.match(closing) || trueText.match(doubleClosing) || trueText.match(middle)) return conf.indentUnit*(state.currentIndent-1);
         if(state.currentIndent < 0) return 0;
         return state.currentIndent * conf.indentUnit;
     },

     lineComment: "'"
 };
 return external;
});

CodeMirror.defineMIME("text/x-vb", "vb");

});

//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

/*
For extra ASP classic objects, initialize CodeMirror instance with this option:
 isASP: true

E.G.:
 var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
     lineNumbers: true,
     isASP: true
   });
*/

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("vbscript", function(conf, parserConf) {
 var ERRORCLASS = 'error';

 function wordRegexp(words) {
     return new RegExp("^((" + words.join(")|(") + "))\\b", "i");
 }

 var singleOperators = new RegExp("^[\\+\\-\\*/&\\\\\\^<>=]");
 var doubleOperators = new RegExp("^((<>)|(<=)|(>=))");
 var singleDelimiters = new RegExp('^[\\.,]');
 var brackets = new RegExp('^[\\(\\)]');
 var identifiers = new RegExp("^[A-Za-z][_A-Za-z0-9]*");

 var openingKeywords = ['class','sub','select','while','if','function', 'property', 'with', 'for'];
 var middleKeywords = ['else','elseif','case'];
 var endKeywords = ['next','loop','wend'];

 var wordOperators = wordRegexp(['and', 'or', 'not', 'xor', 'is', 'mod', 'eqv', 'imp']);
 var commonkeywords = ['dim', 'redim', 'then',  'until', 'randomize',
                       'byval','byref','new','property', 'exit', 'in',
                       'const','private', 'public',
                       'get','set','let', 'stop', 'on error resume next', 'on error goto 0', 'option explicit', 'call', 'me'];

 //This list was from: http://msdn.microsoft.com/en-us/library/f8tbc79x(v=vs.84).aspx
 var atomWords = ['true', 'false', 'nothing', 'empty', 'null'];
 //This list was from: http://msdn.microsoft.com/en-us/library/3ca8tfek(v=vs.84).aspx
 var builtinFuncsWords = ['abs', 'array', 'asc', 'atn', 'cbool', 'cbyte', 'ccur', 'cdate', 'cdbl', 'chr', 'cint', 'clng', 'cos', 'csng', 'cstr', 'date', 'dateadd', 'datediff', 'datepart',
                     'dateserial', 'datevalue', 'day', 'escape', 'eval', 'execute', 'exp', 'filter', 'formatcurrency', 'formatdatetime', 'formatnumber', 'formatpercent', 'getlocale', 'getobject',
                     'getref', 'hex', 'hour', 'inputbox', 'instr', 'instrrev', 'int', 'fix', 'isarray', 'isdate', 'isempty', 'isnull', 'isnumeric', 'isobject', 'join', 'lbound', 'lcase', 'left',
                     'len', 'loadpicture', 'log', 'ltrim', 'rtrim', 'trim', 'maths', 'mid', 'minute', 'month', 'monthname', 'msgbox', 'now', 'oct', 'replace', 'rgb', 'right', 'rnd', 'round',
                     'scriptengine', 'scriptenginebuildversion', 'scriptenginemajorversion', 'scriptengineminorversion', 'second', 'setlocale', 'sgn', 'sin', 'space', 'split', 'sqr', 'strcomp',
                     'string', 'strreverse', 'tan', 'time', 'timer', 'timeserial', 'timevalue', 'typename', 'ubound', 'ucase', 'unescape', 'vartype', 'weekday', 'weekdayname', 'year'];

 //This list was from: http://msdn.microsoft.com/en-us/library/ydz4cfk3(v=vs.84).aspx
 var builtinConsts = ['vbBlack', 'vbRed', 'vbGreen', 'vbYellow', 'vbBlue', 'vbMagenta', 'vbCyan', 'vbWhite', 'vbBinaryCompare', 'vbTextCompare',
                      'vbSunday', 'vbMonday', 'vbTuesday', 'vbWednesday', 'vbThursday', 'vbFriday', 'vbSaturday', 'vbUseSystemDayOfWeek', 'vbFirstJan1', 'vbFirstFourDays', 'vbFirstFullWeek',
                      'vbGeneralDate', 'vbLongDate', 'vbShortDate', 'vbLongTime', 'vbShortTime', 'vbObjectError',
                      'vbOKOnly', 'vbOKCancel', 'vbAbortRetryIgnore', 'vbYesNoCancel', 'vbYesNo', 'vbRetryCancel', 'vbCritical', 'vbQuestion', 'vbExclamation', 'vbInformation', 'vbDefaultButton1', 'vbDefaultButton2',
                      'vbDefaultButton3', 'vbDefaultButton4', 'vbApplicationModal', 'vbSystemModal', 'vbOK', 'vbCancel', 'vbAbort', 'vbRetry', 'vbIgnore', 'vbYes', 'vbNo',
                      'vbCr', 'VbCrLf', 'vbFormFeed', 'vbLf', 'vbNewLine', 'vbNullChar', 'vbNullString', 'vbTab', 'vbVerticalTab', 'vbUseDefault', 'vbTrue', 'vbFalse',
                      'vbEmpty', 'vbNull', 'vbInteger', 'vbLong', 'vbSingle', 'vbDouble', 'vbCurrency', 'vbDate', 'vbString', 'vbObject', 'vbError', 'vbBoolean', 'vbVariant', 'vbDataObject', 'vbDecimal', 'vbByte', 'vbArray'];
 //This list was from: http://msdn.microsoft.com/en-us/library/hkc375ea(v=vs.84).aspx
 var builtinObjsWords = ['WScript', 'err', 'debug', 'RegExp'];
 var knownProperties = ['description', 'firstindex', 'global', 'helpcontext', 'helpfile', 'ignorecase', 'length', 'number', 'pattern', 'source', 'value', 'count'];
 var knownMethods = ['clear', 'execute', 'raise', 'replace', 'test', 'write', 'writeline', 'close', 'open', 'state', 'eof', 'update', 'addnew', 'end', 'createobject', 'quit'];

 var aspBuiltinObjsWords = ['server', 'response', 'request', 'session', 'application'];
 var aspKnownProperties = ['buffer', 'cachecontrol', 'charset', 'contenttype', 'expires', 'expiresabsolute', 'isclientconnected', 'pics', 'status', //response
                           'clientcertificate', 'cookies', 'form', 'querystring', 'servervariables', 'totalbytes', //request
                           'contents', 'staticobjects', //application
                           'codepage', 'lcid', 'sessionid', 'timeout', //session
                           'scripttimeout']; //server
 var aspKnownMethods = ['addheader', 'appendtolog', 'binarywrite', 'end', 'flush', 'redirect', //response
                        'binaryread', //request
                        'remove', 'removeall', 'lock', 'unlock', //application
                        'abandon', //session
                        'getlasterror', 'htmlencode', 'mappath', 'transfer', 'urlencode']; //server

 var knownWords = knownMethods.concat(knownProperties);

 builtinObjsWords = builtinObjsWords.concat(builtinConsts);

 if (conf.isASP){
     builtinObjsWords = builtinObjsWords.concat(aspBuiltinObjsWords);
     knownWords = knownWords.concat(aspKnownMethods, aspKnownProperties);
 };

 var keywords = wordRegexp(commonkeywords);
 var atoms = wordRegexp(atomWords);
 var builtinFuncs = wordRegexp(builtinFuncsWords);
 var builtinObjs = wordRegexp(builtinObjsWords);
 var known = wordRegexp(knownWords);
 var stringPrefixes = '"';

 var opening = wordRegexp(openingKeywords);
 var middle = wordRegexp(middleKeywords);
 var closing = wordRegexp(endKeywords);
 var doubleClosing = wordRegexp(['end']);
 var doOpening = wordRegexp(['do']);
 var noIndentWords = wordRegexp(['on error resume next', 'exit']);
 var comment = wordRegexp(['rem']);


 function indent(_stream, state) {
   state.currentIndent++;
 }

 function dedent(_stream, state) {
   state.currentIndent--;
 }
 // tokenizers
 function tokenBase(stream, state) {
     if (stream.eatSpace()) {
         return 'space';
         //return null;
     }

     var ch = stream.peek();

     // Handle Comments
     if (ch === "'") {
         stream.skipToEnd();
         return 'comment';
     }
     if (stream.match(comment)){
         stream.skipToEnd();
         return 'comment';
     }


     // Handle Number Literals
     if (stream.match(/^((&H)|(&O))?[0-9\.]/i, false) && !stream.match(/^((&H)|(&O))?[0-9\.]+[a-z_]/i, false)) {
         var floatLiteral = false;
         // Floats
         if (stream.match(/^\d*\.\d+/i)) { floatLiteral = true; }
         else if (stream.match(/^\d+\.\d*/)) { floatLiteral = true; }
         else if (stream.match(/^\.\d+/)) { floatLiteral = true; }

         if (floatLiteral) {
             // Float literals may be "imaginary"
             stream.eat(/J/i);
             return 'number';
         }
         // Integers
         var intLiteral = false;
         // Hex
         if (stream.match(/^&H[0-9a-f]+/i)) { intLiteral = true; }
         // Octal
         else if (stream.match(/^&O[0-7]+/i)) { intLiteral = true; }
         // Decimal
         else if (stream.match(/^[1-9]\d*F?/)) {
             // Decimal literals may be "imaginary"
             stream.eat(/J/i);
             // TODO - Can you have imaginary longs?
             intLiteral = true;
         }
         // Zero by itself with no other piece of number.
         else if (stream.match(/^0(?![\dx])/i)) { intLiteral = true; }
         if (intLiteral) {
             // Integer literals may be "long"
             stream.eat(/L/i);
             return 'number';
         }
     }

     // Handle Strings
     if (stream.match(stringPrefixes)) {
         state.tokenize = tokenStringFactory(stream.current());
         return state.tokenize(stream, state);
     }

     // Handle operators and Delimiters
     if (stream.match(doubleOperators)
         || stream.match(singleOperators)
         || stream.match(wordOperators)) {
         return 'operator';
     }
     if (stream.match(singleDelimiters)) {
         return null;
     }

     if (stream.match(brackets)) {
         return "bracket";
     }

     if (stream.match(noIndentWords)) {
         state.doInCurrentLine = true;

         return 'keyword';
     }

     if (stream.match(doOpening)) {
         indent(stream,state);
         state.doInCurrentLine = true;

         return 'keyword';
     }
     if (stream.match(opening)) {
         if (! state.doInCurrentLine)
           indent(stream,state);
         else
           state.doInCurrentLine = false;

         return 'keyword';
     }
     if (stream.match(middle)) {
         return 'keyword';
     }


     if (stream.match(doubleClosing)) {
         dedent(stream,state);
         dedent(stream,state);

         return 'keyword';
     }
     if (stream.match(closing)) {
         if (! state.doInCurrentLine)
           dedent(stream,state);
         else
           state.doInCurrentLine = false;

         return 'keyword';
     }

     if (stream.match(keywords)) {
         return 'keyword';
     }

     if (stream.match(atoms)) {
         return 'atom';
     }

     if (stream.match(known)) {
         return 'variable-2';
     }

     if (stream.match(builtinFuncs)) {
         return 'builtin';
     }

     if (stream.match(builtinObjs)){
         return 'variable-2';
     }

     if (stream.match(identifiers)) {
         return 'variable';
     }

     // Handle non-detected items
     stream.next();
     return ERRORCLASS;
 }

 function tokenStringFactory(delimiter) {
     var singleline = delimiter.length == 1;
     var OUTCLASS = 'string';

     return function(stream, state) {
         while (!stream.eol()) {
             stream.eatWhile(/[^'"]/);
             if (stream.match(delimiter)) {
                 state.tokenize = tokenBase;
                 return OUTCLASS;
             } else {
                 stream.eat(/['"]/);
             }
         }
         if (singleline) {
             if (parserConf.singleLineStringErrors) {
                 return ERRORCLASS;
             } else {
                 state.tokenize = tokenBase;
             }
         }
         return OUTCLASS;
     };
 }


 function tokenLexer(stream, state) {
     var style = state.tokenize(stream, state);
     var current = stream.current();

     // Handle '.' connected identifiers
     if (current === '.') {
         style = state.tokenize(stream, state);

         current = stream.current();
         if (style && (style.substr(0, 8) === 'variable' || style==='builtin' || style==='keyword')){//|| knownWords.indexOf(current.substring(1)) > -1) {
             if (style === 'builtin' || style === 'keyword') style='variable';
             if (knownWords.indexOf(current.substr(1)) > -1) style='variable-2';

             return style;
         } else {
             return ERRORCLASS;
         }
     }

     return style;
 }

 var external = {
     electricChars:"dDpPtTfFeE ",
     startState: function() {
         return {
           tokenize: tokenBase,
           lastToken: null,
           currentIndent: 0,
           nextLineIndent: 0,
           doInCurrentLine: false,
           ignoreKeyword: false


       };
     },

     token: function(stream, state) {
         if (stream.sol()) {
           state.currentIndent += state.nextLineIndent;
           state.nextLineIndent = 0;
           state.doInCurrentLine = 0;
         }
         var style = tokenLexer(stream, state);

         state.lastToken = {style:style, content: stream.current()};

         if (style==='space') style=null;

         return style;
     },

     indent: function(state, textAfter) {
         var trueText = textAfter.replace(/^\s+|\s+$/g, '') ;
         if (trueText.match(closing) || trueText.match(doubleClosing) || trueText.match(middle)) return conf.indentUnit*(state.currentIndent-1);
         if(state.currentIndent < 0) return 0;
         return state.currentIndent * conf.indentUnit;
     }

 };
 return external;
});

CodeMirror.defineMIME("text/vbscript", "vbscript");

});


//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
if (typeof exports == "object" && typeof module == "object") // CommonJS
 mod(require("../../lib/codemirror"));
else if (typeof define == "function" && define.amd) // AMD
 define(["../../lib/codemirror"], mod);
else // Plain browser env
 mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("velocity", function() {
 function parseWords(str) {
     var obj = {}, words = str.split(" ");
     for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
     return obj;
 }

 var keywords = parseWords("#end #else #break #stop #[[ #]] " +
                           "#{end} #{else} #{break} #{stop}");
 var functions = parseWords("#if #elseif #foreach #set #include #parse #macro #define #evaluate " +
                            "#{if} #{elseif} #{foreach} #{set} #{include} #{parse} #{macro} #{define} #{evaluate}");
 var specials = parseWords("$foreach.count $foreach.hasNext $foreach.first $foreach.last $foreach.topmost $foreach.parent.count $foreach.parent.hasNext $foreach.parent.first $foreach.parent.last $foreach.parent $velocityCount $!bodyContent $bodyContent");
 var isOperatorChar = /[+\-*&%=<>!?:\/|]/;

 function chain(stream, state, f) {
     state.tokenize = f;
     return f(stream, state);
 }
 function tokenBase(stream, state) {
     var beforeParams = state.beforeParams;
     state.beforeParams = false;
     var ch = stream.next();
     // start of unparsed string?
     if ((ch == "'") && !state.inString && state.inParams) {
         state.lastTokenWasBuiltin = false;
         return chain(stream, state, tokenString(ch));
     }
     // start of parsed string?
     else if ((ch == '"')) {
         state.lastTokenWasBuiltin = false;
         if (state.inString) {
             state.inString = false;
             return "string";
         }
         else if (state.inParams)
             return chain(stream, state, tokenString(ch));
     }
     // is it one of the special signs []{}().,;? Separator?
     else if (/[\[\]{}\(\),;\.]/.test(ch)) {
         if (ch == "(" && beforeParams)
             state.inParams = true;
         else if (ch == ")") {
             state.inParams = false;
             state.lastTokenWasBuiltin = true;
         }
         return null;
     }
     // start of a number value?
     else if (/\d/.test(ch)) {
         state.lastTokenWasBuiltin = false;
         stream.eatWhile(/[\w\.]/);
         return "number";
     }
     // multi line comment?
     else if (ch == "#" && stream.eat("*")) {
         state.lastTokenWasBuiltin = false;
         return chain(stream, state, tokenComment);
     }
     // unparsed content?
     else if (ch == "#" && stream.match(/ *\[ *\[/)) {
         state.lastTokenWasBuiltin = false;
         return chain(stream, state, tokenUnparsed);
     }
     // single line comment?
     else if (ch == "#" && stream.eat("#")) {
         state.lastTokenWasBuiltin = false;
         stream.skipToEnd();
         return "comment";
     }
     // variable?
     else if (ch == "$") {
         stream.eatWhile(/[\w\d\$_\.{}-]/);
         // is it one of the specials?
         if (specials && specials.propertyIsEnumerable(stream.current())) {
             return "keyword";
         }
         else {
             state.lastTokenWasBuiltin = true;
             state.beforeParams = true;
             return "builtin";
         }
     }
     // is it a operator?
     else if (isOperatorChar.test(ch)) {
         state.lastTokenWasBuiltin = false;
         stream.eatWhile(isOperatorChar);
         return "operator";
     }
     else {
         // get the whole word
         stream.eatWhile(/[\w\$_{}@]/);
         var word = stream.current();
         // is it one of the listed keywords?
         if (keywords && keywords.propertyIsEnumerable(word))
             return "keyword";
         // is it one of the listed functions?
         if (functions && functions.propertyIsEnumerable(word) ||
                 (stream.current().match(/^#@?[a-z0-9_]+ *$/i) && stream.peek()=="(") &&
                  !(functions && functions.propertyIsEnumerable(word.toLowerCase()))) {
             state.beforeParams = true;
             state.lastTokenWasBuiltin = false;
             return "keyword";
         }
         if (state.inString) {
             state.lastTokenWasBuiltin = false;
             return "string";
         }
         if (stream.pos > word.length && stream.string.charAt(stream.pos-word.length-1)=="." && state.lastTokenWasBuiltin)
             return "builtin";
         // default: just a "word"
         state.lastTokenWasBuiltin = false;
         return null;
     }
 }

 function tokenString(quote) {
     return function(stream, state) {
         var escaped = false, next, end = false;
         while ((next = stream.next()) != null) {
             if ((next == quote) && !escaped) {
                 end = true;
                 break;
             }
             if (quote=='"' && stream.peek() == '$' && !escaped) {
                 state.inString = true;
                 end = true;
                 break;
             }
             escaped = !escaped && next == "\\";
         }
         if (end) state.tokenize = tokenBase;
         return "string";
     };
 }

 function tokenComment(stream, state) {
     var maybeEnd = false, ch;
     while (ch = stream.next()) {
         if (ch == "#" && maybeEnd) {
             state.tokenize = tokenBase;
             break;
         }
         maybeEnd = (ch == "*");
     }
     return "comment";
 }

 function tokenUnparsed(stream, state) {
     var maybeEnd = 0, ch;
     while (ch = stream.next()) {
         if (ch == "#" && maybeEnd == 2) {
             state.tokenize = tokenBase;
             break;
         }
         if (ch == "]")
             maybeEnd++;
         else if (ch != " ")
             maybeEnd = 0;
     }
     return "meta";
 }
 // Interface

 return {
     startState: function() {
         return {
             tokenize: tokenBase,
             beforeParams: false,
             inParams: false,
             inString: false,
             lastTokenWasBuiltin: false
         };
     },

     token: function(stream, state) {
         if (stream.eatSpace()) return null;
         return state.tokenize(stream, state);
     },
     blockCommentStart: "#*",
     blockCommentEnd: "*#",
     lineComment: "##",
     fold: "velocity"
 };
});

CodeMirror.defineMIME("text/velocity", "velocity");

});

     
  // CodeMirror, copyright (c) by Marijn Haverbeke and others
  // Distributed under an MIT license: https://codemirror.net/LICENSE

  (function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
      mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
      define(["../../lib/codemirror"], mod);
    else // Plain browser env
      mod(CodeMirror);
  })(function(CodeMirror) {
  "use strict";

  var htmlConfig = {
    autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                      'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                      'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                      'track': true, 'wbr': true, 'menuitem': true},
    implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                       'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                       'th': true, 'tr': true},
    contextGrabbers: {
      'dd': {'dd': true, 'dt': true},
      'dt': {'dd': true, 'dt': true},
      'li': {'li': true},
      'option': {'option': true, 'optgroup': true},
      'optgroup': {'optgroup': true},
      'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
            'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
            'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
            'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
            'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
      'rp': {'rp': true, 'rt': true},
      'rt': {'rp': true, 'rt': true},
      'tbody': {'tbody': true, 'tfoot': true},
      'td': {'td': true, 'th': true},
      'tfoot': {'tbody': true},
      'th': {'td': true, 'th': true},
      'thead': {'tbody': true, 'tfoot': true},
      'tr': {'tr': true}
    },
    doNotIndent: {"pre": true},
    allowUnquoted: true,
    allowMissing: true,
    caseFold: true
  }

  var xmlConfig = {
    autoSelfClosers: {},
    implicitlyClosed: {},
    contextGrabbers: {},
    doNotIndent: {},
    allowUnquoted: false,
    allowMissing: false,
    allowMissingTagName: false,
    caseFold: false
  }

  CodeMirror.defineMode("xml", function(editorConf, config_) {
    var indentUnit = editorConf.indentUnit
    var config = {}
    var defaults = config_.htmlMode ? htmlConfig : xmlConfig
    for (var prop in defaults) config[prop] = defaults[prop]
    for (var prop in config_) config[prop] = config_[prop]

    // Return variables for tokenizers
    var type, setStyle;

    function inText(stream, state) {
      function chain(parser) {
        state.tokenize = parser;
        return parser(stream, state);
      }

      var ch = stream.next();
      if (ch == "<") {
        if (stream.eat("!")) {
          if (stream.eat("[")) {
            if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
            else return null;
          } else if (stream.match("--")) {
            return chain(inBlock("comment", "-->"));
          } else if (stream.match("DOCTYPE", true, true)) {
            stream.eatWhile(/[\w\._\-]/);
            return chain(doctype(1));
          } else {
            return null;
          }
        } else if (stream.eat("?")) {
          stream.eatWhile(/[\w\._\-]/);
          state.tokenize = inBlock("meta", "?>");
          return "meta";
        } else {
          type = stream.eat("/") ? "closeTag" : "openTag";
          state.tokenize = inTag;
          return "tag bracket";
        }
      } else if (ch == "&") {
        var ok;
        if (stream.eat("#")) {
          if (stream.eat("x")) {
            ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
          } else {
            ok = stream.eatWhile(/[\d]/) && stream.eat(";");
          }
        } else {
          ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
        }
        return ok ? "atom" : "error";
      } else {
        stream.eatWhile(/[^&<]/);
        return null;
      }
    }
    inText.isInText = true;

    function inTag(stream, state) {
      var ch = stream.next();
      if (ch == ">" || (ch == "/" && stream.eat(">"))) {
        state.tokenize = inText;
        type = ch == ">" ? "endTag" : "selfcloseTag";
        return "tag bracket";
      } else if (ch == "=") {
        type = "equals";
        return null;
      } else if (ch == "<") {
        state.tokenize = inText;
        state.state = baseState;
        state.tagName = state.tagStart = null;
        var next = state.tokenize(stream, state);
        return next ? next + " tag error" : "tag error";
      } else if (/[\'\"]/.test(ch)) {
        state.tokenize = inAttribute(ch);
        state.stringStartCol = stream.column();
        return state.tokenize(stream, state);
      } else {
        stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
        return "word";
      }
    }

    function inAttribute(quote) {
      var closure = function(stream, state) {
        while (!stream.eol()) {
          if (stream.next() == quote) {
            state.tokenize = inTag;
            break;
          }
        }
        return "string";
      };
      closure.isInAttribute = true;
      return closure;
    }

    function inBlock(style, terminator) {
      return function(stream, state) {
        while (!stream.eol()) {
          if (stream.match(terminator)) {
            state.tokenize = inText;
            break;
          }
          stream.next();
        }
        return style;
      }
    }

    function doctype(depth) {
      return function(stream, state) {
        var ch;
        while ((ch = stream.next()) != null) {
          if (ch == "<") {
            state.tokenize = doctype(depth + 1);
            return state.tokenize(stream, state);
          } else if (ch == ">") {
            if (depth == 1) {
              state.tokenize = inText;
              break;
            } else {
              state.tokenize = doctype(depth - 1);
              return state.tokenize(stream, state);
            }
          }
        }
        return "meta";
      };
    }

    function Context(state, tagName, startOfLine) {
      this.prev = state.context;
      this.tagName = tagName || "";
      this.indent = state.indented;
      this.startOfLine = startOfLine;
      if (config.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
        this.noIndent = true;
    }
    function popContext(state) {
      if (state.context) state.context = state.context.prev;
    }
    function maybePopContext(state, nextTagName) {
      var parentTagName;
      while (true) {
        if (!state.context) {
          return;
        }
        parentTagName = state.context.tagName;
        if (!config.contextGrabbers.hasOwnProperty(parentTagName) ||
            !config.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
          return;
        }
        popContext(state);
      }
    }

    function baseState(type, stream, state) {
      if (type == "openTag") {
        state.tagStart = stream.column();
        return tagNameState;
      } else if (type == "closeTag") {
        return closeTagNameState;
      } else {
        return baseState;
      }
    }
    function tagNameState(type, stream, state) {
      if (type == "word") {
        state.tagName = stream.current();
        setStyle = "tag";
        return attrState;
      } else if (config.allowMissingTagName && type == "endTag") {
        setStyle = "tag bracket";
        return attrState(type, stream, state);
      } else {
        setStyle = "error";
        return tagNameState;
      }
    }
    function closeTagNameState(type, stream, state) {
      if (type == "word") {
        var tagName = stream.current();
        if (state.context && state.context.tagName != tagName &&
            config.implicitlyClosed.hasOwnProperty(state.context.tagName))
          popContext(state);
        if ((state.context && state.context.tagName == tagName) || config.matchClosing === false) {
          setStyle = "tag";
          return closeState;
        } else {
          setStyle = "tag error";
          return closeStateErr;
        }
      } else if (config.allowMissingTagName && type == "endTag") {
        setStyle = "tag bracket";
        return closeState(type, stream, state);
      } else {
        setStyle = "error";
        return closeStateErr;
      }
    }

    function closeState(type, _stream, state) {
      if (type != "endTag") {
        setStyle = "error";
        return closeState;
      }
      popContext(state);
      return baseState;
    }
    function closeStateErr(type, stream, state) {
      setStyle = "error";
      return closeState(type, stream, state);
    }

    function attrState(type, _stream, state) {
      if (type == "word") {
        setStyle = "attribute";
        return attrEqState;
      } else if (type == "endTag" || type == "selfcloseTag") {
        var tagName = state.tagName, tagStart = state.tagStart;
        state.tagName = state.tagStart = null;
        if (type == "selfcloseTag" ||
            config.autoSelfClosers.hasOwnProperty(tagName)) {
          maybePopContext(state, tagName);
        } else {
          maybePopContext(state, tagName);
          state.context = new Context(state, tagName, tagStart == state.indented);
        }
        return baseState;
      }
      setStyle = "error";
      return attrState;
    }
    function attrEqState(type, stream, state) {
      if (type == "equals") return attrValueState;
      if (!config.allowMissing) setStyle = "error";
      return attrState(type, stream, state);
    }
    function attrValueState(type, stream, state) {
      if (type == "string") return attrContinuedState;
      if (type == "word" && config.allowUnquoted) {setStyle = "string"; return attrState;}
      setStyle = "error";
      return attrState(type, stream, state);
    }
    function attrContinuedState(type, stream, state) {
      if (type == "string") return attrContinuedState;
      return attrState(type, stream, state);
    }

    return {
      startState: function(baseIndent) {
        var state = {tokenize: inText,
                     state: baseState,
                     indented: baseIndent || 0,
                     tagName: null, tagStart: null,
                     context: null}
        if (baseIndent != null) state.baseIndent = baseIndent
        return state
      },

      token: function(stream, state) {
        if (!state.tagName && stream.sol())
          state.indented = stream.indentation();

        if (stream.eatSpace()) return null;
        type = null;
        var style = state.tokenize(stream, state);
        if ((style || type) && style != "comment") {
          setStyle = null;
          state.state = state.state(type || style, stream, state);
          if (setStyle)
            style = setStyle == "error" ? style + " error" : setStyle;
        }
        return style;
      },

      indent: function(state, textAfter, fullLine) {
        var context = state.context;
        // Indent multi-line strings (e.g. css).
        if (state.tokenize.isInAttribute) {
          if (state.tagStart == state.indented)
            return state.stringStartCol + 1;
          else
            return state.indented + indentUnit;
        }
        if (context && context.noIndent) return CodeMirror.Pass;
        if (state.tokenize != inTag && state.tokenize != inText)
          return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
        // Indent the starts of attribute names.
        if (state.tagName) {
          if (config.multilineTagIndentPastTag !== false)
            return state.tagStart + state.tagName.length + 2;
          else
            return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
        }
        if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
        var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
        if (tagAfter && tagAfter[1]) { // Closing tag spotted
          while (context) {
            if (context.tagName == tagAfter[2]) {
              context = context.prev;
              break;
            } else if (config.implicitlyClosed.hasOwnProperty(context.tagName)) {
              context = context.prev;
            } else {
              break;
            }
          }
        } else if (tagAfter) { // Opening tag spotted
          while (context) {
            var grabbers = config.contextGrabbers[context.tagName];
            if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
              context = context.prev;
            else
              break;
          }
        }
        while (context && context.prev && !context.startOfLine)
          context = context.prev;
        if (context) return context.indent + indentUnit;
        else return state.baseIndent || 0;
      },

      electricInput: /<\/[\s\w:]+>$/,
      blockCommentStart: "<!--",
      blockCommentEnd: "-->",

      configuration: config.htmlMode ? "html" : "xml",
      helperType: config.htmlMode ? "html" : "xml",

      skipAttribute: function(state) {
        if (state.state == attrValueState)
          state.state = attrState
      },

      xmlCurrentTag: function(state) {
        return state.tagName ? {name: state.tagName, close: state.type == "closeTag"} : null
      },

      xmlCurrentContext: function(state) {
        var context = []
        for (var cx = state.context; cx; cx = cx.prev)
          context.push(cx.tagName)
        return context.reverse()
      }
    };
  });

  CodeMirror.defineMIME("text/xml", "xml");
  CodeMirror.defineMIME("application/xml", "xml");
  if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
    CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

  });

  
//CodeMirror, copyright (c) by Marijn Haverbeke and others
//Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
 if (typeof exports == "object" && typeof module == "object") // CommonJS
   mod(require("../../lib/codemirror"));
 else if (typeof define == "function" && define.amd) // AMD
   define(["../../lib/codemirror"], mod);
 else // Plain browser env
   mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("yaml", function() {

 var cons = ['true', 'false', 'on', 'off', 'yes', 'no'];
 var keywordRegex = new RegExp("\\b(("+cons.join(")|(")+"))$", 'i');

 return {
   token: function(stream, state) {
     var ch = stream.peek();
     var esc = state.escaped;
     state.escaped = false;
     /* comments */
     if (ch == "#" && (stream.pos == 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))) {
       stream.skipToEnd();
       return "comment";
     }

     if (stream.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/))
       return "string";

     if (state.literal && stream.indentation() > state.keyCol) {
       stream.skipToEnd(); return "string";
     } else if (state.literal) { state.literal = false; }
     if (stream.sol()) {
       state.keyCol = 0;
       state.pair = false;
       state.pairStart = false;
       /* document start */
       if(stream.match('---')) { return "def"; }
       /* document end */
       if (stream.match('...')) { return "def"; }
       /* array list item */
       if (stream.match(/\s*-\s+/)) { return 'meta'; }
     }
     /* inline pairs/lists */
     if (stream.match(/^(\{|\}|\[|\])/)) {
       if (ch == '{')
         state.inlinePairs++;
       else if (ch == '}')
         state.inlinePairs--;
       else if (ch == '[')
         state.inlineList++;
       else
         state.inlineList--;
       return 'meta';
     }

     /* list separator */
     if (state.inlineList > 0 && !esc && ch == ',') {
       stream.next();
       return 'meta';
     }
     /* pairs separator */
     if (state.inlinePairs > 0 && !esc && ch == ',') {
       state.keyCol = 0;
       state.pair = false;
       state.pairStart = false;
       stream.next();
       return 'meta';
     }

     /* start of value of a pair */
     if (state.pairStart) {
       /* block literals */
       if (stream.match(/^\s*(\||\>)\s*/)) { state.literal = true; return 'meta'; };
       /* references */
       if (stream.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i)) { return 'variable-2'; }
       /* numbers */
       if (state.inlinePairs == 0 && stream.match(/^\s*-?[0-9\.\,]+\s?$/)) { return 'number'; }
       if (state.inlinePairs > 0 && stream.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/)) { return 'number'; }
       /* keywords */
       if (stream.match(keywordRegex)) { return 'keyword'; }
     }

     /* pairs (associative arrays) -> key */
     if (!state.pair && stream.match(/^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^,\[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/)) {
       state.pair = true;
       state.keyCol = stream.indentation();
       return "atom";
     }
     if (state.pair && stream.match(/^:\s*/)) { state.pairStart = true; return 'meta'; }

     /* nothing found, continue */
     state.pairStart = false;
     state.escaped = (ch == '\\');
     stream.next();
     return null;
   },
   startState: function() {
     return {
       pair: false,
       pairStart: false,
       keyCol: 0,
       inlinePairs: 0,
       inlineList: 0,
       literal: false,
       escaped: false
     };
   },
   lineComment: "#",
   fold: "indent"
 };
});

CodeMirror.defineMIME("text/x-yaml", "yaml");
CodeMirror.defineMIME("text/yaml", "yaml");

});
