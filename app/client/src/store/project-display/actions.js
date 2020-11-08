import callDependingOnBackend from '../../store/callDependingOnBackend'

/**
 * Initializes state in this Vuex module.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 */
export async function initStoreProjectSubmit (context) {
  callDependingOnBackend(context, loadUserListFirebase)
}

/**
 * Loads the table of contents for users.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
async function loadProjectTocPromise ({ commit, getters }) {
  const tocPromise = getters.db.collection('projects').doc('ToC').get()
  commit('setTocPromise', tocPromise)
}

/**
 * Loads the table of contents for users.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 * @param {Object} context.commit Allows this action to commit mutations
 * @param {Object} context.getters Gives access to state.
 */
async function loadUserTocPromise ({ commit, getters }) {
  const tocPromise = getters.db.collection('projects').doc('ToC').get()
  commit('setTocPromise', tocPromise)
}
