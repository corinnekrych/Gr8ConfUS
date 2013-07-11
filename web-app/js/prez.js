var myScroll;
function loaded() {
    myScroll = new iScroll('wrapper', {zoom: true});
    myScroll.options.onBeforeScrollStart = function(e) {
        var target = e.target;

        while (target.nodeType != 1) target = target.parentNode;
        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'){
            e.preventDefault();
            return true;
        }
    }
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

/* * * * * * * *
 *
 * Use this for high compatibility (iDevice + Android)
 *
 */
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
/*
 * * * * * * * */


/* * * * * * * *
 *
 * Use this for iDevice only
 *
 */
//document.addEventListener('DOMContentLoaded', loaded, false);
/*
 * * * * * * * */


/* * * * * * * *
 *
 * Use this if nothing else works
 *
 */
//window.addEventListener('load', setTimeout(function () { loaded(); }, 200), false);
/*
 * * * * * * * */



var serverUrl = "http://localhost:8080/DslPrez";
//var serverUrl = "http://dslprez.cloudfoundry.com";
//var serverUrl = "http://vast-escarpment-3640.herokuapp.com";
function submitForm(input, output) {
    var url = serverUrl + "/console/execute?=";
    $.post(url, {
        content : input
    }, function(data) {
        var value = "";
        if (data.stacktrace === "" || data.stacktrace.buffer !== undefined) {
            value = data.result;
        } else {
            value = data.stacktrace;
        }
        $(output).text(value);
        $('#next').click();
    });
}
//------------------------------------------------------------------->
// 1. Base Class
// step 1 define move method
// step 2 define left
//------------------------------------------------------------------->
var editor1 = new dslPrez.editor("editor1");
function editor1Key1() {
    var value = "def move(left) {\n"
        + "    println \"moving $left\"\n"
        + "}\n"
        + "move \"left\"\n";
    editor1.replaceRange(value, {line:5, ch:0});
    editor1.addLineClass(5, "background", "highlight");
    editor1.addLineClass(6, "background", "highlight");
    editor1.addLineClass(7, "background", "highlight");
    editor1.addLineClass(8, "background", "highlight");
}
function editor1Send() {
    var value = editor1.getValue();
    submitForm(value, "#output1");
}

function editor1Key2() {
    editor1.removeLineClass(5, "background", "highlight");
    editor1.removeLineClass(6, "background", "highlight");
    editor1.removeLineClass(7, "background", "highlight");
    editor1.removeLineClass(8, "background", "highlight");
    var value = "def left = \"left\"\n";
    editor1.replaceRange(value, {line:8, ch:0});
    editor1.removeLine(9);
    value = "move left\n";
    editor1.replaceRange(value, {line:9, ch:0});
    editor1.addLineClass(8, "background", "highlight");
}
function editor1Key3() {
    editor1.removeLineClass(8, "background", "highlight");
}

var keymap = {
    "1" : editor1Key1,
    "2" : editor1Key2,
    "3" : editor1Key3,
    "Ctrl-S" : editor1Send,
    "Cmd-S" : editor1Send
};
editor1.addKeyMap(keymap);

//------------------------------------------------------------------->
// 2. Base Class
// step 1 define base class
// step 2 remove move definition in script
// step 3 introduce compilerConfiguration
// step 4 inject it in groovy shell
//------------------------------------------------------------------->
var editor2 = new dslPrez.editor("editor2");
function editor2Key1() {
    var value = "abstract class GameScript extends Script {\n"
        + "  def move = {left -> println \"moving $left\" }\n"
        + "  def left = \"left\"\n"
        + "}\n";
    editor2.replaceRange(value, {line: 1, ch: 0});
}
function editor2Key2() {
    editor2.removeLine(9);
    editor2.removeLine(9);
    editor2.removeLine(9);
    editor2.removeLine(9);
}
function editor2Key3() {
    var value = "def compilerConfig = new CompilerConfiguration()\n"
        + "compilerConfig.scriptBaseClass = GameScript.class.name\n"
        + "def binding = new Binding()\n";
    editor2.removeLine(6);
    editor2.replaceRange(value, {line: 5, ch: 0});
}
function editor2Key4() {
    editor2.removeLine(8);
    var value = "" +
        "def shell = new GroovyShell(this.class.classLoader,\n" +
        "                            binding,\n" +
        "                            compilerConfig)\n";
    editor2.replaceRange(value, {line: 8, ch: 0});
}
function editor2Send() {
    var value = editor2.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitForm(value, "#output2");
}
var keymap2 = {
    "Ctrl-S" :editor2Send,
    "Cmd-S" :editor2Send,
    "1": editor2Key1,
    "2": editor2Key2,
    "3": editor2Key3,
    "4": editor2Key4
};

