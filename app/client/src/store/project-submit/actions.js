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
import { backendEnum, CURRENT_BACKEND } from '../../../backends.config'
/**
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 *   For all the properties of the context object, see:
 *   https://vuex.vuejs.org/api/#actions.
 */
export async function initStoreProjectSubmit (context) {
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      await loadFireRefs(context)
      break
    default:
      throw DbException('No matching backend type.')
  }
  await loadConfig(context)
  await loadUserList(context)
}

/**
 * Sets up the Firebase reference getter. This should be called foremost before
 * setting or getting any Vuex state related to the db.
 *
 * Previous versions of this functions return true if there was an error
 * and false other wise. This has been removed on 7/22/2020 since the purpose
 * of those return values were unknown.
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
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      await firebaseLoadConfig(context)
      break
    default:
      throw DbException('No matching backend type.')
  }
}

/**
 * Load the config from firebase.
 * TODO: this should be replaced now that config/project
 *       is cached in session
 *
 * Previous versions of this functions return true if there was an error
 * and false other wise. This has been removed on 7/22/2020 since the purpose
 * of those return values were unknown.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
async function firebaseLoadConfig ({ commit, getters }) {
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
 * Previous versions of this functions return true if there was an error
 * and false other wise. This has been removed on 7/22/2020 since the purpose
 * of those return values were unknown.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
async function loadUserList ({ commit, getters }) {
  const emailToUuidMap = {}
  const emailToNameMap = {}
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      const doc = await getters.db.collection('users').doc('ToC').get()

      if (doc.exists) {
        const tocUserData = doc.data()
        for (let uuid in tocUserData) {
          emailToUuidMap[tocUserData[uuid].email] = uuid
          emailToNameMap[tocUserData[uuid].email] = tocUserData[uuid].name
        }
      } else {
        throw new DbException('users/ToC not found!')
      }
      break
    default:
      throw DbException('No matching backend type.')
  }
  commit('setEmailToUuidMap', emailToUuidMap)
  commit('setEmailToNameMap', emailToNameMap)
}

/**
 * Submits the new users related to the project as the user submits
 * the project to the database.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
export async function submitNewUsers ({ commit, getters }) {
  /*
  Cannot use Array.forEach with an async callback here, as it will not wait for the
  first iteration to finish before moving onto the second one.
  */
  for (const member of getters.projectMembers) {
    const email = member.email
    if (!(email in getters.emailToUuidMap)) {
      const name = member.name
      let uuid
      switch (CURRENT_BACKEND) {
        case backendEnum.FIREBASE:
          const timeOfSubmit = new Date(Date.now()).toISOString()
          const userDoc = getters.db.collection('users').doc()
          uuid = userDoc.id
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
          break
        default:
          throw DbException('No matching backend type.')
      }
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
 * Submits the project to the database once all the required fields are checked.
 * Creates the new users who are not in the db, and notifies
 * the user on both success and failure.
 * Unlike most other fields, the project id, submission time and users list
 * are finalized in here instead of in ProjectMainForm.vue
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations.
 * @param {Object} context.dispatch Used to call other actions.
 * @param {Object} context.getters Gives access to state.
 */
export async function submitProject ({ commit, dispatch, getters }) {
  console.log('0 reached')

  await dispatch('submitNewUsers')

  const tmpMembers = []
  getters.projectMembers.forEach(member => {
    tmpMembers.push({
      uuid: getters.emailToUuidMap[member.email],
      role: member.role
    })
  })
  commit('setSubmittedProjectMembers', tmpMembers)
  console.log('----1 reached', tmpMembers)
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      // create a reference to a new project in the db
      const projectDoc = getters.db.collection('projects').doc()
      const newProjectUuid = projectDoc.id
      const submitTime = new Date(Date.now()).toISOString()
      await projectDoc.set({
        customFormResponse: [],
        webpage: getters.webpage,
        files: {}
      })
      console.log('2 reached')

      commit('setProjectSubmitTime', submitTime)
      commit('setProjectUuid', newProjectUuid)
      try {
        await getters.db.collection('projects').doc('ToC').set({
          [newProjectUuid]: getters.project
        }, { merge: true })
      } catch (error) {
        debugger
        console.error(error)
        console.log('---', newProjectUuid, getters.project)
        throw error
      }
      break
    default:
      throw DbException('No matching backend type.')
  }
  console.log('3 reached')
}

/**
 * Save custom form responses under a field named 'createInfo'.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.getters Gives access to state.
 */
export async function submitQuestions ({ getters }) {
  const uuid = getters.projectUuid
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      const projectDoc = getters.db.collection('projects').doc(uuid)
      await projectDoc.update({
        customFormResponse: getters.questions
      })
      break
    default:
      throw DbException('No matching backend type.')
  }
}

/**
 * Save questionTemplates to vuex and Firestore.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 * @param {Array<Object>} questionTemplates The new state of questionTemplates.
 */
export async function submitQuestionTemplates ({ commit, getters }, questionTemplates) {
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      await getters.db.collection('config')
        .doc('project')
        .set({
          projectsConfig: {
            questionTemplates
          }
        }, { merge: true })
      break
    default:
      throw DbException('No matching backend type.')
  }
  commit('setQuestionTemplates', questionTemplates)
}

/**
 * Save customFormEnabled to vuex and Firestore.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *  store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 * @param {Array<Object>} questionTemplates The new state of questionTemplates.
 */
export async function submitCustomFormEnabled ({ commit, getters }, customFormEnabled) {
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      await getters.db.collection('config')
        .doc('project')
        .set({
          projectsConfig: {
            customFormEnabled
          }
        }, { merge: true })
      break
    default:
      throw DbException('No matching backend type.')
  }
  commit('setCustomFormEnabled', customFormEnabled)
}

/**
 * Helper function which resets the vuex store to the initial state.
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
