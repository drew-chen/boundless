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

Name:     components/Manage/Settings/SettingsDatabase.vue
Purpose:  Manage database settings and guard navigation.
Methods:

  This component wraps around 'GetDataFromFirestore.vue', where most of the
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
      <get-data-from-firestore
        @importingToDB="settingProps.consoleLoading"
        @databaseId="settingProps.setDatabaseId"
        ref="getDataFromFirestore"
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
import GetDataFromFirestore from './Components/GetDataFromFirestore.vue'

export default {
  props: {
    // Object containing all custom props. See structure in 'ManageSettings.vue'.
    settingProps: {
      type: Object,
      required: true
    }
  },
  /**
   * Block leaving with persistent dialog if files have been uploaded but not
   * imported.
   * View specifics on navigation guards at:
   * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
   *
   * @param {Object} to The target Route Object being navigated to.
   * @param {Object} from The current route being navigated away from.
   * @param {Function} next This function must be called to resolve the hook.
   */
  beforeRouteLeave (to, from, next) {
    if (this.settingProps.name === 'database') {
      this.$refs.getDataFromFirestore.openConfirmLeaveDialog(next)
    } else {
      next()
    }
  },
  components: {
    GetDataFromFirestore
  }
}
</script>

<style>

</style>
