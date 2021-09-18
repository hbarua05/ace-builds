ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DocCommentHighlightRules = function() {
    this.$rules = {
        "start" : [ {
            token : "comment.doc.tag",
            regex : "@[\\w\\d_]+" // TODO: fix email addresses
        }, 
        DocCommentHighlightRules.getTagRule(),
        {
            defaultToken : "comment.doc",
            caseInsensitive: true
        }]
    };
};

oop.inherits(DocCommentHighlightRules, TextHighlightRules);

DocCommentHighlightRules.getTagRule = function(start) {
    return {
        token : "comment.doc.tag.storage.type",
        regex : "\\b(?:TODO|FIXME|XXX|HACK)\\b"
    };
};

DocCommentHighlightRules.getStartRule = function(start) {
    return {
        token : "comment.doc", // doc comment
        regex : "\\/\\*(?=\\*)",
        next  : start
    };
};

DocCommentHighlightRules.getEndRule = function (start) {
    return {
        token : "comment.doc", // closing comment
        regex : "\\*\\/",
        next  : start
    };
};


exports.DocCommentHighlightRules = DocCommentHighlightRules;

});

ace.define("ace/mode/java_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var JavaHighlightRules = function() {
    var keywords = (
    "abstract|continue|for|new|switch|" +
    "assert|default|goto|package|synchronized|" +
    "boolean|do|if|private|this|" +
    "break|double|implements|protected|throw|" +
    "byte|else|import|public|throws|" +
    "case|enum|instanceof|return|transient|" +
    "catch|extends|int|short|try|" +
    "char|final|interface|static|void|" +
    "class|finally|long|strictfp|volatile|" +
    "const|float|native|super|while|" +
    "var|"+

    "color|hex"
    );

    var buildinConstants = ("null|Infinity|NaN|undefined|ARGS_DENSITY|ARGS_DISPLAY|ARGS_EDITOR_LOCATION|ARGS_EXTERNAL|ARGS_HIDE_STOP|ARGS_LOCATION|ARGS_PRESENT|ARGS_SKETCH_FOLDER|ARGS_STOP_COLOR|ARGS_WINDOW_COLOR|DEFAULT_HEIGHT|DEFAULT_WIDTH|EXTERNAL_MOVE|EXTERNAL_STOP|ADD|ALPHA|ALT|AMBIENT|ARC|ARGB|ARROW|BACKSPACE|BASELINE|BEVEL|BEZIER_VERTEX|BLEND|BLUR|BOTTOM|BOX|BREAK|BURN|CENTER|CHATTER|CHORD|CLAMP|CLOSE|CODED|COMPLAINT|CONTROL|CORNER|CORNERS|CROSS|CURVE_VERTEX|CUSTOM|DARKEST|DEG_TO_RAD|DELETE|DIAMETER|DIFFERENCE|DILATE|DIRECTIONAL|DISABLE_ASYNC_SAVEFRAME|DISABLE_BUFFER_READING|DISABLE_DEPTH_MASK|DISABLE_DEPTH_SORT|DISABLE_DEPTH_TEST|DISABLE_KEY_REPEAT|DISABLE_NATIVE_FONTS|DISABLE_OPENGL_ERRORS|DISABLE_OPTIMIZED_STROKE|DISABLE_STROKE_PERSPECTIVE|DISABLE_STROKE_PURE|DISABLE_TEXTURE_MIPMAPS|DODGE|DOWN|DXF|ELLIPSE|ENABLE_ASYNC_SAVEFRAME|ENABLE_BUFFER_READING|ENABLE_DEPTH_MASK|ENABLE_DEPTH_SORT|ENABLE_DEPTH_TEST|ENABLE_KEY_REPEAT|ENABLE_NATIVE_FONTS|ENABLE_OPENGL_ERRORS|ENABLE_OPTIMIZED_STROKE|ENABLE_STROKE_PERSPECTIVE|ENABLE_STROKE_PURE|ENABLE_TEXTURE_MIPMAPS|ENTER|EPSILON|ERODE|ESC|EXCLUSION|GIF|GRAY|GROUP|HALF_PI|HAND|HARD_LIGHT|HINT_COUNT|HSB|IMAGE|INVERT|JPEG|LANDSCAPE|LEFT|LIGHTEST|LINE|LINE_LOOP|LINE_STRIP|LINES|LINUX|MACOSX|MAX_FLOAT|MAX_INT|MIN_FLOAT|MIN_INT|MITER|MODEL|MODELVIEW|MOVE|MULTIPLY|NORMAL|OPAQUE|OPEN|OPENGL|ORTHOGRAPHIC|OTHER|OVERLAY|PATH|PDF|PERSPECTIVE|PI|PIE|POINT|POINTS|POLYGON|PORTRAIT|POSTERIZE|PROBLEM|PROJECT|PROJECTION|QUAD|QUAD_BEZIER_VERTEX|QUAD_STRIP|QUADRATIC_VERTEX|QUADS|QUARTER_PI|RAD_TO_DEG|RADIUS|RECT|REPEAT|REPLACE|RETURN|RGB|RIGHT|ROUND|SCREEN|SHAPE|SHIFT|SOFT_LIGHT|SPAN|SPHERE|SPOT|SQUARE|SUBTRACT|SVG|TAB|TARGA|TAU|TEXT|THIRD_PI|THRESHOLD|TIFF|TOP|TRIANGLE|TRIANGLE_FAN|TRIANGLE_STRIP|TRIANGLES|TWO_PI|UP|VERTEX|WAIT|WHITESPACE|WINDOWS|AB|AG|AR|BEEN_LIT|DA|DB|DEFAULT_VERTICES|DG|DR|EB|EDGE|EG|ER|HAS_NORMAL|NX|NY|NZ|SA|SB|SG|SHINE|SPB|SPG|SPR|SR|SW|TX|TY|TZ|VERTEX_FIELD_COUNT|VW|VX|VY|VZ|ALPHA_MASK|BLUE_MASK|GREEN_MASK|RED_MASK|GEOMETRY|INSIDE_BEGIN_END_ERROR|NO_SUCH_VERTEX_ERROR|NO_VERTICES_ERROR|PATH|GEOMETRY|NOT_A_SIMPLE_VERTEX|OUTSIDE_BEGIN_END_ERROR|PATH|PER_VERTEX_UNSUPPORTED|PRIMITIVE|MIN_WINDOW_HEIGHT|MIN_WINDOW_WIDTH|CATEGORY|DOUBLE|FLOAT|INT|LONG|STRING|ALT|CTRL|KEY|META|MOUSE|SHIFT|TOUCH|PRESS|RELEASE|TYPE|CLICK|DRAG|ENTER|EXIT|MOVE|PRESS|RELEASE|WHEEL|CAP_BUTT|CAP_ROUND|CAP_SQUARE|JOIN_BEVEL|JOIN_MITER|JOIN_ROUND|SEG_CLOSE|SEG_LINETO|SEG_MOVETO|WIND_EVEN_ODD|WIND_NON_ZERO|FRAMEBUFFER_ERROR|MISSING_FBO_ERROR|MISSING_GLFUNC_ERROR|GL|MISSING_GLSL_ERROR|GLSL|NONPRIMARY_ERROR|PGL|TEXUNIT_ERROR|UNSUPPORTED_GLPROF_ERROR|WIKI|PJOGL|AWT|NEWT|DIRECTION|NORMAL|OFFSET|POSITION|TEXCOORD|MAX_BUFFER_CACHE_SIZE");


    var langClasses = (
        "AbstractMethodError|AssertionError|ClassCircularityError|"+
        "ClassFormatError|Deprecated|EnumConstantNotPresentException|"+
        "ExceptionInInitializerError|IllegalAccessError|"+
        "IllegalThreadStateException|InstantiationError|InternalError|"+
        "NegativeArraySizeException|NoSuchFieldError|Override|Process|"+
        "ProcessBuilder|SecurityManager|StringIndexOutOfBoundsException|"+
        "SuppressWarnings|TypeNotPresentException|UnknownError|"+
        "UnsatisfiedLinkError|UnsupportedClassVersionError|VerifyError|"+
        "InstantiationException|IndexOutOfBoundsException|"+
        "ArrayIndexOutOfBoundsException|CloneNotSupportedException|"+
        "NoSuchFieldException|IllegalArgumentException|NumberFormatException|"+
        "SecurityException|Void|InheritableThreadLocal|IllegalStateException|"+
        "InterruptedException|NoSuchMethodException|IllegalAccessException|"+
        "UnsupportedOperationException|Enum|StrictMath|Package|Compiler|"+
        "Readable|Runtime|StringBuilder|Math|IncompatibleClassChangeError|"+
        "NoSuchMethodError|ThreadLocal|RuntimePermission|ArithmeticException|"+
        "NullPointerException|Long|Integer|Short|Byte|Double|Number|Float|"+
        "Character|Boolean|StackTraceElement|Appendable|StringBuffer|"+
        "Iterable|ThreadGroup|Runnable|Thread|IllegalMonitorStateException|"+
        "StackOverflowError|OutOfMemoryError|VirtualMachineError|"+
        "ArrayStoreException|ClassCastException|LinkageError|"+
        "NoClassDefFoundError|ClassNotFoundException|RuntimeException|"+
        "Exception|ThreadDeath|Error|Throwable|System|ClassLoader|"+
        "Cloneable|Class|CharSequence|Comparable|String|Object|"+

        "DoubleDict|DoubleList|Event|"+
        "FloatDict|FloatList|FrameBuffer|IntDict|IntList|"+
        "JSONArray|JSONObject|KeyEvent|LinePath|LinePath.PathIterator|"+
        "LineStroker|LongDict|LongList|MouseEvent|PApplet|"+
        "PConstants|PFont|PGL|PGraphics|PGraphics2D|"+
        "PGraphics3D|PGraphicsFX2D|PGraphicsJava2D|PGraphicsOpenGL|PImage|"+
        "PJOGL|PMatrix|PMatrix2D|PMatrix3D|PShader|"+
        "PShape|PShapeJava2D|PShapeOBJ|PShapeOpenGL|PShapeSVG|"+
        "PShapeSVG.Font|PShapeSVG.FontGlyph|PShapeSVG.Gradient|PShapeSVG.LinearGradient|PShapeSVG.LineOfText|"+
        "PShapeSVG.RadialGradient|PShapeSVG.Text|PStyle|PSurface|PSurfaceAWT|"+
        "PSurfaceFX|PSurfaceFX.PApplicationFX|PSurfaceJOGL|PSurfaceNone|PVector|"+
        "Sort|StringDict|StringList|Table|TableRow|"+
        "Texture|Texture.Parameters|ThinkDifferent|TouchEvent|VertexBuffer|"+
        "XML|"+

        "delay|draw|exit|loop|noLoop|"+
        "popStyle|pushStyle|redraw|setup|size|"+
        "cursor|focused|frameCount|frameRate|frameRate|"+
        "height|noCursor|online|screen|width|"+
        "Array|ArrayList|HashMap|Object|String|"+
        "XMLElement|binary|str|unbinary|unhex|"+
        "join|match|matchAll|nf|nfc|"+
        "nfp|nfs|split|splitTokens|trim|"+
        "Array Functions|append|arrayCopy|concat|expand|"+
        "reverse|shorten|sort|splice|subset|"+
        "PShape|arc|ellipse|line|point|"+
        "quad|rect|triangle|bezier|bezierDetail|"+
        "bezierPoint|bezierTangent|curve|curveDetail|curvePoint|"+
        "curveTangent|curveTightness|box|sphere|sphereDetail|"+
        "ellipseMode|noSmooth|rectMode|smooth|strokeCap|"+
        "strokeJoin|strokeWeight|beginShape|bezierVertex|curveVertex|"+
        "endShape|texture|textureMode|vertex|loadShape|"+
        "shape|shapeMode|mouseButton|mouseClicked|mouseDragged|"+
        "mouseMoved|mousePressed|mousePressed|mouseReleased|mouseX|"+
        "mouseY|pmouseX|pmouseY|key|keyCode|"+
        "keyPressed|keyPressed|keyReleased|keyTyped|BufferedReader|"+
        "createInput|createReader|loadBytes|loadStrings|open|"+
        "selectFolder|selectInput|link|param|status|"+
        "day|hour|millis|minute|month|"+
        "second|year|print|println|save|"+
        "saveFrame|PrintWriter|beginRaw|beginRecord|createOutput|"+
        "createWriter|endRaw|endRecord|saveBytes|saveStream|"+
        "saveStrings|selectOutput|applyMatrix|popMatrix|printMatrix|"+
        "pushMatrix|resetMatrix|rotate|rotateX|rotateY|"+
        "rotateZ|scale|shearX|shearY|translate|"+
        "ambientLight|directionalLight|lightFalloff|lightSpecular|lights|"+
        "noLights|normal|pointLight|spotLight|beginCamera|"+
        "camera|endCamera|frustum|ortho|perspective|"+
        "printCamera|printProjection|modelX|modelY|modelZ|"+
        "screenX|screenY|screenZ|ambient|emissive|"+
        "shininess|specular|background|colorMode|fill|"+
        "noFill|noStroke|stroke|alpha|blendColor|"+
        "blue|brightness|color|green|hue|"+
        "lerpColor|red|saturation|PImage|createImage|"+
        "image|imageMode|loadImage|noTint|requestImage|"+
        "tint|blend|copy|filter|get|"+
        "loadPixels|pixels[]|set|updatePixels|PGraphics|"+
        "createGraphics|hint|PFont|Loading & Displaying|createFont|"+
        "loadFont|text|textFont|textAlign|textLeading|"+
        "textMode|textSize|textWidth|textAscent|textDescent|"+
        "PVector|abs|ceil|constrain|dist|"+
        "exp|floor|lerp|log|mag|"+
        "map|max|min|norm|pow|"+
        "round|sq|sqrt|acos|asin|"+
        "atan|atan2|cos|degrees|radians|"+
        "sin|tan|noise|noiseDetail|noiseSeed|"+
        "random|randomSeed|transform"


    );

    var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": keywords,
        "constant.language": buildinConstants,
        "support.function": langClasses
    }, "identifier");

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "constant.numeric", // hex
                regex : /0(?:[xX][0-9a-fA-F][0-9a-fA-F_]*|[bB][01][01_]*)[LlSsDdFfYy]?\b/
            }, {
                token : "constant.numeric", // float
                regex : /[+-]?\d[\d_]*(?:(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?)?[LlSsDdFfYy]?\b/
            }, {
                token : "constant.language.boolean",
                regex : "(?:true|false)\\b"
            }, {
                regex: "(open(?:\\s+))?module(?=\\s*\\w)",
                token: "keyword",
                next: [{
                    regex: "{",
                    token: "paren.lparen",
                    next: [{
                        regex: "}",
                        token: "paren.rparen",
                        next: "start"
                    }, {
                        regex: "\\b(requires|transitive|exports|opens|to|uses|provides|with)\\b",
                        token: "keyword"
                    }]
                }, {
                    token : "text",
                    regex : "\\s+"
                }, {
                    token : "identifier",
                    regex : "\\w+"
                }, {
                    token : "punctuation.operator",
                    regex : "."
                }, {
                    token : "text",
                    regex : "\\s+"
                }, {
                    regex: "", // exit if there is anything else
                    next: "start"
                }]
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "!|\\$|%|&|\\||\\^|\\*|\\/|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?|\\:|\\*=|\\/=|%=|\\+=|\\-=|&=|\\|=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : "\\*\\/",
                next : "start"
            }, {
                defaultToken : "comment"
            }
        ]
    };


    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);
    this.normalizeRules();
};

