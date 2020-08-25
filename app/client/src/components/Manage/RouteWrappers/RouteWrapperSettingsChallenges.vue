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

Name:     components/Manage/RouteWrappers/RouteWrappersSettingsChallenges.vue
Purpose:  Manage challenge settings and guard navigation.
Methods:

  This component wraps around the 'SettingsProjectsAndChallenges.vue' where the
  actual functionality is located. This wrapping is needed so that
  'ManageSettings.vue' can pass different props and listen to different events
  depending on the route.

## -->

<template>
  <settings-projects-and-challenges
    v-if="settingProps.name === 'challenges' && settingProps.challengesEnabled"
    type="challenges"
    :keywords="settingProps.keywords"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.setChallengeConfig"
    ref="settings"
  />
</template>

<script>
import SettingsProjectsAndChallenges from '../Settings/SettingsProjectsAndChallenges'
import mixinSettingNavGuard from '../../../mixins/mixinSettingNavGuard'

export default {
  mixins: [mixinSettingNavGuard('challenges')],
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
  components: {
    SettingsProjectsAndChallenges
  },
  /**
   * If challenges are disabled, redirect to general settings.
   *
   * @param {Object} to The target Route Object being navigated to.
   * @param {Object} from The current route being navigated away from.
   * @param {Function} next This function must be called to resolve the hook.
   *  In other words, this is the function controlling routing.
   */
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // access to component instance via 'vm'
      if (vm.settingProps.challengesEnabled) {
        next()
      } else {
        next('/admin/settings/general')
      }
    })
  }
}
</script>

<style>

</style>