editor2.addKeyMap(keymap2);

function submitTurtleForm(input, output, canvasId) {
    var url = serverUrl + "/console/execute?=";
    var draw;
    $.post(url, {
        content : input
    }, function(data) {
        var value = "";
        var outputValue = "";
        if (data.stacktrace === "" || data.stacktrace.buffer !== undefined) {
            outputValue = data.result;
            value = JSON.parse(data.shellResult);
            var conf = {
                grid: 6,
                gridLineWidth: 2,
                stepDuration: 1000,
                images: {
                     franklin: 'turtle1.png',
                     emily: 'turtle1.png'
                },
                player: "franklin"
            };
            var init = {
                franklin: {
                    x: value.steps[0].x,
                    y: value.steps[0].y,
                    direction: "+x"
                }
            };
            draw = ktDraw(document.getElementById(canvasId), conf, init);
            $.each(value.steps, function(key, value) {
                var currentFranklin = {franklin: value};
                draw(currentFranklin, function () {
                    var debugMe = "..";
                });
            });
        } else {
            outputValue = data.stacktrace;
        }
        $(output).text(outputValue);
        $('#next').click();
    });
}

//------------------------------------------------------------------->
// 3. Binding
// step 1 introduce right in binding
// step 2 ad move right command
//------------------------------------------------------------------->
var editor3 = new dslPrez.editor("editor3");
function editor3Send() {
    var value = editor3.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitForm(value, "#output3");
}

function editor3Key1() {
    var value = 'def binding = new Binding([right: "right"])';
    editor3.replaceRange(value, {line: 7, ch: 0}, {line: 7});
    editor3.addLineClass(7, "background", "highlight");
}
function editor3Key2() {
    var value = 'move right\n';
    editor3.replaceRange(value, {line: 14, ch: 0});
    editor3.removeLineClass(7, "background", "highlight");
    editor3.addLineClass(14, "background", "highlight");
}
function editor3Key3() {
    var value = 'move right\n';
    editor3.removeLineClass(14, "background", "highlight");
}

var keymap3 = {
    "Ctrl-S" :editor3Send,
    "Cmd-S" :editor3Send,
    "1": editor3Key1,
    "2": editor3Key2,
    "3": editor3Key3
};
editor3.addKeyMap(keymap3);

//------------------------------------------------------------------->
// 4. Structure my code
// TODO step 1 dslprez.Position
// TODO step 2 Turtle
// TODO step 3 Direction
// TODO step4 inject binding, remove def left in GameScript
// TODO step5 replace inheritance by binding
//------------------------------------------------------------------->
var editor4 = new dslPrez.editor("editor4");
function editor4Send() {
    var value = editor4.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitForm(value, "#output4");
}
var keymap4 = {
    "Ctrl-S" :editor4Send,
    "Cmd-S" :editor4Send
};
editor4.addKeyMap(keymap4);

//------------------------------------------------------------------->
// 5. Building JSON
// TODO step 1 use steps instead println
// TODO step 2 after eval get value of steps
// TODO step 3 jsonbuilder
// TODO step 4 up stairs
// TODO step 5 if
//5.times {
//    if(turtle.currentPosition.x < 5)
//        move right
//else
//    move left
//    if(turtle.currentPosition.y < 5)
//        move up
//else
//    move down
//------------------------------------------------------------------->
var editor5 = new dslPrez.editor("editor5");
function editor5Send() {
    var value = editor5.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitForm(value, "#output5");
}
function editor5TurtleSend() {
    var value = editor5.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitTurtleForm(value, "#output5", 'canvas5');
}
var keymap5 = {
    "Ctrl-S" :editor5TurtleSend,
    "Cmd-S" :editor5TurtleSend
};
editor5.addKeyMap(keymap5);