oop.inherits(JavaHighlightRules, TextHighlightRules);

exports.JavaHighlightRules = JavaHighlightRules;
});

ace.define("ace/mode/drools_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules","ace/mode/java_highlight_rules","ace/mode/doc_comment_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var JavaHighlightRules = require("./java_highlight_rules").JavaHighlightRules;
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;

var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*";
var packageIdentifierRe = "[a-zA-Z\\$_\u00a1-\uffff][\\.a-zA-Z\\d\\$_\u00a1-\uffff]*";

var DroolsHighlightRules = function() {

    var keywords = ("date|effective|expires|lock|on|active|no|loop|auto|focus" +
        "|activation|group|agenda|ruleflow|duration|timer|calendars|refract|direct" +
        "|dialect|salience|enabled|attributes|extends|template" +
        "|function|contains|matches|eval|excludes|soundslike" +
        "|memberof|not|in|or|and|exists|forall|over|from|entry|point|accumulate|acc|collect" +
        "|action|reverse|result|end|init|instanceof|extends|super|boolean|char|byte|short" +
        "|int|long|float|double|this|void|class|new|case|final|if|else|for|while|do" +
        "|default|try|catch|finally|switch|synchronized|return|throw|break|continue|assert" +
        "|modify|static|public|protected|private|abstract|native|transient|volatile" +
        "|strictfp|throws|interface|enum|implements|type|window|trait|no-loop|str"
      );

      var langClasses = (
          "AbstractMethodError|AssertionError|ClassCircularityError|"+
          "ClassFormatError|Deprecated|EnumConstantNotPresentException|"+
          "ExceptionInInitializerError|IllegalAccessError|"+
          "IllegalThreadStateException|InstantiationError|InternalError|"+
          "NegativeArraySizeException|NoSuchFieldError|Override|Process|"+
          "ProcessBuilder|SecurityManager|StringIndexOutOfBoundsException|"+
          "SuppressWarnings|TypeNotPresentException|UnknownError|"+
          "UnsatisfiedLinkError|UnsupportedClassVersionError|VerifyError|"+
          "InstantiationException|IndexOutOfBoundsException|"+
          "ArrayIndexOutOfBoundsException|CloneNotSupportedException|"+
          "NoSuchFieldException|IllegalArgumentException|NumberFormatException|"+
          "SecurityException|Void|InheritableThreadLocal|IllegalStateException|"+
          "InterruptedException|NoSuchMethodException|IllegalAccessException|"+
          "UnsupportedOperationException|Enum|StrictMath|Package|Compiler|"+
          "Readable|Runtime|StringBuilder|Math|IncompatibleClassChangeError|"+
          "NoSuchMethodError|ThreadLocal|RuntimePermission|ArithmeticException|"+
          "NullPointerException|Long|Integer|Short|Byte|Double|Number|Float|"+
          "Character|Boolean|StackTraceElement|Appendable|StringBuffer|"+
          "Iterable|ThreadGroup|Runnable|Thread|IllegalMonitorStateException|"+
          "StackOverflowError|OutOfMemoryError|VirtualMachineError|"+
          "ArrayStoreException|ClassCastException|LinkageError|"+
          "NoClassDefFoundError|ClassNotFoundException|RuntimeException|"+
          "Exception|ThreadDeath|Error|Throwable|System|ClassLoader|"+
          "Cloneable|Class|CharSequence|Comparable|String|Object"
      );

    var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": keywords,
        "constant.language": "null",
        "support.class" : langClasses,
        "support.function" : "retract|update|modify|insert"
    }, "identifier");

    var stringRules = function() {
      return [{
        token : "string", // single line
        regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
      }, {
        token : "string", // single line
        regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
      }];
    };


      var basicPreRules = function(blockCommentRules) {
        return [{
            token : "comment",
            regex : "\\/\\/.*$"
        },
        DocCommentHighlightRules.getStartRule("doc-start"),
        {
            token : "comment", // multi line comment
            regex : "\\/\\*",
            next : blockCommentRules
        }, {
            token : "constant.numeric", // hex
            regex : "0[xX][0-9a-fA-F]+\\b"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : "constant.language.boolean",
            regex : "(?:true|false)\\b"
          }];
      };

      var blockCommentRules = function(returnRule) {
        return [
            {
                token : "comment.block", // closing comment
                regex : "\\*\\/",
                next : returnRule
            }, {
                defaultToken : "comment.block"
            }
        ];
      };

      var basicPostRules = function() {
        return [{
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
        }, {
            token : "lparen",
            regex : "[[({]"
        }, {
            token : "rparen",
            regex : "[\\])}]"
        }, {
            token : "text",
            regex : "\\s+"
        }];
      };


    this.$rules = {
        "start" : [].concat(basicPreRules("block.comment"), [
              {
                token : "entity.name.type",
                regex : "@[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
              }, {
                token : ["keyword","text","entity.name.type"],
                regex : "(package)(\\s+)(" + packageIdentifierRe +")"
              }, {
                token : ["keyword","text","keyword","text","entity.name.type"],
                regex : "(import)(\\s+)(function)(\\s+)(" + packageIdentifierRe +")"
              }, {
                token : ["keyword","text","entity.name.type"],
                regex : "(import)(\\s+)(" + packageIdentifierRe +")"
              }, {
                token : ["keyword","text","entity.name.type","text","variable"],
                regex : "(global)(\\s+)(" + packageIdentifierRe +")(\\s+)(" + identifierRe +")"
              }, {
                token : ["keyword","text","keyword","text","entity.name.type"],
                regex : "(declare)(\\s+)(trait)(\\s+)(" + identifierRe +")"
              }, {
                token : ["keyword","text","entity.name.type"],
                regex : "(declare)(\\s+)(" + identifierRe +")"
              }, {
                token : ["keyword","text","entity.name.type"],
                regex : "(extends)(\\s+)(" + packageIdentifierRe +")"
              }, {
                token : ["keyword","text"],
                regex : "(rule)(\\s+)",
                next :  "asset.name"
              }],
              stringRules(),
              [{
                token : ["variable.other","text","text"],
                regex : "(" + identifierRe + ")(\\s*)(:)"
              }, {
                token : ["keyword","text"],
                regex : "(query)(\\s+)",
                next :  "asset.name"
              }, {
                token : ["keyword","text"],
                regex : "(when)(\\s*)"
              }, {
                token : ["keyword","text"],
                regex : "(then)(\\s*)",
                next :  "java-start"
              }, {
                  token : "paren.lparen",
                  regex : /[\[({]/
              }, {
                  token : "paren.rparen",
                  regex : /[\])}]/
              }], basicPostRules()),
        "block.comment" : blockCommentRules("start"),
        "asset.name" : [
            {
                token : "entity.name",
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "entity.name",
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "entity.name",
                regex : identifierRe
            }, {
                regex: "",
                token: "empty",
                next: "start"
            }]
    };
    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);

    this.embedRules(JavaHighlightRules, "java-", [
      {
       token : "support.function",
       regex: "\\b(insert|modify|retract|update)\\b"
     }, {
       token : "keyword",
       regex: "\\bend\\b",
       next  : "start"
    }]);

};

