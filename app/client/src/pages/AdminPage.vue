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
Purpose:

  This is the page where the admin can manage projects, challenges, users,
  and settings.

Methods:

  Admin functionality is handled in child components. This page provides
  convenient routing tabs to navigate to child components.

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
          class="text-grey"
          align="justify"
          active-color="primary"
          indicator-color="primary"
          v-model="parentOption"
        >
          <q-route-tab
            no-caps exact
            icon="img:statics/images/projects-icon.png"
            label="Projects"
            to="/admin/console/manage-projects"
          />

          <q-route-tab
            no-caps
            v-if="layoutConfig && layoutConfig.challenges"
            icon="img:statics/images/challenge-icon1.png"
            label="Challenges"
            to="/admin/console/manage-challenges"
          />

          <q-route-tab
            no-caps
            label="Users"
            icon="person"
            to="/admin/console/manage-userqs"
          />

          <q-route-tab
            no-caps
            label="Settings"
            icon="settings"
            to="/admin/console/settings"
          />

        </q-tabs>
        <div class="q-pa-xs console-content-tab">
          <router-view></router-view>
        </div>
      </div>

      <q-inner-loading :showing="haltConsole">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
import { layoutConfig } from '../../boundless.config'


import NotFound from './Error404'

export default {
  components: {
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
