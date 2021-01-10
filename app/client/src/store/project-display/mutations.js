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

Name:     store/project-display/mutations.js
Purpose:

  Mutations for the project-display Vuex module. Allows for direct,
  synchronous changes to the state. Since these are database references,
  these should not be modified other than during the initial load.

Methods:

  Directly assigns payload to state. To avoid unwanted mutations,
  the input payload can be copied so that the caller doesn't
  accidentally mutate state without first going through here.

  Note: since none of these objects are updated and are not directly displayed,
  then updates do not need to be reactive. For example, this assumes we don't
  change databases live.

## */

export function setProjectTocPromise (state, tocPromise) {
  state.projectTocPromise = tocPromise
}

export function setProjectConfigPromise (state, projectConfigPromise) {
  state.projectConfigPromise = projectConfigPromise
}

export function setUserTocPromise (state, tocPromise) {
  state.userTocPromise = tocPromise
}
