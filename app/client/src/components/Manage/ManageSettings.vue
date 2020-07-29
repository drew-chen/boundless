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

Name:     components/Manage/ManageSettings.vue
Purpose:

  Admin settings panel for in-depth configuration. General, database, challenge,
  and project options are presented here.

Methods:

  Functionality is provided by child components. This component provides
  navigation through routing tabs. In addition, this component sets up the
  props needed for the child components.

## -->

<template>

  <q-splitter
    disable
    class="console-content-tab"
    v-model="splitterModel"
  >
    <template v-slot:before>
      <q-tabs
        switch-indicator
        vertical inline-label stretch
        class="text-primary q-mr-sm ap-left-panel"
        indicator-color="secondary"
        active-color="secondary"
        v-model="optionTab"
      >
        <q-tab
          no-caps
          name="general" label="General"
          style="justify-content: left;"
        />
        <q-separator />
        <q-tab
          no-caps
          name="database" label="Database"
          style="justify-content: left;"
        />
        <q-separator />
        <q-tab
          v-if="layoutConfig && layoutConfig.challenges"
          no-caps
          name="challenges" label="Challenges"
          style="justify-content: left;"
        />
        <q-separator />

        <q-tab
          no-caps
          name="projects" label="Projects"
          style="justify-content: left;"
        />

      </q-tabs>

    </template>

    <template v-slot:after>
      <q-tab-panels v-model="optionTab">
        <!-- ---------- Managing Data from Database ---------- -->
        <q-tab-panel name="database">
          <div class="text-h4">
            Database
            <q-separator color="secondary" />
          </div>
          <div class="q-mb-sm q-ml-md">
            ({{ dbId }})
          </div>

          <q-page>
            <ManageDatabase
              @importingToDB="consoleLoading"
              @databaseId="loadDatabaseId"
            />

            <div
              class="q-px-sm q-mt-lg"
              :hidden="!layoutConfig.switchDatabase"
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
                v-model="db"
                @input="switchDatabase"
              />
            </div>
          </q-page>
        </q-tab-panel>

        <!-- ---------------- Challenge Settings ----------------- -->
        <q-tab-panel name="challenges">
          <div v-if="configs.challenges">
            <SettingsConfigPanel
              :keywords="configs.keywords"
              :type="'challenges'"
              :ratio="previewRatio"
              @submitting="consoleLoading"
              @submitted="loadChallengeConfig"
            />
          </div>
        </q-tab-panel>

        <!-- ----------------- Project Settings ------------------ -->
        <q-tab-panel name="projects">
          <div v-if="configs.projects">
            <SettingsConfigPanel
              :keywords="configs.keywords"
              :type="'projects'"
              :ratio="previewRatio"
              @submitting="consoleLoading"
              @submitted="loadProjectConfig"
            />
          </div>
        </q-tab-panel>
        <!-- Previously, there was commented out code regarding user settings.
        Code can be reffered to at this commit at 'Config.vue'.
        "commit 4ce535e8b372ec9d30792999da13c3e89f84ec1f
        Author: Htut <phyo.htut@windriver.com>
        Date:   Wed May 20 17:36:06 2020 -0700

            version 0.6.1 hotfix

            Signed-off-by: Htut <phyo.htut@windriver.com>
        " -->

        <!-- ------------------ System Settings ------------------ -->
        <q-tab-panel name="general">
          <div>
            <SystemSettings
              @usersConfigInfo="loadUserConfig"
              @challengesConfigInfo="loadChallengeConfig"
              @projectsConfigInfo="loadProjectConfig"
              @keywords="loadKeywords"
              @submitting="consoleLoading"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>

  </q-splitter>
</template>

<script>
import { layoutConfig } from '../../boundless.config'

import SystemSettings from '../components/SystemSettings'
import ManageDatabase from '../components/GetDataFromFirestore'
import SettingsConfigPanel from '../components/SettingPanels/Config'
// import SettingsUsersPanel from '../components/SettingPanels/Users'

