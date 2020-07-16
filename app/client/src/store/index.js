import Vue from 'vue'
import Vuex from 'vuex'

import projectSubmit from './project-submit'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    // The module name is 'projectSubmit' not 'project-submit'
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