//------------------------------------------------------------------->
// 6. Command chaining
// TODO add by
//class dslprez.Position {
//    int x
//    int y
//    Direction direction
//    dslprez.Position left() {
//        new dslprez.Position(x, y, Direction.left);
//    }
//    dslprez.Position right() {
//        new dslprez.Position(x, y, Direction.right);
//    }
//    dslprez.Position up() {
//        new dslprez.Position(x , y, Direction.up);
//    }
//    dslprez.Position down() {
//        new dslprez.Position(x , y, Direction.down);
//    }
//    def dslprez.Position(moveX, moveY, myDirection) {
//        x = moveX
//        y = moveY
//        direction = myDirection
//    }
//    dslprez.Position move(Integer step) {
//        dslprez.Position newPosition
//        if(direction == Direction.left) {
//            newPosition = new dslprez.Position(x - step, y, direction)
//        } else if(direction == Direction.right) {
//            newPosition = new dslprez.Position(x + step, y, direction)
//        } else if(direction == Direction.up) {
//            newPosition = new dslprez.Position(x, y + step, direction)
//        } else if(direction == Direction.down) {
//            newPosition = new dslprez.Position(x, y - step, direction)
//        }
//    }
//}
//
//class Turtle {
//    def currentPosition
//    def steps = []
//    Turtle(dslprez.Position start) {
//        currentPosition = start
//        steps.add(start)
//    }
//
//    Turtle move(Direction dir) {
//        dslprez.Position newPosition
//        if (dir == Direction.left) {
//            newPosition = currentPosition.left()
//        } else if (dir == Direction.right) {
//            newPosition = currentPosition.right()
//        } else if (dir == Direction.up) {
//            newPosition = currentPosition.up()
//        } else if (dir == Direction.down) {
//            newPosition = currentPosition.down()
//        }
//        currentPosition = newPosition
//        this
//    }
//
//    Turtle by (Integer step) {
//        dslprez.Position newPosition = currentPosition.move(step)
//        steps.add(newPosition)
//        currentPosition = newPosition
//        this
//    }
//}
//enum Direction {
//    left, right, up, down
//}
//
//
//def turtle = new Turtle(new dslprez.Position(1, 1, Direction.left))
//def compilerConfig = new CompilerConfiguration()
//def binding = new Binding([turtle: turtle,
//    move: turtle.&move,
//    left: Direction.left,
//    right: Direction.right,
//    up: Direction.up,
//    down: Direction.down])
//def shell = new GroovyShell(this.class.classLoader,
//    binding,
//    compilerConfig)
/////////////////////////
//def gameDSL = '''
//2.times {
//    move right by 2
//    move up by 1
//}
//'''
////////////////////////
//// Run DSL script.
//// result contains turtle object
//// with all steps
//shell.evaluate gameDSL
//def builder = new groovy.json.JsonBuilder()
//builder {
//    steps binding["turtle"].steps
//}
//println builder
//builder.toString()
// TODO step3: odd number
//class dslprez.Position {
//    int x
//    int y
//    Direction direction
//    dslprez.Position left() {
//        new dslprez.Position(x, y, Direction.left);
//    }
//    dslprez.Position right() {
//        new dslprez.Position(x, y, Direction.right);
//    }
//    dslprez.Position up() {
//        new dslprez.Position(x , y, Direction.up);
//    }
//    dslprez.Position down() {
//        new dslprez.Position(x , y, Direction.down);
//    }
//    def dslprez.Position(moveX, moveY, myDirection) {
//        x = moveX
//        y = moveY
//        direction = myDirection
//    }
//    dslprez.Position move(Integer step) {
//        dslprez.Position newPosition
//        if(direction == Direction.left) {
//            newPosition = new dslprez.Position(x - step, y, direction)
//        } else if(direction == Direction.right) {
//            newPosition = new dslprez.Position(x + step, y, direction)
//        } else if(direction == Direction.up) {
//            newPosition = new dslprez.Position(x, y + step, direction)
//        } else if(direction == Direction.down) {
//            newPosition = new dslprez.Position(x, y - step, direction)
//        }
//    }
//}
//
//class Turtle {
//    def currentPosition
//    def steps = []
//    Turtle(dslprez.Position start) {
//        currentPosition = start
//        steps.add(start)
//    }
//
//    Turtle move(Direction dir) {
//        dslprez.Position newPosition
//        if (dir == Direction.left) {
//            newPosition = currentPosition.left()
//        } else if (dir == Direction.right) {
//            newPosition = currentPosition.right()
//        } else if (dir == Direction.up) {
//            newPosition = currentPosition.up()
//        } else if (dir == Direction.down) {
//            newPosition = currentPosition.down()
//        }
//        currentPosition = newPosition
//        this
//    }
//
//    Map by (Integer step) {
//        dslprez.Position newPosition = currentPosition.move(step)
//        steps.add(newPosition)
//        currentPosition = newPosition
//            [steps:"", step:""]
//    }
//}
//enum Direction {
//    left, right, up, down
//}
//
//
//def turtle = new Turtle(new dslprez.Position(1, 1, Direction.left))
//def compilerConfig = new CompilerConfiguration()
//def binding = new Binding([turtle: turtle,
//    move: turtle.&move,
//    left: Direction.left,
//    right: Direction.right,
//    up: Direction.up,
//    down: Direction.down])
//def shell = new GroovyShell(this.class.classLoader,
//    binding,
//    compilerConfig)
/////////////////////////
//def gameDSL = '''
//2.times {
//    move right by 2 steps
//    move up by 1 step
//}
//'''
////////////////////////
//// Run DSL script.
//// result contains turtle object
//// with all steps
//shell.evaluate gameDSL
//def builder = new groovy.json.JsonBuilder()
//builder {
//    steps binding["turtle"].steps
//}
//println builder
//builder.toString()

