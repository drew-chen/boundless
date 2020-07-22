
/* ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     boot/initProjectSubmitStore.js
Purpose:  Initializes the projectSubmit Vuex module's store.

Methods: Uses actions defined in 'store/project-submit/actions.js'.

## */

export default async ({ store }) => {
  try {
    console.log('ran')
    await store.dispatch('projectSubmit/loadFireRefs')
    // The next 2 calls are independent so no awaiting is needed.
    store.dispatch('projectSubmit/loadConfig')
    store.dispatch('projectSubmit/loadUserList')
  } catch (error) {
    // TODO: Add better error handling
    console.error('There was an error loading the database.')
    throw new Error(error)
  }
}
