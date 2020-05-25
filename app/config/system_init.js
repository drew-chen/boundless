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

const path = process.cwd()

let buffer = fs.readFileSync(`${path}/init.js`)

buffer = buffer.toString()

while (buffer.indexOf('"') >= 0) {
  buffer = buffer.replace('"', "'").replace(',', '')
}

let start = buffer.indexOf('{')
let end = buffer.indexOf('}')
buffer = buffer.substring(start + 1, end).trim()

let data = buffer.split('\r\n')

if (buffer.length === 1) {
  data = buffer.split('\n')
}

let finalData = ''
for (let i in data) {
  finalData += `    ${data[i].trim()}\n`
}
finalData = `databaseConfig:
  production:
${finalData}
  testing:
${finalData}
  dev:
`

fs.writeFile(
  'app/config/system.yml', finalData, function (err) {
    if (err)
      return console.log(err)
    console.log(`'system.yml' is created...`)
  }
)
