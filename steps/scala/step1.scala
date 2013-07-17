import scala.tools.nsc._

val env = new Settings()
env.usejavacp.value = true
val interpreter=new scala.tools.nsc.Interpreter(env)

val dsl = ""

val result = interpreter.eval(dsl)

// To test
/*
import scala.tools.nsc._

val interpreter=new scala.tools.nsc.Interpreter()

val dsl = ""

val result = interpreter.eval(dsl)

*/
