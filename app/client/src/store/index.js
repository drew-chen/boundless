/* ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     store/index.js

Purpose:  Vuex store definition. Modules are added here.

Methods:  For more information on Vuex, see:
            * https://vuex.vuejs.org/
            * https://quasar.dev/quasar-cli/vuex-store

## */

import Vue from 'vue'
import Vuex from 'vuex'

import projectSubmit from './project-submit'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    // The module name is 'projectSubmit' not 'project-submit'.
    modules: {
      projectSubmit
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./project-submit'], () => {
      const newProjectSubmit = require('./project-submit').default
      Store.hoytUpdate({ modules: { projectSubmit: newProjectSubmit } })
    })
  }
  return Store
}
