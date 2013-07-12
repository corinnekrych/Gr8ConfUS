unresolvedVariable { var ->
    if ('turtle' == var.name) {
        storeType(var, classNodeFor(dslprez.Turtle))
        handled = true
    }
}