//------------------------------------------------------------------->



var editor6 = new dslPrez.editor("editor6");
function editor6TurtleSend() {
    var value = editor6.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitTurtleForm(value, "#output6", 'canvas6');
}
var keymap6 = {
    "Ctrl-S": editor6TurtleSend,
    "Cmd-S": editor6TurtleSend
};
editor6.addKeyMap(keymap6);

//------------------------------------------------------------------->
// 7. category/mixin
// TODO step 1 use
//class dslprez.Position {
//    int x
//    int y
//    Direction direction
//    dslprez.Position left() {
//        new dslprez.Position(x, y, Direction.left);
//    }
//    dslprez.Position right() {
//        new dslprez.Position(x, y, Direction.right);
//    }
//    dslprez.Position up() {
//        new dslprez.Position(x , y, Direction.up);
//    }
//    dslprez.Position down() {
//        new dslprez.Position(x , y, Direction.down);
//    }
//    def dslprez.Position(moveX, moveY, myDirection) {
//        x = moveX
//        y = moveY
//        direction = myDirection
//    }
//    dslprez.Position move(Integer step) {
//        dslprez.Position newPosition
//        if(direction == Direction.left) {
//            newPosition = new dslprez.Position(x - step, y, direction)
//        } else if(direction == Direction.right) {
//            newPosition = new dslprez.Position(x + step, y, direction)
//        } else if(direction == Direction.up) {
//            newPosition = new dslprez.Position(x, y + step, direction)
//        } else if(direction == Direction.down) {
//            newPosition = new dslprez.Position(x, y - step, direction)
//        }
//    }
//}
//
//class Turtle {
//    def currentPosition
//    def steps = []
//    Turtle(dslprez.Position start) {
//        currentPosition = start
//        steps.add(start)
//    }
//
//    Turtle move(Direction dir) {
//        dslprez.Position newPosition
//        if (dir == Direction.left) {
//            newPosition = currentPosition.left()
//        } else if (dir == Direction.right) {
//            newPosition = currentPosition.right()
//        } else if (dir == Direction.up) {
//            newPosition = currentPosition.up()
//        } else if (dir == Direction.down) {
//            newPosition = currentPosition.down()
//        }
//        currentPosition = newPosition
//        this
//    }
//
//    Turtle by (Integer step) {
//        dslprez.Position newPosition = currentPosition.move(step)
//        steps.add(newPosition)
//        currentPosition = newPosition
//        this
//    }
//}
//
//class StepCategory {
//    static Integer getSteps(Integer self) {
//        self
//    }
//}
//enum Direction {
//    left, right, up, down
//}
//
//
//def turtle = new Turtle(new dslprez.Position(1, 1, Direction.left))
//def compilerConfig = new CompilerConfiguration()
//def binding = new Binding([turtle: turtle,
//    move: turtle.&move,
//    left: Direction.left,
//    right: Direction.right,
//    up: Direction.up,
//    down: Direction.down])
//def shell = new GroovyShell(this.class.classLoader,
//    binding,
//    compilerConfig)
/////////////////////////
//def gameDSL = '''
////use(StepCategory) {
//
//move left by 2.steps
//move right by 3.steps
//
////}
//'''
////////////////////////
//// Run DSL script.
//// result contains turtle object
//// with all steps
//shell.evaluate "use(StepCategory) {" + gameDSL + "}"
//
//def builder = new groovy.json.JsonBuilder()
//builder {
//    steps binding["turtle"].steps
//}
//println builder
//builder.toString()


