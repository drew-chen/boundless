/*<!-- ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.
## -->*/

const fs = require('fs')
// name of the file goes below
let data = require('./boundless_data.2020-05-17T19_50_42.json')

data = JSON.stringify(data, null, 2)

let startString = 'appspot.com/o/'

const requireReplace = (data) => {
  if (data.indexOf(startString) < 0) {
    return false
  }

  return true
}

while (requireReplace(data)) {
  let start = data.indexOf(startString) + startString.length
  let end = data.indexOf('?alt=media&token', start)
  let replaceStart = data.lastIndexOf('"', start)
  let replaceEnd = data.indexOf('"', end)
  let oldString = data.substring(replaceStart + 1, replaceEnd)
  
  path = data.substring(start, end)
  
  while (path.indexOf('%2F') >= 0) {
    path = path.replace('%2F', '/')
  }

  let lastChar = oldString[oldString.length - 1]
  if (lastChar === '\\') {
    oldString = oldString.substring(0, oldString.length - 1)
    path = `local://${path}`
  }
  if (lastChar === ')') {
    let stringStart = oldString.indexOf('(https://')
    oldString = oldString.substring(stringStart + 1, oldString.length - 1)
    path = `local://${path}`
  }

  data = data.replace(oldString, path)
}

fs.writeFile('output.json', data, err => { 
  // Checking for errors 
  if (err) throw err
 
  console.log('Done writing') // Success 
})
