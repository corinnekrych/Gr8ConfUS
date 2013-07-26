sealed trait Direction
case object left extends Direction
case object right extends Direction
case object up extends Direction
case object down extends Direction

case class Step(i:Int) {
  def steps = this
}

implicit def toSteps(i:Int) = Step(i)

case class Position(x:Int, y:Int) {
def left  = Position(x-1,y)
def right = Position(x+1,y)
def up    = Position(x,y+1)
def down  = Position(x,y-1)
}

class Turtle(var p:Position) {

var d:Direction = _

def move(d: Direction) = {
  d match {
    case `left` => steps = Stream(steps.head.left) ++ steps
    case `right` => steps = Stream(steps.head.right) ++ steps
    case `up` => steps = Stream(steps.head.up) ++ steps
    case `down` => steps = Stream(steps.head.down) ++ steps
    }
  this
  }
 }
  
def by(s:Step) = {
println("should move to "+d+" "+s)
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
    steps.add(newPosition)
    this
  }
}
enum Direction {
  left, right, up, down
}

def turtle = new Turtle(new Position(1, 1, Direction.left))
def compilerConfig = new CompilerConfiguration()
def binding = new Binding([turtle: turtle,
  						   move: turtle.&move,
                           left: Direction.left,
                           right: Direction.right,
                           up: Direction.up,
                           down: Direction.down])
def shell = new GroovyShell(this.class.classLoader,
        binding,
        compilerConfig)
///////////////////////
def gameDSL = '''
2.times {
    move right by 2
    move up by 1
}
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
    