// TODO step 2
//2.times {
//    move right by 2.steps
//    move up by 1.steps
//}
//gameDSL = "use(StepCategory) { $gameDSL }"
// TODO step3 annotation
//@Category(Integer)
//class StepCategory {
//    Integer getSteps() {
//        this;
//    }
//}
//
//------------------------------------------------------------------->
var editor7 = new dslPrez.editor("editor7");
function editor7TurtleSend() {
    var value = editor7.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitTurtleForm(value, "#output7", 'canvas7');
}
var keymap7 = {
    "Ctrl-S": editor7TurtleSend,
    "Cmd-S": editor7TurtleSend
};
editor7.addKeyMap(keymap7);

//------------------------------------------------------------------->
// 8. TypeChecked
//TODO step 1
//------------------------------------------------------------------->
var editor8 = new dslPrez.editor("editor8");
function editor8TurtleSend() {
    var value = editor8.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    value += "import org.codehaus.groovy.control.customizers.ASTTransformationCustomizer;\nimport groovy.transform.TypeChecked\n";
    submitTurtleForm(value, "#output8", 'canvas8');
}


function editor8Key1() {
    var value = "compilerConfig.addCompilationCustomizers(\n" +
        "    new ASTTransformationCustomizer(TypeChecked, extensions:['TurtleExtension.groovy']))\n\n";
    editor8.replaceRange(value, {line:82, ch:0});
    editor8.addLineClass(82, "background", "highlight");
    editor8.addLineClass(83, "background", "highlight");
    editor8.addLineClass(84, "background", "highlight");
}
function editor8Key2() {
    editor8.removeLineClass(82, "background", "highlight");
    editor8.removeLineClass(83, "background", "highlight");
    editor8.removeLineClass(84, "background", "highlight");
}

var keymap8 = {
    "1": editor8Key1,
    "2": editor8Key2,
    "Ctrl-S": editor8TurtleSend,
    "Cmd-S": editor8TurtleSend
};
editor8.addKeyMap(keymap8);
editor8.scrollIntoView({line:80, ch:0});

//------------------------------------------------------------------->
// 9. Turn
//------------------------------------------------------------------->
var editor9 = new dslPrez.editor("editor9");
function editor9TurtleSend() {
    var value = editor9.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    value += "import org.codehaus.groovy.control.customizers.ASTTransformationCustomizer;\nimport groovy.transform.TypeChecked\n";
    value += "import groovy.transform.TimedInterrupt\n";
    submitTurtleForm(value, "#output9", 'canvas9');
}


function editor9Key1() {
    var value = "    new ASTTransformationCustomizer(TypeChecked, extensions:['TurtleExtension.groovy']),\n" +
                "    new ASTTransformationCustomizer([value:5L], TimedInterrupt))\n";
    editor9.removeLine(83);
    editor9.replaceRange(value, {line:83, ch:0});
    editor9.addLineClass(84, "background", "highlight");
}
function editor9Key2() {
    editor9.removeLineClass(84, "background", "highlight");
}

var keymap9 = {
    "1":editor9Key1,
    "2":editor9Key2,
    "Ctrl-S": editor9TurtleSend,
    "Cmd-S": editor9TurtleSend
};
editor9.addKeyMap(keymap9);