export default {
  components: {
    SystemSettings,
    ManageDatabase,
    SettingsConfigPanel
    // SettingsUsersPanel,
  },
  created () {
    // TODO: handle inside routes
    // route guarding for the component
    if (this.$q.sessionStorage.has('admin_token')) {
      this.notFound = false
    } else {
      this.notFound = true
    }

    if (this.notFound) {
      setTimeout(() => {
        this.$router.replace('/')
      }, 1500)
    } else {
      if (this.$q.localStorage.has('boundless_db')) {
        this.db = this.$q.localStorage.getItem('boundless_db')
      }

      if (this.$q.sessionStorage.getItem('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
        this.layoutConfig = layoutConfig

        if (typeof cachedConfig.enabledChallenges === 'boolean') {
          this.layoutConfig.challenges = cachedConfig.enabledChallenges
        }
      } else {
        this.layoutConfig = layoutConfig
      }
    }
  },
  data () {
    return {
      notFound: false, // <Boolean>: flag for 404
      layoutConfig: null, // <Object>: dictionary of layout values
      optionTab: 'general', // <String>: name of the option tab
      splitterModel: 15, // <Number>: % of vw that left splitter is located
      db: null, // <String>: name of the database
      dbId: null, // <String>: project id of the firebase cred
      parentOption: 'projects', // <String>: name of the parent tab
      previewRatio: '5', // <String>: ratio for preview of imges in child
      configs: { // <Object<Object>>: configuration records of all collections
        users: {}, // <Object>: configuration record for users
        projects: {}, // <Object>: configuration record for projects
        challenges: {}, // <Object>: configuration record for challenges
        keywords: {} // <Object>: dictionary containing keywords
      },
      haltConsole: false // <Boolean>: flag for loading animation
    }
  },
  methods: {
    consoleLoading: function (loadVal) {
      /**
       * handle page loading via child event
       * @param {Boolean} loadVal: event emitter value to render loading
       * @return {void}
       */

      this.haltConsole = loadVal

      if (!loadVal) {
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')
        if (typeof storedConfig.enabledChallenges === 'boolean') {
          this.layoutConfig.challenges = storedConfig.enabledChallenges
        }

        if (
          storedConfig.wikiInfo &&
          typeof storedConfig.wikiInfo.name === 'string'
        ) {
          this.layoutConfig.homeName = storedConfig.wikiInfo.name
          this.layoutConfig.homeURL = storedConfig.wikiInfo.url || ''
        }
      }
    },
    loadDatabaseId: function (databaseId) {
      /**
       * handle page loading via child event
       * @param {Boolean} loadVal: event emitter value to render loading
       * @return {void}
       */

      this.dbId = databaseId
    },
    loadKeywords: function (val) {
      /**
       * load keywords from the child component and convert to
       * map to assign as one of the object inside this.configs var
       * @param {Object} val: event emitter value containing keywords
       *                      from database
       * @return {void}
       */

      if (val) {
        this.configs.keywords = {}

        for (let key in val) {
          this.configs.keywords[key] = val[key]
        }
      }
    },
    loadProjectConfig: function (val) {
      /**
       * load project configuartion from the child component and
       * assign as one of the object inside this.configs var
       * @param {Object} val: event emitter value containing
       *                      database information
       * @return {void}
       */

      if (val) {
        this.configs.projects = val
      }
    },
    loadChallengeConfig: function (val) {
      /**
       * load challenge configuartion from the child component and
       * assign as one of the object inside this.configs var
       * @param {Object} val: event emitter value containing
       *                      database information
       * @return {void}
       */

      if (val) {
        this.configs.challenges = val
      }
    },
    loadUserConfig: function (val) {
      /**
       * load user configuartion from the child component and assign
       * as one of the object inside this.configs var
       * @param {Object} val: event emitter value contating database information
       * @return {void}
       */

      if (val) {
        val.list = val.list.sort(
          (a, b) => a.value < b.value ? -1 : 1
        )

        this.configs.users.socialNetwork = val
      }
    },
    switchDatabase: function () {
      /**
       * switch database namespace and reload the page
       * @param {void}
       * @return {void}
       */

      this.$q.localStorage.set('boundless_db', this.db)

      if (this.$q.sessionStorage.has('boundless_timeout')) {
        this.$q.sessionStorage.remove('boundless_timeout')
        this.$q.sessionStorage.remove('boundless_config')
      }

      this.$router.go()
    }
  }
}
</script>

<style lang="stylus" scoped>
// console-page page loadout

body {
  max-height: 50px
}

.console-page {
  min-width: 800px;
  max-width: 98%;
  margin: auto;
}

// left-tab loadout
.console-content-tab {
  border-radius: 3px;
  overflow: hidden;
}

.ap-left-panel {
  border: solid $grey-5 1px;
  border-radius: 3px;
}
</style>
