/* This file is responsible for large database interactions or grouping mutations */

import productionDb from '../../firebase/init_production'

import { LocalStorage } from 'quasar'

export async function loadFireRefs ({ commit }) {
  /**
    * Sets up the firebase reference getter
    */
  if (LocalStorage.has('boundless_db')) {
    let sessionDb = LocalStorage.getItem('boundless_db')
    // loading firebase references
    commit('setIsTestingDb', sessionDb === 'testing')

    return true
  } else {
    try {
      let doc = await productionDb.collection('config').doc('project').get()

      if (doc.exists) {
        if (doc.data().db === 'testing') {
          commit('setIsTestingDb', true)
          LocalStorage.set('boundless_db', 'testing')
        } else {
          commit('setIsTestingDb', false)
          LocalStorage.set('boundless_db', 'production')
        }
      } else {
        let msg = '"/config/project" path does not exists!'
        throw new Error(msg)
      }

      return true
    } catch (error) {
      commit('setIsTestingDb', false)
      LocalStorage.set('boundless_db', 'production')

      return false
    }
  }
}

export async function loadConfig ({ commit, getters }) {
  /**
    * load the config from the db
    * TODO: this should be replaced now that config/project
    *       is cached in session
    * @param {void}
    * @return {Promise<Boolean>}
    */
  try {
    let doc = await getters.db.collection('config').doc('project').get()

    if (doc.exists) {
      let data = doc.data()
      let keywordOptions = []
      for (let key in data['keywords']) {
        keywordOptions.push({
          label: key,
          value: data['keywords'][key]
        })
      }
      commit('setKeywordOptions', keywordOptions)
      commit('setAllowedDomain', data['allowedDomain'])
      commit('setBodyTypeOptions', data['bodyContentType'])
      commit('setChipTypeOptions', data['chipContentType'])

      return true
    }
    throw new Error('Required document not found!')
  } catch (error) {
    return false
  }
}

export async function loadUserList ({ commit, getters }) {
  /**
    * load the user list from the db and store the data into component state
    * @param {void}
    * @return {Promise<Boolean>}
    */

  try {
    let doc = await getters.db.collection('users').doc('ToC').get()

    if (doc.exists) {
      let tocUserData = doc.data()
      let emailToUuidMap = {}
      let emailToNameMap = {}
      for (let uuid in tocUserData) {
        emailToUuidMap[tocUserData[uuid].email] = uuid
        emailToNameMap[tocUserData[uuid].email] = tocUserData[uuid].name
      }

      commit('setEmailToUuidMap', emailToUuidMap)
      commit('setEmailToNameMap', emailToNameMap)
      return true
    }

    throw new Error('users/ToC not found!')
  } catch (error) {
    return false
  }
}

export async function submitNewUsers ({ commit, getters }) {
  /**
    * Submits the new users related to the project as the user submits
    * the project to the database.
    * @param {void}
    * @return {void}
    */

  try {
    getters.projectMembers.forEach(async (member) => {
      if (!(member.email in getters.emailToUuidMap)) {
        let timeOfSubmit = new Date(Date.now()).toISOString()
        let userDoc = getters.db.collection('users').doc()
        let uuid = userDoc.id

        let newUser = {
          uuid,
          name: member.name,
          email: member.email,
          title: '',
          imgURL: '',
          timestamp: timeOfSubmit,
          created: timeOfSubmit
        }

        commit('addEntryToEmailToUuidMap', {
          email: newUser.email,
          uuid
        })
        commit('addEntryToEmailToNameMap', {
          email: newUser.email,
          name: newUser.name
        })

        await getters.db.collection('users').doc(uuid).set({
          socialNetwork: {},
          projects: [],
          achievements: {}
        })

        await getters.db.collection('users').doc('ToC').set({
          [uuid]: newUser
        }, { merge: true })
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

export async function submitProject ({ commit, dispatch, getters }) {
  /**
    * Submits the project to the database once all the required fields are checked.
    * Creates the new users who are not in the db, and notifies
    * the user on both success and failure.
    * Unlike most other fields, the project id, submission time and users list
    * are finalized in here instead of in ProjectMainForm.vue
    * @param {void}
    * @return {void}
    */
  try {
    await dispatch('submitNewUsers')

    let tmpMembers = []
    getters.projectMembers.forEach(member => {
      tmpMembers.push({
        uuid: getters.emailToUuidMap[member.email],
        role: member.role
      })
    })
    commit('setSubmittedProjectMembers', tmpMembers)

    // create a reference to a new project in the db
    let projectDoc = getters.db.collection('projects').doc()
    let submitTime = new Date(Date.now()).toISOString()

    commit('setProjectUuid', projectDoc.id)
    commit('setProjectSubmitTime', submitTime)

    await projectDoc.set({
      webpage: getters.webpage,
      files: {}
    })
    await getters.db.collection('projects').doc('ToC').set({
      [getters.projectUuid]: getters.project
    }, { merge: true })
  } catch (error) {
    throw new Error(error)
  }
}

export async function submitQuestions ({ commit, getters }) {
  /**
   * Save custom form responses under a field named 'createInfo'.
   */
  try {
    let uuid = getters.projectUuid
    let projectDoc = getters.db.collection('projects').doc(uuid)
    await projectDoc.update({
      customFormResponse: getters.questions
    })
  } catch (error) {
    throw new Error(error)
  }
}

export function resetProject ({ commit }) {
  /**
    * Helper function which resets the vuex store to the initial state.
    * @param {void}
    * @return {void}
    */
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
