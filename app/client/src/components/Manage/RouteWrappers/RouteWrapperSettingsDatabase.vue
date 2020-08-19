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

Name:     components/Manage/RouteWrapper/RouteWrapperSettingsDatabase.vue
Purpose:  Manage database settings and guard navigation.
Methods:

  This component wraps around 'SettingsDatabase.vue', where most of the
  actual functionality is located. This wrapping is needed so that
  'ManageSettings.vue' can pass different props and listen to different events
  depending on the route.

  Unlike other settings, there is no explicit "save" button. "unsaved changes"
  here means uploading a file to import to the database and not importing.

## -->

<template>
  <div
    v-if="settingProps.name === 'database'"
  >
    <div class="text-h4">
      Database
      <q-separator color="secondary" />
    </div>
    <div class="q-mb-sm q-ml-md">
      ({{ settingProps.dbId }})
    </div>
    <q-page>
      <settings-database
        @importingToDB="settingProps.consoleLoading"
        @databaseId="settingProps.setDatabaseId"
        ref="settings"
      />
      <div
        class="q-px-sm q-mt-lg"
        :hidden="settingProps.hideDatabaseSwitch"
      >
        <div class="q-pb-sm">
          <b class="text-h6">Switch Database</b>
          <q-separator color="secondary" />
        </div>
        <q-btn-toggle
          push no-caps
          toggle-color="positive"
          :options="[
            {label: 'Primary', value: 'production'},
            {label: 'Test', value: 'testing'}
          ]"
          :value="settingProps.dbName"
          @input="settingProps.switchDatabase"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import SettingsDatabase from '../Settings/SettingsDatabase.vue'
import mixinSettingNavGuard from '../../../mixins/mixinSettingNavGuard'

export default {
  mixins: [mixinSettingNavGuard('database')],
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
    SettingsDatabase
  }
}
</script>

<style>

</style>
