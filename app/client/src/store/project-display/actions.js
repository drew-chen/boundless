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

Name:     store/project-display/actions.js
Purpose:

  Actions for the project-display Vuex module. Methods here are
  responsible loading in info needed to display projects. This module
  is also to help performance. Database calls can be loaded and finished
  before they are needed by the project listing page. This is useful
  since most users will eventually visit the project listing page.

Methods:

  Using the database reference from project-submit (see rootGetters),
  various calls to the database are made. These calls are stored in this
  module's state.

## */

import callDependingOnBackend from '../../store/callDependingOnBackend'

/**
 * Initializes state in this Vuex module.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 */
export async function initStore (context) {
  callDependingOnBackend(context, loadProjectTocPromise)
  callDependingOnBackend(context, loadProjectConfigPromise)
  callDependingOnBackend(context, loadUserTocPromise)
}

/**
 * Loads the table of contents for projects.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.rootGetters Gives access to state.
 */
async function loadProjectTocPromise ({ commit, rootGetters }) {
  const tocPromise = rootGetters['projectSubmit/db']
    .collection('projects').doc('ToC').get()
  commit('setProjectTocPromise', tocPromise)
}

/**
 * Loads the config document for projects.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.rootGetters Gives access to state for all modules.
 */
async function loadProjectConfigPromise ({ commit, rootGetters }) {
  const tocPromise = rootGetters['projectSubmit/db']
    .collection('config').doc('project').get()
  commit('setProjectConfigPromise', tocPromise)
}

/**
 * Loads the table of contents for users.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.rootGetters Gives access to state for all modules.
 */
async function loadUserTocPromise ({ commit, rootGetters }) {
  const tocPromise = rootGetters['projectSubmit/db']
    .collection('users').doc('ToC').get()
  commit('setUserTocPromise', tocPromise)
}