oop.inherits(DroolsHighlightRules, TextHighlightRules);

exports.DroolsHighlightRules = DroolsHighlightRules;
});

ace.define("ace/mode/folding/drools",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode","ace/token_iterator"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;
var TokenIterator = require("../../token_iterator").TokenIterator;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    this.foldingStartMarker = /\b(rule|declare|query|when|then)\b/; 
    this.foldingStopMarker = /\bend\b/;

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1]) {
                var position = {row: row, column: line.length};
                var iterator = new TokenIterator(session, position.row, position.column);
                var seek = "end";
                var token = iterator.getCurrentToken();
                if (token.value == "when") {
                    seek = "then";
                }
                while (token) {
                    if (token.value == seek) { 
                        return Range.fromPoints(position ,{
                            row: iterator.getCurrentTokenRow(),
                            column: iterator.getCurrentTokenColumn()
                        });
                    }
                    token = iterator.stepForward();
                }
            }

        }
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/drools",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/drools_highlight_rules","ace/mode/folding/drools"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var DroolsHighlightRules = require("./drools_highlight_rules").DroolsHighlightRules;
var DroolsFoldMode = require("./folding/drools").FoldMode;

var Mode = function() {
    this.HighlightRules = DroolsHighlightRules;
    this.foldingRules = new DroolsFoldMode();
    this.$behaviour = this.$defaultBehaviour;

};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.$id = "ace/mode/drools";
    this.snippetFileId = "ace/snippets/drools";
}).call(Mode.prototype);

exports.Mode = Mode;

});                (function() {
                    ace.require(["ace/mode/drools"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            