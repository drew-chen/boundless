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

Name:     pages/AdminPage.vue
Purpose:  Provide graphical user interface for the admin to manage application.
Methods:

  Provide general settings interface for the admin.
  Provide user settings interface for the admin.
  Provide project settings interface for the admin.
  Provide challange settings interface for the admin.

## -->

<template>
  <!-- -------------------- Error 404 -------------------- -->
  <NotFound v-if="notFound" />

  <!-- -------------------- Admin Page Content -------------------- -->
  <q-page v-else class="q-pa-sm q-mt-md">
    <q-card class="q-pa-md console-page">
      <!-- -------------------- Page Header -------------------- -->
      <div>
        <p align="center" style="font-size: 18px;" >
          <strong>Admin Console</strong>
        </p>
        <q-separator class="q-mb-sm" color="secondary" />
      </div>

      <!-- -------------------- Content Tabs -------------------- -->
      <div>
        <q-tabs
          dense inline-label
          class="text-grey" align="justify"
          active-color="primary" indicator-color="primary"
          v-model="parentOption"
        >
          <q-tab
            no-caps icon="img:statics/images/projects-icon.png"
            name="projects" label="Projects"
          >
          </q-tab>

          <q-tab
            v-if="layoutConfig && layoutConfig.challenges"
            no-caps icon="img:statics/images/challenge-icon1.png"
            name="challenges" label="Challenges"
          />

          <q-tab no-caps name="users" label="Users" icon="person"/>

          <q-tab no-caps name="systems" label="Settings" icon="settings"/>
        </q-tabs>

        <!-- -------------------- Tab Content -------------------- -->
        <q-tab-panels
          v-model="parentOption"
          keep-alive animated
          transition-next="fade" transition-prev="fade"
        >
          <!-- -------------------- Project Tab Content -------------------- -->
          <q-tab-panel name="projects">
            <div class="q-pa-xs console-content-tab">
              <ManageProjects />
            </div>
          </q-tab-panel>

          <!-- ------------------- Challenge Tab Content ------------------- -->
          <q-tab-panel
            v-if="layoutConfig && layoutConfig.challenges"
            name="challenges"
          >
            <div class="q-pa-xs console-content-tab">
              <ManageChallenges />
            </div>
          </q-tab-panel>

          <!-- -------------------- Users Tab Content -------------------- -->
          <q-tab-panel name="users">
            <div class="q-pa-xs console-content-tab">
              <ManageUsers />
            </div>
          </q-tab-panel>

          <!-- ------------------- Settings Tab Content -------------------- -->
          <q-tab-panel name="systems">
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
                    <!-- icon="person" -->

                  <q-separator />

                  <q-tab
                    no-caps
                    name="database" label="Database"
                    style="justify-content: left;"
                  />
                    <!-- icon="person" -->

                  <q-separator />

                  <q-tab
                    v-if="layoutConfig && layoutConfig.challenges"
                    no-caps
                    name="challenges" label="Challenges"
                    style="justify-content: left;"
                  />
                    <!-- icon="img:statics/images/challenge-icon1.png" -->

                  <q-separator />

                  <q-tab
                    no-caps
                    name="projects" label="Projects"
                    style="justify-content: left;"
                  />
                    <!-- icon="img:statics/images/projects-icon.png" -->

                  <!-- <q-separator /> -->

                  <!-- TODO: Pruning users out for Feb release -->
                  <!-- <q-tab
                    v-if="configs.users"
                    no-caps
                    class="q-ml-xs" name="users" label="Users"
                    style="justify-content: left;"
                  /> -->
                    <!-- icon="person" -->

                  <!-- <q-separator /> -->

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

                  <!-- TODO: Pruning users out for Feb release -->
                  <!-- ------------------- User Settings ------------------- -->
                  <!-- <q-tab-panel name="users">
                    <div v-if="configs.users">
                      <div class="text-h4 q-mb-md">
                        Users
                        <q-separator color="secondary" />
                      </div>

                      <div>
                        <div
                          v-if="configs.users.socialNetwork !== undefined" class="q-pa-lg"
                        >
                          <label for="socialNetworks" class="text-h6">
                            Social Networks:
                          </label>

                          <q-option-group
                            inline id="socialNetworks"
                            color="primary" type="checkbox"
                            :options="configs.users.socialNetwork.list"
                            v-model="configs.users.socialNetwork.use"
                          />

                          <div class="q-py-md">
                            <q-btn no-caps color="secondary" label="Submit" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-tab-panel> -->

                  <!-- ------------------ System Settings ------------------ -->
                  <q-tab-panel name="general">
                    <!-- <div class="text-h4 q-mb-md">
                      General {{
                        $q.sessionStorage.has('boundless_config')
                        ? ($q.sessionStorage.getItem(
                          'boundless_config'
                        ).config_version
                        ? `(v ${$q.sessionStorage.getItem(
                          'boundless_config'
                        ).config_version})` : '')
                        : ''
                      }}
                      <q-separator color="secondary" />
                    </div> -->

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
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <q-inner-loading :showing="haltConsole">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
import { layoutConfig } from '../../boundless.config'

import ManageProjects from '../components/Manage/ManageProject'
import ManageChallenges from '../components/Manage/ManageChallenge'
import ManageUsers from '../components/Manage/ManageUser'

import SystemSettings from '../components/SystemSettings'
import ManageDatabase from '../components/GetDataFromFirestore'
import SettingsConfigPanel from '../components/SettingPanels/Config'
// import SettingsUsersPanel from '../components/SettingPanels/Users'

import NotFound from './Error404'

export default {
  components: {
    ManageProjects,
    ManageChallenges,
    ManageUsers,
    SystemSettings,
    ManageDatabase,
    SettingsConfigPanel,
    // SettingsUsersPanel,
    NotFound
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
    /**
     * Handle page loading via child event.
     * @param {Boolean} loadVal: Event emitter value to render loading.
     */
    consoleLoading: function (loadVal) {
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
    /**
     * Handle page loading via child event.
     * @param {String} databaseId: Project id of the firebase cred.
     */
    loadDatabaseId: function (databaseId) {
      this.dbId = databaseId
    },
    /**
     * Load keywords from the child component and convert to
     * map to assign as one of the object inside this.configs var
     * @param {Object} val: Event emitter value containing keywords
     *  from database.
     */
    loadKeywords: function (val) {
      if (val) {
        this.configs.keywords = {}

        for (let key in val) {
          this.configs.keywords[key] = val[key]
        }
      }
    },
    /**
     * Load project configuartion from the child component and
     * assign as one of the object inside this.configs var.
     * @param {Object} val: Event emitter value containing
     *  database information.
     */
    loadProjectConfig: function (val) {
      if (val) {
        this.configs.projects = val
      }
    },
    /**
     * Load challenge configuartion from the child component and
     * assign as one of the object inside this.configs var
     * @param {Object} val: Event emitter value containing
     *                      database information.
     */
    loadChallengeConfig: function (val) {
      if (val) {
        this.configs.challenges = val
      }
    },
    /**
     * Load user configuartion from the child component and assign
     * as one of the object inside this.configs var.
     * @param {Object} val: Event emitter value contating database information.
     */
    loadUserConfig: function (val) {
      if (val) {
        val.list = val.list.sort(
          (a, b) => a.value < b.value ? -1 : 1
        )
        this.configs.users.socialNetwork = val
      }
    },
    /**
     * Switch database namespace and reload the page.
     */
    switchDatabase: function () {
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
