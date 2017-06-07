'use strict'

function getElementByType(elements, type) {
    return elements.filter((element) => element.type === type)
}

function getElementByName(elements, name) {
    if (elements[0].predicate)
        return elements.filter((constructor) => constructor.predicate === name)[0]
    else if (elements[0].method)
        return elements.filter((method) => method.method === name)[0]
    else return {}
}

module.exports = exports = {
    getElementByType,
    getElementByName
}