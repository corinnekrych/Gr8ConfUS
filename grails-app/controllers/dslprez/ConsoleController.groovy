package dslprez

import grails.converters.JSON
import dslprez.Result
import dslprez.scala.eval.Evaluator


class ConsoleController {

  def execute() {
    //TODO depending on the receieved params.lang value target right interpreter
    def lang = "scala" //params.lang

    if (lang == "scala") executeScala()
    else if (lang == "groovy") executeGroovy()
  }

  def executeGroovy() {
    def console = new Console(content:params.content);
    
    def encoding = 'UTF-8'
    def stream = new ByteArrayOutputStream()
    def printStream = new PrintStream(stream, true, encoding)

    def result = ""
    def stacktrace = new StringWriter()
    def errWriter = new PrintWriter(stacktrace)
    def aBinding = new Binding([out: printStream])

    def originalOut = System.out
    def originalErr = System.err
		
    System.setOut(printStream)
    System.setErr(printStream)

    try {
      result = new GroovyShell(this.class.classLoader, aBinding).evaluate(params.content)
    } catch (groovy.lang.GroovyRuntimeException e) {
	stacktrace = e.message - 'startup failed:\nScript1.groovy: '
    } finally {
	System.setOut(originalOut)
	System.setErr(originalErr)
    }

    def resultObject = new Result()
    resultObject.result = stream.toString(encoding)
    //println "resultobject: $resultObject.result"
    resultObject.shellResult = result
    //println "shellresult: $resultObject.shellResult"
    resultObject.stacktrace = stacktrace
		
    // to avoid grails bringing 404 error
    render resultObject as JSON
  }

   def executeScala() {
   // Ugly search how to do better
    def cp = System.getProperty("java.class.path")
    cp = "/usr/home/pcohen/Dev/Scala/scala-2.11.0-M3/lib/scala-reflect.jar:/usr/home/pcohen/Dev/Scala/scala-2.11.0-M3/lib/scala-compiler.jar:/usr/home/pcohen/Dev/Scala/scala-2.11.0-M3/lib/scala-library.jar:/usr/home/pcohen/Dev/workspace/Gr8ConfUS/target/classes:"+cp
    System.setProperty("java.class.path",cp)
    
    def urls = new URL[0] //getClass().classLoader.rootLoader.URLs
	
    def encoding = 'UTF-8'
    def stream = new ByteArrayOutputStream()
    def printStream = new PrintStream(stream, true, encoding)

    def result = ""
    def stacktrace = ""
    
    try {
      def silent = false //params.silent
      result = Evaluator.eval(params.content,urls,printStream,silent)
    } catch (Exception e) {
      stacktrace = e.message
    } 

    def resultObject = new Result()
    resultObject.result = stream.toString(encoding)
    resultObject.shellResult = result
    resultObject.stacktrace = stacktrace
		
    // to avoid grails bringing 404 error
    render resultObject as JSON
  }

	
  def escape(object) {
    object ? object.toString().replaceAll(/\n/, /%0D/).replaceAll(/\t/, /\\\t/).replaceAll(/"/, /\\"/) : ""
  }
}