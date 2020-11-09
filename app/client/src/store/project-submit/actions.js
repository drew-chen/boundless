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

Name:     store/project-submit/actions.js
Purpose:

  Actions for the project-submit Vuex module. Methods here are
  responsible for large database interactions or grouping mutations.

Methods:

  Firebase and Vuex are both modified here and should be in sync.
  The general flow is to load information from the database then
  commit mutations to keep the state up to date. Or, to commit mutations
  then update Firebase to keep Firebase up to date.

## */

import productionDb from '../../firebase/init_production'
import DbException from '../../errors/DbException'
import { LocalStorage } from 'quasar'
import callDependingOnBackend from '../../store/callDependingOnBackend'

/**
 * Initializes state in this Vuex module.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 */
export async function initStore (context) {
  await callDependingOnBackend(context, loadFireRefs)
  await loadConfig(context)
  await loadUserList(context)
}

/**
 * Sets up the Firebase reference getter. This should be called foremost before
 * setting or getting any Vuex state related to the db.
 *
 * Previous versions of this function found in other files returned true if
 * there was no error and false if there was an error. This has been removed on
 * 7/22/2020 since the purpose of those return values were unknown.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 */
async function loadFireRefs ({ commit }) {
  if (LocalStorage.has('boundless_db')) {
    const sessionDb = LocalStorage.getItem('boundless_db')
    commit('setIsTestingDb', sessionDb === 'testing')
  } else {
    const doc = await productionDb.collection('config').doc('project').get()

    if (doc.exists) {
      if (doc.data().db === 'testing') {
        commit('setIsTestingDb', true)
        LocalStorage.set('boundless_db', 'testing')
      } else {
        commit('setIsTestingDb', false)
        LocalStorage.set('boundless_db', 'production')
      }
    } else {
      commit('setIsTestingDb', false)
      LocalStorage.set('boundless_db', 'production')
      const msg = '"/config/project" path does not exists!'
      throw new DbException(msg)
    }
  }
}

/**
 * Load the config from the db.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 */
async function loadConfig (context) {
  await callDependingOnBackend(context, loadConfigFirebase)
}

/**
 * Helper function for 'loadConfig' which uses Firebase as the backend.
 * TODO: this should be replaced now that config/project
 *       is cached in session
 *
 * Previous versions of this function found in other files returned true if
 * there was no error and false if there was an error. This has been removed on
 * 7/22/2020 since the purpose of those return values were unknown.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
async function loadConfigFirebase ({ commit, getters }) {
  const doc = await getters.db.collection('config').doc('project').get()
  if (doc.exists) {
    const data = doc.data()
    const keywordOptions = []
    for (let key in data['keywords']) {
      keywordOptions.push({
        label: key,
        value: data['keywords'][key]
      })
    }
    let questionTemplates = data.projectsConfig.questionTemplates
    questionTemplates = (questionTemplates === undefined) ? [] : questionTemplates
    let customFormEnabled = data.projectsConfig.customFormEnabled
    customFormEnabled = (customFormEnabled === undefined) ? false : customFormEnabled

    commit('setKeywordOptions', keywordOptions)
    commit('setQuestionTemplates', questionTemplates)
    commit('setQuestions', [])
    commit('setCustomFormEnabled', customFormEnabled)
    commit('setAllowedDomain', data.allowedDomain)
    commit('setBodyTypeOptions', data.bodyContentType)
    commit('setChipTypeOptions', data.chipContentType)
  } else {
    throw new DbException('Required document not found!')
  }
}

/**
 * Load the user list from the db and store the data into component state.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 */
async function loadUserList (context) {
  await callDependingOnBackend(context, loadUserListFirebase)
}

/**
 * Helper function for 'loadUserList' which uses Firebase as the backend.
 *
 * Previous versions of this functions found in other files returned true if
 * there was no error and false if there was an error. This has been removed on
 * 7/22/2020 since the purpose of those return values were unknown.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
async function loadUserListFirebase ({ commit, getters }) {
  const doc = await getters.db.collection('users').doc('ToC').get()
  if (doc.exists) {
    const tocUserData = doc.data()
    const emailToUuidMap = {}
    const emailToNameMap = {}
    for (let uuid in tocUserData) {
      emailToUuidMap[tocUserData[uuid].email] = uuid
      emailToNameMap[tocUserData[uuid].email] = tocUserData[uuid].name
    }
    commit('setEmailToUuidMap', emailToUuidMap)
    commit('setEmailToNameMap', emailToNameMap)
  } else {
    throw new DbException('users/ToC not found!')
  }
}

/**
 * Submits the new users related to the project as the user submits
 * the project to the database.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 */
export async function submitNewUsers (context) {
  await callDependingOnBackend(context, submitNewUsersFirebase)
}

/**
 * Helper function for 'submitNewUsers' which uses Firebase as the backend.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
async function submitNewUsersFirebase ({ commit, getters }) {
  /*
  Cannot use Array.forEach with an async callback here, as it will not wait for the
  first iteration to finish before moving onto the second one.
  */
  for (const member of getters.projectMembers) {
    const email = member.email
    if (!(email in getters.emailToUuidMap)) {
      const name = member.name
      const timeOfSubmit = new Date(Date.now()).toISOString()
      const userDoc = getters.db.collection('users').doc()
      const uuid = userDoc.id
      let newUser = {
        uuid,
        name,
        email,
        title: '',
        imgURL: '',
        timestamp: timeOfSubmit,
        created: timeOfSubmit
      }
      await getters.db.collection('users').doc(uuid).set({
        socialNetwork: {},
        projects: [],
        achievements: {}
      })
      await getters.db.collection('users').doc('ToC').set({
        [uuid]: newUser
      }, { merge: true })
      commit('addEntryToEmailToUuidMap', {
        email,
        uuid
      })
      commit('addEntryToEmailToNameMap', {
        email,
        name
      })
    }
  }
}

