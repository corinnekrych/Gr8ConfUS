unresolvedVariable { var ->
    if ('turtle' == var.name ) {
        storeType(var, classNodeFor(dslprez.Turtle))
        handled = true
    }
    if (var.name in ['left', 'right', 'up', 'down']) {
        storeType(var, classNodeFor(dslprez.Direction))
        handled = true
    }
}
methodNotFound { receiver, name, argList, argTypes, call ->
    if (name in ['by', 'move']) {
       return newMethod(name, classNodeFor(dslprez.Turtle))
    }
}


