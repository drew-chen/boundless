import Vue from 'vue'

export function setProject (state, project) {
  Vue.set(state, 'project', project) // might need deep copy
}

export function setProjectUuid (state, uuid) {
  Vue.set(state.project, 'uuid', uuid)
}

export function setProjectSubmitTime (state, submissionTime) {
  Vue.set(state.project, 'timestamp', submissionTime)
  Vue.set(state.project, 'created', submissionTime)
}

export function setIsTestingDb (state, isTestingDb) {
  Vue.set(state, 'isTestingDb', isTestingDb)
}

export function setKeywordOptions (state, keywordOptions) {
  Vue.set(state, 'keywordOptions', keywordOptions)
}

export function setAllowedDomain (state, allowedDomain) {
  Vue.set(state, 'allowedDomain', allowedDomain)
}

export function setBodyTypeOptions (state, bodyTypeOptions) {
  Vue.set(state, 'bodyTypeOptions', bodyTypeOptions)
}

export function setChipTypeOptions (state, chipTypeOptions) {
  Vue.set(state, 'chipTypeOptions', chipTypeOptions)
}

export function setEmailToUuidMap (state, emailToUuidMap) {
  Vue.set(state, 'emailToUuidMap', emailToUuidMap)
}

export function setEmailToNameMap (state, emailToNameMap) {
  Vue.set(state, 'emailToNameMap', emailToNameMap)
}
// Project members list used for input.
export function setProjectMembers (state, projectMembers) {
  Vue.set(state, 'projectMembers', projectMembers)
}

// The final list of members for the submitted project.
export function setSubmittedProjectMembers (state, members) {
  Vue.set(state.project, 'members', members)
}

export function setWebpage (state, webpage) {
  Vue.set(state, 'webpage', webpage)
}

export function setQuestions (state, questions) {
  Vue.set(state, 'questions', questions)
}

export function addEntryToEmailToUuidMap (state, { email, uuid }) {
  Vue.set(state.emailToUuidMap, email, uuid)
}

export function addEntryToEmailToNameMap (state, { email, name }) {
  Vue.set(state.emailToNameMap, email, name)
}

export function addMemberToProjectMembers (state, { email, name }) {
  Vue.set(state.projectMembers, email, name)
}

export function addKeywordToProjectKeywords (state, keyword) {
  state.project.keywords.push(keyword)
}
