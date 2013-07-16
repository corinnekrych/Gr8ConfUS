grails.servlet.version = "2.5" // Change depending on target container compliance (2.5 or 3.0)
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.target.level = 1.6
grails.project.source.level = 1.6
//grails.project.war.file = "target/${appName}-${appVersion}.war"

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
        // uncomment to disable ehcache
        // excludes 'ehcache'
    }
    log "error" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    checksums true // Whether to verify checksums on resolve

    repositories {
        inherits true // Whether to inherit repository definitions from plugins
        grailsPlugins()
        grailsHome()
        grailsCentral()
        mavenCentral()

        // uncomment these to enable remote dependency resolution from public Maven repositories
        //mavenCentral()
        //mavenLocal()
        //mavenRepo "http://snapshots.repository.codehaus.org"
        //mavenRepo "http://repository.codehaus.org"
        //mavenRepo "http://download.java.net/maven/2/"
        //mavenRepo "http://repository.jboss.com/maven2/"
    }
    dependencies {
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.

        // runtime 'mysql:mysql-connector-java:5.1.16'
        runtime 'postgresql:postgresql:9.1-901-1.jdbc4'
 
        runtime 'org.scala-lang:scala-compiler:2.11.0-M4'
        runtime 'org.scala-lang:scala-library:2.11.0-M4'
        runtime 'scalainterpreter:scalainterpreter:1.0'
        runtime 'net.liftweb:lift-json_2.10:2.5.1'

   }

    plugins {
        //runtime ":hibernate:$grailsVersion"
        runtime ":jquery:1.7.1"
        //runtime ":resources:1.1.6"

        // Uncomment these (or add new ones) to enable additional resources capabilities
        //runtime ":zipped-resources:1.0"
        //runtime ":cached-resources:1.0"
        //runtime ":yui-minify-resources:0.1.4"

   //grails.plugin.location.scala="/usr/home/pcohen/Dev/workspace/grails-scala"
   //     compile ":scala:0.6.5.2"


        //build ":tomcat:$grailsVersion"

        compile ':heroku:1.0.1'
        compile ':cloud-support:1.0.8'
        compile ':webxml:1.4.1'

        // plugins for the build system only
        build ':tomcat:2.2.3'
        // plugins needed at runtime but not for compilation
        runtime ':hibernate:3.6.10.M3'
                 //hibernate:2.2.3'
    }
}

