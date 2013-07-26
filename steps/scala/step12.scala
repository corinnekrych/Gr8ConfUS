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
    