//------------------------------------------------------------------->
// 10. System.exit
//------------------------------------------------------------------->
var editor10 = new dslPrez.editor("editor10");
function editor10TurtleSend() {
    var value = editor10.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    value += "import org.codehaus.groovy.control.customizers.ASTTransformationCustomizer;\nimport groovy.transform.TypeChecked\n";
    value += "import groovy.transform.TimedInterrupt;\nimport org.codehaus.groovy.control.customizers.SecureASTCustomizer\n"
    submitTurtleForm(value, "#output10", 'canvas10');
}

function editor10Key1() {
    var value = "def secure = new SecureASTCustomizer()\n" +
                "secure.with {\n" +
                "    receiversClassesBlackList = [\n" +
                "        java.lang.System\n" +
                "    ].asImmutable()\n" +
                "}\n\n";

    editor10.replaceRange(value, {line:85, ch:0});
    editor10.addLineClass(85, "background", "highlight");
    editor10.addLineClass(86, "background", "highlight");
    editor10.addLineClass(87, "background", "highlight");
    editor10.addLineClass(88, "background", "highlight");
    editor10.addLineClass(89, "background", "highlight");
    editor10.addLineClass(90, "background", "highlight");
    editor10.removeLine(92);
    var value = "compilerConfig.addCompilationCustomizers(tc, ti, secure)\n";
    editor10.replaceRange(value, {line:92, ch:0});
}
function editor10Key2() {
    editor10.removeLineClass(85, "background", "highlight");
    editor10.removeLineClass(86, "background", "highlight");
    editor10.removeLineClass(87, "background", "highlight");
    editor10.removeLineClass(88, "background", "highlight");
    editor10.removeLineClass(89, "background", "highlight");
    editor10.removeLineClass(90, "background", "highlight");
}

var keymap10 = {
    "1":editor10Key1,
    "2":editor10Key2,
    "Ctrl-S": editor10TurtleSend,
    "Cmd-S": editor10TurtleSend
};
editor10.addKeyMap(keymap10);


//------------------------------------------------------------------->
// 11. ask
//------------------------------------------------------------------->
var editor11 = new dslPrez.editor("editor11");
function editor11Send() {
    var value = editor11.getValue();
    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
    submitForm(value, "#output11");
}
var keymap11 = {
    "Ctrl-S": editor11Send,
    "Cmd-S": editor11Send
};
editor11.addKeyMap(keymap11);


//------------------------------------------------------------------->
// 12. ask AST
//------------------------------------------------------------------->
var editor12 = new dslPrez.editor("editor12");
function editor12Send() {
    var value = editor12.getValue();
    value = "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n"
        +"import org.codehaus.groovy.ast.*\n"
        +"import org.codehaus.groovy.ast.expr.*\n"
        +"import org.codehaus.groovy.ast.stmt.*\n"
        +"import org.codehaus.groovy.classgen.GeneratorContext\n"
        +"import org.codehaus.groovy.control.CompilationFailedException\n"
        +"import org.codehaus.groovy.control.CompilePhase\n"
        +"import org.codehaus.groovy.control.CompilerConfiguration\n"
        +"import org.codehaus.groovy.control.SourceUnit\n"
        +"import org.codehaus.groovy.control.customizers.*\n"
        +"import org.codehaus.groovy.ast.builder.AstBuilder\n"
        +"import org.codehaus.groovy.syntax.Token\n"
        +"import org.codehaus.groovy.syntax.Types\n"
        +"import static org.objectweb.asm.Opcodes.ACC_PUBLIC\n" + value;
    submitForm(value, "#output12");
}
var keymap12 = {
    "Ctrl-S": editor12Send,
    "Cmd-S": editor12Send
};
editor12.addKeyMap(keymap12);



