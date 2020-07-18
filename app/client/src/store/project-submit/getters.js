import productionDb from '../../firebase/init_production'
import testingDb from '../../firebase/init_testing'

// <Object>: firebase firestore credentials
export function db (state) {
  if (state.isTestingDb) {
    return testingDb
  }
  return productionDb
}

export function project (state) {
  return state.project
}

// <String> Project name is stored under the field 'project' in the db instead of 'name'.
export function projectName (state) {
  return state.project.project
}

export function projectDescription (state) {
  return state.project.description
}

export function projectUuid (state) {
  return state.project.uuid
}

/**
 * <Array<Object>>: list of inputted project member/s.
 * Not the final project member list.
 */
export function projectMembers (state) {
  return state.projectMembers
}

export function step (state) {
  return state.step
}

export function keywordOptions (state) {
  return state.keywordOptions
}

// <Array<Object>> Chosen subset of keywordOptions submitted with project.
export function projectKeywords (state) {
  return state.project.keywords
}

export function allowedDomain (state) {
  return state.allowedDomain
}

export function bodyTypeOptions (state) {
  return state.bodyTypeOptions
}

export function chipTypeOptions (state) {
  return state.chipTypeOptions
}

export function emailToUuidMap (state) {
  return state.emailToUuidMap
}

export function emailToNameMap (state) {
  return state.emailToNameMap
}

export function webpage (state) {
  return state.webpage
}

export function questions (state) {
  return state.questions
}

export function questionTemplates (state) {
  return state.questionTemplates
}
