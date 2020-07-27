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

Name:     boot/errorHandler.js
Purpose:

  Global method of handling expected exceptions generated from Vue
  components.

Methods:

  A Vue error handler is configured on boot.
  NOTE: Async errors currently can only be caught here if awaited!

## */

import DbException from './../models/DbException'

/**
 * Handles errors from components. Does not catch non-vue errors nor async
 * errors that have not been fulfilled or rejected (i.e. awaited).
 * @param {Object} bootObject Passed by Quasar on boot
 *  (https://quasar.dev/quasar-cli/boot-files#Anatomy-of-a-boot-file).
 * @param  {Object} bootObject.Vue Same object as if we do import Vue from 'vue'.
 */
export default ({ Vue }) => {
  /**
   * err: complete error trace, contains the message and error stack
   * vm: Vue component/instance in which error is occurred
   * info: Vue specific error information such as lifecycle hooks, events etc.
   */
  Vue.config.errorHandler = (error, vm, info) => {
    if (error instanceof DbException) {
      console.error('Caught in handler:', error)
      vm.$q.notify({
        type: 'negative',
        message: 'There was an error retrieving from the database. Some' +
          ' functionality will be limited.'
      })
    } else {
      throw error
    }
    // TODO: Perform any custom logic or log to server
  }
}