//var editor7 = new dslPrez.editor("editor7");
//
//function editor7Send() {
//    var value = editor7.getValue();
//    value += "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n";
//    submitForm(value, "#output7");
//}
//function editor7Key1() {
//    editor7.removeLine(40);
//    editor7.removeLine(40);
//    var value = "ask \"what is your name?\" assign to name\nask \"what is your birthdate?\" assign to date\n";
//    editor7.replaceRange(value, {line: 40, ch: 0});
//}
//function editor7Key2() {
//    editor7.removeLine(9);
//    editor7.removeLine(9);
//    editor7.removeLine(9);
//    editor7.removeLine(9);
//    var value = "  def assign(to) {\n  }\n";
//    editor7.replaceRange(value, {line: 9, ch: 0});
//}
//function editor7Key3() {
//    var value = "    [:].withDefault { }\n";
//    editor7.replaceRange(value, {line: 10, ch: 0});
//}
//function editor7Key4() {
//    editor7.removeLine(10);
//    var value = "    [:].withDefault { variable ->\n      map[\"variable$j\"] = variable\n      j++\n    }\n";
//    editor7.replaceRange(value, {line: 10, ch: 0});
//    value = "  def j = 1\n";
//    editor7.replaceRange(value, {line: 2, ch: 0});
//    value = "    i++\n";
//    editor7.replaceRange(value, {line: 7, ch: 0});
//}
//
//var keymap7 = {
//    "Ctrl-S": editor7Send,
//    "Cmd-S": editor7Send,
//    "1": editor7Key1,
//    "2": editor7Key2,
//    "3": editor7Key3,
//    "4": editor7Key4
//};
//
//editor7.addKeyMap(keymap7);
//


