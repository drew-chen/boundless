<!-- ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     components/Manage/Settings/SettingsProject.vue
Purpose:  Manage project settings and guard navigation.
Methods:

  This component wraps around 'AdminSettings.vue', where most of the actual
  functionality is located. This wrapping is needed so that 'ManageSettings.vue'
  can pass different props and listen to different events depending on the route.

## -->

<template>
  <admin-settings
    v-if="settingProps.name === 'projects'"
    :keywords="settingProps.keywords"
    type="projects"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.setProjectConfig"
    ref="adminSettings"
  />
</template>

<script>
import AdminSettings from './Components/AdminSettings.vue'

export default {
  props: {
    // Object containing all custom props. See structure in 'ManageSettings.vue'.
    settingProps: {
      type: Object,
      required: true,
      validator (prop) {
        return prop.hasOwnProperty('name')
      }
    }
  },
  /**
   * Block leaving with persistent dialog if changes have been made.
   * View specifics on navigation guards at:
   * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
   *
   * @param {Object} to The target Route Object being navigated to.
   * @param {Object} from The current route being navigated away from.
   * @param {Function} next This function must be called to resolve the hook.
   */
  beforeRouteLeave (to, from, next) {
    if (this.settingProps.name === 'projects') {
      this.$refs.adminSettings.openConfirmLeaveDialog(next)
    } else {
      next()
    }
  },
  components: {
    AdminSettings
  }
}
</script>

<style>

</style>
