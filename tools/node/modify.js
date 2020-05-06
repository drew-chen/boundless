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
let data = require('./boundless_data.0000-00-00T00_00_00.json')

let searchKey = 'UNORDERED_LIST'
let targetKey = 'ORDERED_LIST'
// let config = data[0].data
let projects = data[1].data
// let users = data[2].data
let challenges = data[3].data

for (const k in projects) {
  if (JSON.stringify(projects[k]).includes(searchKey)) {
    projects[k].data.webpage.body.forEach(obj => {
      if (obj.content.type === searchKey) {
        obj.content.type = targetKey
        obj.content.list.forEach(item => {
          item.index = 1
        })
      }
    })
  }
}

for (const k in challenges) {
  if (JSON.stringify(challenges[k]).includes(searchKey)) {
    challenges[k].data.webpage.body.forEach(obj => {
      if (obj.content.type === searchKey) {
        obj.content.type = targetKey
        obj.content.list.forEach(item => {
          item.index = 1
        })
      }
    })
  }
}

searchKey = 'TEXT_BOX'
targetKey = 'MARKDOWN'

for (const k in projects) {
  if (JSON.stringify(projects[k]).includes(searchKey)) {
    projects[k].data.webpage.body.forEach(obj => {
      if (obj.content.type === searchKey) {
        obj.content.type = targetKey
        obj.content.view = 'edit'
      }
    })
  }
}

for (const k in challenges) {
  if (JSON.stringify(challenges[k]).includes(searchKey)) {
    challenges[k].data.webpage.body.forEach(obj => {
      if (obj.content.type === searchKey) {
        obj.content.type = targetKey
        obj.content.view = 'edit'
      }
    })
  }
}

fs.writeFile('output.json', JSON.stringify(data, null, 2), err => { 
     
  // Checking for errors 
  if (err) throw err
 
  console.log('Done writing') // Success 
})