//var editor5 = new dslPrez.editor("editor5");
//
//function editor5Send() {
//    var value = editor5.getValue();
//    value = "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n"
//        +"import org.codehaus.groovy.ast.*\n"
//        +"import org.codehaus.groovy.ast.expr.*\n"
//        +"import org.codehaus.groovy.ast.stmt.*\n"
//        +"import org.codehaus.groovy.classgen.GeneratorContext\n"
//        +"import org.codehaus.groovy.control.CompilationFailedException\n"
//        +"import org.codehaus.groovy.control.CompilePhase\n"
//        +"import org.codehaus.groovy.control.CompilerConfiguration\n"
//        +"import org.codehaus.groovy.control.SourceUnit\n"
//        +"import org.codehaus.groovy.control.customizers.*\n"
//        +"import org.codehaus.groovy.ast.builder.AstBuilder\n"
//        +"import org.codehaus.groovy.syntax.Token\n"
//        +"import org.codehaus.groovy.syntax.Types\n"
//        +"import static org.objectweb.asm.Opcodes.ACC_PUBLIC\n" + value;
//    submitForm(value, "#output5");
//}
//function editor5Key1() {
//    var value = "binding.setVariable(\"whichMeal\", \"What would you like to have for lunch?\")\n";
//    editor5.replaceRange(value, {line: 4, ch: 0});
//}
//function editor5Key2() {
//    var value = "ask whichMeal assign to meal\n";
//    editor5.replaceRange(value, {line: 11, ch: 0});
//}
//
//var keymap5 = {
//    "Ctrl-S": editor5Send,
//    "Cmd-S": editor5Send,
//    "1": editor5Key1,
//    "2": editor5Key2
//};
//
//editor5.addKeyMap(keymap5);
//
//var editor6 = new dslPrez.editor("editor6");
//
//function editor6Send() {
//    var value = editor6.getValue();
//    value = "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n"
//        +"import org.codehaus.groovy.ast.*\n"
//        +"import org.codehaus.groovy.ast.expr.*\n"
//        +"import org.codehaus.groovy.ast.stmt.*\n"
//        +"import org.codehaus.groovy.classgen.GeneratorContext\n"
//        +"import org.codehaus.groovy.control.CompilationFailedException\n"
//        +"import org.codehaus.groovy.control.CompilePhase\n"
//        +"import org.codehaus.groovy.control.CompilerConfiguration\n"
//        +"import org.codehaus.groovy.control.SourceUnit\n"
//        +"import org.codehaus.groovy.control.customizers.*\n"
//        +"import org.codehaus.groovy.ast.builder.AstBuilder\n"
//        +"import org.codehaus.groovy.syntax.Token\n"
//        +"import org.codehaus.groovy.syntax.Types\n"
//        +"import static org.objectweb.asm.Opcodes.ACC_PUBLIC\n" + value;
//    submitForm(value, "#output6");
//}
//
//var keymap6 = {
//    "Ctrl-S": editor6Send,
//    "Cmd-S": editor6Send
//};
//
//editor6.addKeyMap(keymap6);
//
//var editor7 = new dslPrez.editor("editor7");
//
//function editor7Send() {
//    var value = editor7.getValue();
//    value = "import groovy.lang.Script;\nimport org.codehaus.groovy.control.CompilerConfiguration\n"
//        +"import org.codehaus.groovy.ast.*\n"
//        +"import org.codehaus.groovy.ast.expr.*\n"
//        +"import org.codehaus.groovy.ast.stmt.*\n"
//        +"import org.codehaus.groovy.classgen.GeneratorContext\n"
//        +"import org.codehaus.groovy.control.CompilationFailedException\n"
//        +"import org.codehaus.groovy.control.CompilePhase\n"
//        +"import org.codehaus.groovy.control.CompilerConfiguration\n"
//        +"import org.codehaus.groovy.control.SourceUnit\n"
//        +"import org.codehaus.groovy.control.customizers.*\n"
//        +"import org.codehaus.groovy.ast.builder.AstBuilder\n"
//        +"import org.codehaus.groovy.syntax.Token\n"
//        +"import org.codehaus.groovy.syntax.Types\n"
//        +"import static org.objectweb.asm.Opcodes.ACC_PUBLIC\n" + value;
//    submitForm(value, "#output7");
//}
//
//var keymap7 = {
//    "Ctrl-S": editor7Send,
//    "Cmd-S": editor7Send
//};
//
//editor7.addKeyMap(keymap7);
//
//var editor8 = new dslPrez.editor("editor8");
//
//function editor8Send() {
//    var value = editor8.getValue();
//    var title = $('#titleCreate').val();
//    submitCreateForm(title, value, "#output8");
//}
//
//var keymap8 = {
//    "Ctrl-S": editor8Send,
//    "Cmd-S": editor8Send
//};
//
//editor8.addKeyMap(keymap8);
//
//document.getElementById("editor8").addEventListener("touchstart", function(e)
//{
//    e.preventDefault();
//    alert('test2');
//});
//
//function submitCreateForm(title, input, output) {
//    var url = serverUrl + "/survey/create?=";
//    $.post(url, {
//        title:"myScript", content:input
//    },function (data) {
//        $("#displayQuestion").removeData();
//        $('.displayAnswer').remove();
//        $(".surveystart").show();
//        $("#displayQuestion").data('scriptId', data.id);
//        $("#displayQuestion").data('scriptContent', data.content);
//        $('#scriptContent').text(data.content);
//        $('#submitButton').click();
//        $('#next').click();
//    });
//}
//
//$('#submitButton').bind('click', function() {
//    var answer = $('#answer').val();
//    $('#answer').val('');
//    var answerMap = $("#displayQuestion").data('answerMap');
//    var question = $("#displayQuestion").data('question');
//    var scriptId = $("#displayQuestion").data('scriptId');
//    var counter = $("#displayQuestion").data('counter');
//    var lastAssignment = $("#displayQuestion").data('lastAssignment');
//    if (answerMap)
//        answerMap[counter] = {variable: lastAssignment, question: question, answer:answer};
//    var stringAnswerMap = JSON.stringify(answerMap);
//    var url = serverUrl + "/survey/run?=";
//
//    $.post(url, {
//        scriptId:scriptId, question: question, lastAssignment:lastAssignment, counter:counter, answer:answer, answerMap:stringAnswerMap
//    }, function(data) {
//
//        var answerMap = data.answerMap;
//        var counter = data.counter;
//        var question = data.question;
//        var lastAssignment = data.lastAssignment;
//        $("#displayQuestion").data('answerMap', answerMap);
//        $("#displayQuestion").data('question', question);
//        $("#displayQuestion").data('counter', counter);
//        $("#displayQuestion").data('lastAssignment', lastAssignment);
//        if(data.finished==true) {
//            $(".surveystart").hide();
//            for(var index = 1; index <= counter;index++)  {
//                if (answerMap[index]) {
//                    var output8Value = '<div class="displayAnswer">' + answerMap[index].question + ' ' + answerMap[index].answer + '</div>';
//                    $("#output8bis").append(output8Value);
//                }
//            }
//            $('#next').click();
//        } else {
//            $("#displayQuestion").text(data.question);
//        }
//    });
//});
//


$("#technologies").airport([ 'Twitter Bootstrap', 'iScroll', 'jCloud', 'jQuery-airport', 'grails', 'Code Mirror', 'jQuery' ]);


