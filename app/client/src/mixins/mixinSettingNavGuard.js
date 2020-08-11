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

Name:     mixins/mixinSettingNavGuard.js
Purpose:

 Reusable mixin for settings pages. If there are unsaved changes, then a dialog
 with further instructions will be opened.

Methods:

  First, this mixin is initialized with a parameter: the setting name. This is so
  it only activates when the route (hence parameter) is correct.

  This mixin relies heavily on the data() and the refs of the mixed in component
  and on navigation guards. For details, see the method JS doc).

## */

/**
 * Returns a mixin that blocks navigation.
 * @param {String} The name of the setting, ie, 'challenges' or 'general'.
 * @returns {Object} Mixin object.
 */
const mixinSettingNavGuard = settingName => ({
  /**
   * Block leaving with persistent dialog if changes have been made.
   * View specifics on navigation guards at:
   * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
   *
   * @param {Object} to The target Route Object being navigated to.
   * @param {Object} from The current route being navigated away from.
   * @param {Function} next This function must be called to resolve the hook.
   *  In other words, this is the function controlling routing.
   */
  beforeRouteLeave (to, from, next) {
    if (settingName === this.settingProps.name) {
      if (this.$refs.settings.updated) {
        this.$refs.settings.$refs.dialogConfirmLeave.open(next)
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default mixinSettingNavGuard
