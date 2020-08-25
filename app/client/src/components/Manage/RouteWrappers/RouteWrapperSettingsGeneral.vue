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

Name:     components/Manage/RouteWrapper/RouteWrapperSettingsGeneral.vue
Purpose:  Manage general settings and guard navigation.
Methods:

  This component wraps around 'GeneralSettings.vue', where most of the actual
  functionality is located. This wrapping is needed so that 'ManageSettings.vue'
  can pass different props and listen to different events depending on the route.

## -->

<template>
  <settings-general
    v-if="settingProps.name === 'general'"
    @usersConfigInfo="settingProps.setUserConfig"
    @challengesConfigInfo="settingProps.setChallengeConfig"
    @projectsConfigInfo="settingProps.setProjectConfig"
    @keywords="settingProps.setKeywords"
    @submitting="settingProps.consoleLoading"
    ref="settings"
  />
</template>

<script>
import SettingsGeneral from '../Settings/SettingsGeneral'
import mixinSettingNavGuard from '../../../mixins/mixinSettingNavGuard'

export default {
  mixins: [mixinSettingNavGuard('general')],
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
    SettingsGeneral
  }
}
</script>

<style>

</style>
