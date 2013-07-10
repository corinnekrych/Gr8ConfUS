unresolvedVariable { var ->
    if ('turtleee' == var.name) {
        storeType(var, classNodeFor(dslprez.Turtle))
        handled = true
    }
}
