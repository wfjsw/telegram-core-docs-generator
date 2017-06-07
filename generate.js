'use strict'

const fs = require('fs')
const yaml = require('js-yaml')
const parseTl = require('./lib/tl_convert')
const sliceTl = require('./lib/tl_slice')
const ejs = require('ejs')

const schema = parseTl(fs.readFileSync(`schema.tl`, 'utf8'), false)

var constructors = schema.constructors
var methods = schema.methods

// build all types
var types = []

constructors.forEach((constructor) => {
    if (types.indexOf(constructor.type) < 0)
        types.push(constructor.type)
})

methods.forEach((method) => {
    if (types.indexOf(method.type) < 0)
        types.push(method.type)
})

types = types.filter((type) => type !== '#')

types = types.map((type) => sliceTl.stripType(type))

// Build methods.md

var tpl_methods = ejs.compile(fs.readFileSync('./templates/methods.md.ejs', 'utf8'))
var method_categories = yaml.safeLoad(fs.readFileSync('./sources/method_categories.yml'))
method_categories.forEach((category) => {
    category.methods = category.methods.map((method) => sliceTl.getElementByName(methods, method))
    category.methods = category.methods.map((method) => {
        var userinput = yaml.safeLoad(fs.readFileSync(`./sources/method/${method.method}.yml`, 'utf8'))
        return Object.assign({}, method, userinput)
    })
})

fs.writeFileSync('./generated/methods.md', tpl_methods({categories: method_categories}))

// Build Constructors

var tpl_constructor = ejs.compile(fs.readFileSync('./templates/constructor.ejs', 'utf8'))
constructors.forEach((constructor) => {
    var userinput = yaml.safeLoad(fs.readFileSync(`./sources/constructor/${constructor.predicate}.yml`, 'utf8'))
    fs.writeFileSync(`./generated/constructor/${constructor.predicate}.md`, tpl_constructor(Object.assign({}, constructor, userinput)))
})

// Build Methods

var tpl_method = ejs.compile(fs.readFileSync('./templates/method.ejs', 'utf8'))
methods.forEach((method) => {
    var userinput = yaml.safeLoad(fs.readFileSync(`./sources/method/${method.method}.yml`, 'utf8'))
    var includes = sliceTl.getElementByType(constructors, method.type)
    fs.writeFileSync(`./generated/method/${method.method}.md`, tpl_method(Object.assign({}, method, userinput, { includes })))
})

// Build Types

var tpl_type = ejs.compile(fs.readFileSync('./templates/type.ejs', 'utf8'))
types.forEach((type) => {
    var userinput = yaml.safeLoad(fs.readFileSync(`./sources/type/${type}.yml`, 'utf8'))
    var gen_type = {
        type: type,
        description: userinput.description,
        constructors: sliceTl.getElementByType(constructors, type),
        methods: sliceTl.getElementByType(methods, type)
    }
    gen_type.constructors = gen_type.constructors.map((constructor) => {
        var userinput = yaml.safeLoad(fs.readFileSync(`./sources/constructor/${constructor.predicate}.yml`, 'utf8'))
        return Object.assign({}, constructor, userinput)
    })
    gen_type.methods = gen_type.methods.map((method) => {
        var userinput = yaml.safeLoad(fs.readFileSync(`./sources/method/${method.method}.yml`, 'utf8'))
        return Object.assign({}, method, userinput)
    })
    fs.writeFileSync(`./generated/type/${type}.md`, tpl_type(gen_type))
})
