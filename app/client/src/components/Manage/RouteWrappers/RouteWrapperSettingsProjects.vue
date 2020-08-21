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

  This component wraps around 'SettingsProjectsAndChallenges.vue', where most of
  the actual functionality is located. This wrapping is needed so that
  'ManageSettings.vue' can pass different props and listen to different events
  depending on the route.

## -->

<template>
  <settings-projects-and-challenges
    v-if="settingProps.name === 'projects'"
    :keywords="settingProps.keywords"
    type="projects"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.setProjectConfig"
    ref="settings"
  />
</template>

<script>
import SettingsProjectsAndChallenges from '../Settings/SettingsProjectsAndChallenges'
import mixinSettingNavGuard from '../../../mixins/mixinSettingNavGuard'

export default {
  mixins: [mixinSettingNavGuard('projects')],
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
  }
}
</script>

<style>

</style>
