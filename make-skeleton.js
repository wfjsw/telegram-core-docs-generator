'use strict'

const fs = require('fs')
const yaml = require('js-yaml')
const parseTl = require('./lib/tl_convert')
const sliceTl = require('./lib/tl_slice')

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

// Generate skeleton

constructors.forEach((constructor) => {
    fs.open(`./sources/constructor/${constructor.predicate}.yml`, 'wx', (err, fd) => {
        if (err) {
            if (err.code === 'EEXIST') {
                return;
            }
            throw err;
        }
        var data = {
            description: "Sample Description",
            params_desc: {}
        }
        constructor.params.forEach((param) => {
            data.params_desc[param.name] = 'Param description'
        })
        fs.writeSync(fd, yaml.safeDump(data))
        fs.closeSync(fd)
    });
})

methods.forEach((method) => {
    fs.open(`./sources/method/${method.method}.yml`, 'wx', (err, fd) => {
        if (err) {
            if (err.code === 'EEXIST') {
                return;
            }
            throw err;
        }
        var data = {
            description: "Sample Description",
            params_desc: {},
            result: "Describe the result",
            errors: []
        }
        method.params.forEach((param) => {
            data.params_desc[param.name] = 'Param description'
        })
        fs.writeSync(fd, yaml.safeDump(data))
        fs.closeSync(fd)
    });
})

types.forEach((type) => {
    fs.open(`./sources/type/${type}.yml`, 'wx', (err, fd) => {
        if (err) {
            if (err.code === 'EEXIST') {
                return;
            }
            throw err;
        }
        var data = {
            description: "Sample Description"
        }
        fs.writeSync(fd, yaml.safeDump(data))
        fs.closeSync(fd)
    });
})

fs.open(`./sources/method_categories.yml`, 'wx', (err, fd) => {
    if (err) {
        if (err.code === 'EEXIST') {
            return;
        }
        throw err;
    }
    var data = [
        {
            name: 'Sample Category', 
            methods: []
        }
    ]
    methods.forEach((method) => {
        data[0].methods.push(method.method)
    })
    fs.writeSync(fd, yaml.safeDump(data))
    fs.closeSync(fd)
});