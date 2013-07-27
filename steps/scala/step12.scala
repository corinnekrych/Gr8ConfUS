import dslprez.continuations.Ask
import scala.util.continuations._

val a = new Ask

def f = {
  val un = a.ask("first ","one")
  println("un = "+un)
  
  val two = a.ask("second ","two")
  println("deux = "+two)
  
  if (two == "two") {
  	val trois = a.ask("third ","trois")
    println("trois = "+trois)
    trois
  } else {
    two
  }
  
  //val trois = if (two == "two") {
  //a.ask("third ","trois")
  // } else {
  //   a.ask("thirdV2 ","drei")
  //}
  //println("trois = "+trois)
  println("The End")

}

a.start(f)

a.callCont

println("Lets have a break")

a.callCont
a.callCont



======================================================
def compilerConfig = new CompilerConfiguration()
compilerConfig.scriptBaseClass = SurveyScript.class.name
def binding = new Binding()
// Configure the GroovyShell.
def shell = new GroovyShell(this.class.classLoader,
                            binding,
                            compilerConfig)

///////////////////////
def surveyDSL = '''
ask "what is your name?" assign to name
ask "what is your birthday?" assign to date
display map
'''
//////////////////////
// Run DSL script.
shell.evaluate surveyDSL

abstract class SurveyScript extends Script {

  def i = 1;
  def map = [:]

  def ask(question) {
    [assign : { to ->
      [:].withDefault {variable ->
        map["question$i"] = question
        map["variable$i"] = variable
        i++
      }
    }]
  }

  def propertyMissing(def propertyName) {
    propertyName
  }

  def display(Map mapToDisplay) {
    mapToDisplay.eachWithIndex { key, value, index ->
      println "$key: $value"
      if (index % 2) {
        println "______________________________________\n"
      }
    }
  }
}
    