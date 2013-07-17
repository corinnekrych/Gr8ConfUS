import scala.tools.nsc._

val env = new Settings()
env.usejavacp.value = true
val interpreter=new scala.tools.nsc.Interpreter(env)

object move {
def to(direction:String) = {
println("Moving "+direction)
println(s"Moving $direction")
}
}
val left = "left"

val dsl ="""
move to left
"""

interpreter.bind("left","String",left)
val result = interpreter.eval(dsl)

// Still to search binding an object and not a class
// baseclass in Scala