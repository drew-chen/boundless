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

Name:     store/project-display/getters.js
Purpose:

  Getters for the project-display Vuex module. Provides read only access
  to state related to project submission.

Methods:

  Returns state properties directly. To avoid mutating the state of non-primitive
  types, the return value can be copied. Copied data can then be freely changed
  without impacting state.

## */

export function projectTocPromise (state) {
  return state.projectTocPromise
}

export function projectConfigPromise (state) {
  return state.projectConfigPromise
}

export function userTocPromise (state) {
  return state.userTocPromise
}
