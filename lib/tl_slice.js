'use strict'

const isVector = /Vector<([^<^>]+)>/
const extractVector = /(?:Vector<){0,1}([^<^>]+)(?:>){0,1}/
const isFlag = /flags.([0-9]{1,})\?(.+)/

function getElementByType(elements, type) {
    return elements.filter((element) => stripType(element.type) === type)
}

function getElementByName(elements, name) {
    if (elements[0].predicate)
        var ret = elements.filter((constructor) => constructor.predicate === name)[0]
    else if (elements[0].method)
        var ret = elements.filter((method) => method.method === name)[0]
    if (ret) return ret
    else throw new Error(`Element ${name} not found in current scope.`)
}

function stripType(type) {
    var target_type
    if (isFlag.test(type)) {
        var flagrun = isFlag.exec(type)
        var strip_flag = flagrun[2]
    } else strip_flag = type
    if (isVector.test(strip_flag)) {
        var vectorrun = extractVector.exec(strip_flag)
        var strip_vector = vectorrun[1]
    } else {
        strip_vector = strip_flag
    }
    return strip_vector
}

module.exports = exports = {
    getElementByType,
    getElementByName,
    stripType
}