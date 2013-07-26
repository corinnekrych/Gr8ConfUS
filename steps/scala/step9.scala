sealed trait Direction
case object left extends Direction
case object right extends Direction
case object up extends Direction
case object down extends Direction

case class Position(x:Int, y:Int) {
def left  = Position(x-1,y)
def right = Position(x+1,y)
def up    = Position(x,y+1)
def down  = Position(x,y-1)
}

class Turtle(var p:Position) {
def move(d: Direction) = {
  d match {
    case `left` => p=p.left
    case `right` => p=p.right
    case `up` => p=p.up
    case `down` => p=p.down
    }
  println(s"x = ${p.x} and y = ${p.y}")
  this
  }
}

val t = new Turtle

t move left








class Position {
    int x
    int y
    Direction direction
    Position left() {
        new Position(x, y, Direction.left);
    }
    Position right() {
        new Position(x, y, Direction.right);
    }
    Position up() {
        new Position(x , y, Direction.up);
    }
    Position down() {
        new Position(x , y, Direction.down);
    }
    def Position(moveX, moveY, myDirection) {
        x = moveX
        y = moveY
        direction = myDirection
    }
    Position move(Integer step) {
        Position newPosition
        if(direction == Direction.left) {
            newPosition = new Position(x - step, y, direction)
        } else if(direction == Direction.right) {
            newPosition = new Position(x + step, y, direction)
        } else if(direction == Direction.up) {
            newPosition = new Position(x, y + step, direction)
        } else if(direction == Direction.down) {
            newPosition = new Position(x, y - step, direction)
        }
    }
}

class Turtle {
    def currentPosition
    def steps = []
    Turtle(Position start) {
        currentPosition = start
        steps.add(start)
    }

    Turtle move(Direction dir) {
        Position newPosition
        if (dir == Direction.left) {
            newPosition = currentPosition.left()
        } else if (dir == Direction.right) {
            newPosition = currentPosition.right()
        } else if (dir == Direction.up) {
            newPosition = currentPosition.up()
        } else if (dir == Direction.down) {
            newPosition = currentPosition.down()
        }
        currentPosition = newPosition
        this
    }

    Turtle by (Integer step) {
        Position newPosition = currentPosition.move(step)
        steps.add(newPosition)
        currentPosition = newPosition
        this
    }
}

enum Direction {
    left, right, up, down
}


def turtle = new Turtle(new Position(1, 1, Direction.left))

def binding = new Binding([turtle: turtle,
    move: turtle.&move,
    left: Direction.left,
    right: Direction.right,
    up: Direction.up,
    down: Direction.down])

def compilerConfig = new CompilerConfiguration()

def shell = new GroovyShell(this.class.classLoader,
    binding,
    compilerConfig)
///////////////////////
def gameDSL = '''
moooooooooove right by 2
move up by 3
'''
//////////////////////
// Run DSL script.
// result contains turtle object
// with all steps
shell.evaluate gameDSL

def builder = new groovy.json.JsonBuilder()
builder {
    steps binding["turtle"].steps
}
println builder
builder.toString()


    