/**
 * Submits the project to the database once all the required fields are checked
 * externally. Since another project is submitted, DisplayProject.vue, which
 * uses the projectDisplay Vuex module, must also be updated.
 *
 * Creates the new users who are not in the db, and notifies
 * the user on both success and failure.
 * Unlike most other fields, the project id, submission time and users list
 * are finalized in here instead of in 'ProjectMainForm.vue'.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 */
export async function submitProject (context) {
  await callDependingOnBackend(context, submitProjectFirebase)
  // Payload is null.
  context.dispatch('projectDisplay/initStore', null, { root: true })
}

/**
 * Helper function for 'submitProject' which uses Firebase as the backend.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations.
 * @param {Object} context.dispatch Used to call other actions.
 * @param {Object} context.getters Gives access to state.
 */
async function submitProjectFirebase ({ commit, dispatch, getters }) {
  await dispatch('submitNewUsers')

  const tmpMembers = []
  getters.projectMembers.forEach(member => {
    tmpMembers.push({
      uuid: getters.emailToUuidMap[member.email],
      role: member.role
    })
  })
  commit('setSubmittedProjectMembers', tmpMembers)

  // create a reference to a new project in the db
  const projectDoc = getters.db.collection('projects').doc()
  const submitTime = new Date(Date.now()).toISOString()

  commit('setProjectUuid', projectDoc.id)
  commit('setProjectSubmitTime', submitTime)
  await projectDoc.set({
    webpage: getters.webpage,
    files: {}
  })
  await getters.db.collection('projects').doc('ToC').set({
    [getters.projectUuid]: getters.project
  }, { merge: true })
}

/**
 * Save custom form responses under a field named 'customFormResponse'.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 */
export async function submitQuestions (context) {
  await callDependingOnBackend(context, submitQuestionsFirebase)
}

/**
 * Helper function for 'submitQuestions' which uses Firebase as the backend.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.getters Gives access to state.
 */
async function submitQuestionsFirebase ({ getters }) {
  const uuid = getters.projectUuid
  const projectDoc = getters.db.collection('projects').doc(uuid)
  await projectDoc.update({
    customFormResponse: getters.questions
  })
}

/**
 * Save questionTemplates to Vuex and the database.
 *
 * Since the helper function 'submitQuestionTemplatesFirebase' has two arguments
 * instead of one and 'callDependingOnBackend' on works with functions with one
 * argument, 'submitQuestionTemplatesFirebase' is converted to a one argument
 * function.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Array<Object>} questionTemplates The new state of questionTemplates.
 */
export async function submitQuestionTemplates (context, questionTemplates) {
  function submitFirebaseQuestionsBound (context) {
    return submitQuestionTemplatesFirebase(context, questionTemplates)
  }
  await callDependingOnBackend(context, submitFirebaseQuestionsBound)
}

/**
 * Helper function for 'submitQuestionTemplates' which uses Firebase as the
 * backend. Unlike most other helper functions in 'actions.js', this helper
 * has two arguments instead of one.
 *
 * @param {Object} context Exposes the same set of methods/properties on the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 * @param {Array<Object>} questionTemplates The new state of questionTemplates.
 */
async function submitQuestionTemplatesFirebase ({ commit, getters }, questionTemplates) {
  await getters.db.collection('config')
    .doc('project')
    .set({
      projectsConfig: {
        questionTemplates
      }
    }, { merge: true })
  commit('setQuestionTemplates', questionTemplates)
}

/**
 * Save customFormEnabled to Vuex and the database. Converts
 * 'submitCustomFormEnabledFirebase' into a one argument function before calling
 * since 'callDependingOnBackend' only works with one argument functions.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 * @param {Array<Object>} questionTemplates The new state of questionTemplates.
 */
export async function submitCustomFormEnabled (context, customFormEnabled) {
  function submitFirebaseCustomFormEnabledBound (context) {
    return submitCustomFormEnabledFirebase(context, customFormEnabled)
  }
  await callDependingOnBackend(context, submitFirebaseCustomFormEnabledBound)
}

/**
 * Helper function for 'submitCustomFormEnabled' which uses Firebase as the
 * backend. Unlike most other helper functions in 'actions.js', this helper
 * has two arguments instead of one.
 *
 * @param {Object} context Exposes the same set of methods/properties on the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 * @param {Array<Object>} questionTemplates The new state of questionTemplates.
 */
async function submitCustomFormEnabledFirebase ({ commit, getters }, customFormEnabled) {
  await getters.db.collection('config')
    .doc('project')
    .set({
      projectsConfig: {
        customFormEnabled
      }
    }, { merge: true })
  commit('setCustomFormEnabled', customFormEnabled)
}

/**
 * Resets the vuex store to the initial state.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 */
export function resetProject ({ commit }) {
  commit('setProject', {
    uuid: null,
    name: '',
    description: '',
    members: [],
    keywords: [],
    timestamp: null,
    created: null,
    progress: 0,
    hidden: false,
    alias: ''
  })
  commit('setProjectMembers', [{
    name: '',
    email: '',
    role: 'lead'
  }])
  commit('setWebpage', {
    imgURL: '',
    chips: [],
    body: []
  })
}
