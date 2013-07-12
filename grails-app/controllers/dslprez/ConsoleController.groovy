package dslprez

import javax.script.*;
import scala.tools.nsc.*

import java.lang.reflect.Field;
import scala.tools.nsc.settings.AbsSettings.AbsSetting;


import grails.converters.JSON
import dslprez.Result


class ConsoleController {

	def execute() {
		//def console = new Console(content:params.content);
                def cp = System.getProperty("java.class.path")
                cp = "/usr/home/pcohen/Dev/Scala/scala-2.11.0-M3/lib/scala-reflect.jar:/usr/home/pcohen/Dev/Scala/scala-2.11.0-M3/lib/scala-compiler.jar:/usr/home/pcohen/Dev/Scala/scala-2.11.0-M3/lib/scala-library.jar:/usr/home/pcohen/Dev/workspace/Gr8ConfUS/target/classes:"+cp
                System.setProperty("java.class.path",cp)
                //println("CP = "+System.getProperty("java.class.path"))

                def urls = getClass().classLoader.rootLoader.URLs
	
         	def encoding = 'UTF-8'
		def stream = new ByteArrayOutputStream()
		def printStream = new PrintStream(stream, true, encoding)

		def result = ""
		def stacktrace = new StringWriter()
		//def errWriter = new PrintWriter(stacktrace)
		//def aBinding = new Binding([out: printStream])

		def originalOut = System.out
		def originalErr = System.err
		
		System.setOut(printStream)
		System.setErr(printStream)
		try {
	//def settings = new scala.tools.nsc.Settings()
       //AbsSetting a = settings.usejavacp();
	
	//Field f = a.getClass().getDeclaredField("v");
	//f.setAccessible(true);
	//f.setBoolean(a, true);
       

        //def n=new Interpreter(settings,new PrintWriter(printStream))

result = test.TestEval.eval(params.content,urls,new PrintWriter(printStream))

//ScriptEngine e = new ScriptEngineManager().getEngineByName("scala");
//e.getContext().setAttribute("label", new Integer(4), ScriptContext.ENGINE_SCOPE);
//    result = e.eval("println(2+label)");
//result = n.interpret(params.content) //"1+3");
// didn't event try to check success or error
//n.close();

//result = new GroovyShell(this.class.classLoader, aBinding).evaluate(params.content)
		} catch (Exception e) {
                  //catch (groovy.lang.GroovyRuntimeException e) {
			stacktrace = e.message //- 'startup failed:\nScript1.groovy: '
	println "Stack = "+stacktrace
		} finally {
		System.setOut(originalOut)
			System.setErr(originalErr)
		}

		def resultObject = new Result()
		resultObject.result = stream.toString(encoding)
        resultObject.shellResult = result
        println "result: $result"
		resultObject.stacktrace = stacktrace
		
		// to avoid grails bringing 404 error
		render resultObject as JSON
	}

	
	def escape(object) {
		object ? object.toString().replaceAll(/\n/, /%0D/).replaceAll(/\t/, /\\\t/).replaceAll(/"/, /\\"/) : ""
	}
}
