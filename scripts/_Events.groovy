eventCompileStart = {
    println "Compile"
    grailsSettings.compileDependencies << new File("/Users/corinne/workspace/gr8confus/Gr8ConfUS/ext")
    classpathSet = false

    classpath()
}

eventSetClasspath = {
    println "classpath"
    rootLoader.addURL(new File("/Users/corinne/workspace/gr8confus/Gr8ConfUS/ext").toURI().toURL())
    //rootLoader.addURL(new File("ext").toURI().toURL())
    classpathSet = false
}