'use strict';

const fs = require('fs')
const ejs = require('ejs')
const parseTl = require('./lib/tl_convert')

var template = ejs.compile(fs.readFileSync('./templates/schema.md.ejs', 'utf8'))
var source = fs.readFileSync(`schema.tl`, 'utf8')

// Remove all end ';'
var pass1 = source.replace(/;/g, '')

// Split it in Array
var pass2 = pass1.split('\n')

var schemas = [];
var cursor_type = 0; // 0: constructors(types), 1: methods
pass2.forEach((line) => {
    var gline;
    if (line === '---types---') {
        cursor_type = 0
        gline = line
    }
    else if (line === '---functions---') {
        cursor_type = 1
        gline = line
    }
    else if (/^[^#]+#[0-9a-f]+ .+/.test(line)) {
      var schema = {
        id: '',
        params: [],
        type: ''
      }
      var argu = line.trim().split(' ')

      // ID: Hex to Dec
      schema.id = argu[0].split('#')[1]
      schema.type = argu[argu.length - 1]
      if (argu.length > 3) {
        var params_a = argu.slice(1,-2)
        params_a.forEach((param) => {
          // Process params
          // Seems they are comments.
          if (param.slice(0,1) == '{') return
          // Vector no params
          if (argu[0].split('#')[0] == 'vector') return
          var param_a = param.split(':')
          schema.params.push({
            name: param_a[0],
            type: param_a[1]
          })
        })
      }
      if (cursor_type === 0) {
        schema.predicate = argu[0].split('#')[0]
      } 
      else if (cursor_type === 1) {
        schema.method = argu[0].split('#')[0]
      } 
      gline = schema
    } else {
        gline = line 
    }
    schemas.push(gline)
})

fs.writeFileSync(`./generated/schema.tl`, source)
fs.writeFileSync(`./generated/schema.md`, template({ schemas }))
fs.writeFileSync(`./generated/schema.json`, JSON.stringify(parseTl(source, true)))