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
        switch-indicator vertical inline-label stretch
        v-model="tabSelected"
        class="text-primary q-mr-sm ap-left-panel"
        indicator-color="secondary"
        active-color="secondary"
      >
        <q-tab
          no-caps exact
          @click="navigateTo('general')"
          label="General"
          name="general"
          style="justify-content: left;"
        />
        <q-separator />
        <q-tab
          no-caps exact
          @click="navigateTo('database')"
          label="Database"
          name="database"
          style="justify-content: left;"
        />
        <q-separator />
        <q-tab
          no-caps exact
          @click="navigateTo('projects')"
          label="Projects"
          name="projects"
          style="justify-content: left;"
        />
        <q-separator />
        <q-tab
          no-caps exact
          @click="navigateTo('challenges')"
          v-if="layoutConfig && layoutConfig.challenges"
          label="Challenges"
          name="challenges"
          style="justify-content: left;"
        />

      </q-tabs>

    </template>
      <template v-slot:after>
        <keep-alive>
          <q-tab-panel :name="tabSelected">
            <!-- See ./Settings directory for components. -->
            <router-view :settingProps="settingProps"></router-view>
          </q-tab-panel>
        </keep-alive>
      </template>

      <!-- Previously, there was commented out code regarding user settings.
      Code can be reffered to at this commit at 'Config.vue'.
      "commit 4ce535e8b372ec9d30792999da13c3e89f84ec1f
      Author: Htut <phyo.htut@windriver.com>
      Date:   Wed May 20 17:36:06 2020 -0700

          version 0.6.1 hotfix

          Signed-off-by: Htut <phyo.htut@windriver.com>
      " -->
  </q-splitter>
</template>

<script>
import { layoutConfig } from '../../../../client/boundless.config'

export default {
  created () {
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
    this.navigateTo('general')
  },
  data () {
    return {
      tabSelected: 'general', // <String>: The selected settings panel.
      notFound: false, // <Boolean>: flag for 404
      layoutConfig: null, // <Object>: dictionary of layout values
      splitterModel: 15, // <Number>: % of vw that left splitter is located
      db: '', // <String>: name of the database
      dbId: '', // <String>: project id of the firebase cred
      previewRatio: '5', // <String>: ratio for preview of imges in child
      configs: { // <Object<Object>>: configuration records of all collections
        users: {}, // <Object>: configuration record for users
        projects: {}, // <Object>: configuration record for projects
        challenges: {}, // <Object>: configuration record for challenges
        keywords: {} // <Object>: dictionary containing keywords
      },
      haltConsole: false, // <Boolean>: flag for loading animation
      settingProps: {}
    }
  },
  methods: {
    /**
     * Each router-view needs different props. Some of these props interact
     * with the data in 'ManageSettings.vue' which is why they are passed in
     * here instead of through the router.
     *
     * @returns <Object> An object where each property is a prop.
     */
    navigateTo (value) {
      console.log(value)
      this.tabSelected = value
      let props = {}
      switch (this.tabSelected) {
        case 'general':
          props = {
            name: 'general',
            setUserConfig: this.setUserConfig,
            setChallengeConfig: this.setChallengeConfig,
            setProjectConfig: this.setProjectConfig,
            setKeywords: this.setKeywords,
            consoleLoading: this.consoleLoading
          }
          break
        case 'database':
          props = {
            name: 'database',
            dbId: this.dbId,
            consoleLoading: this.consoleLoading,
            setDatabaseId: this.setDatabaseId,
            hideDatabaseSwitch: !this.layoutConfig.switchDatabase,
            db: this.db,
            switchDatabase: this.switchDatabase
          }
          break
        case 'projects':
          props = {
            name: 'projects',
            keywords: this.configs.keywords,
            previewRatio: this.previewRatio,
            consoleLoading: this.consoleLoading,
            setProjectConfig: this.setProjectConfig
          }
          props.name = 'projects'
          break
        case 'challenges':
          props = {
            name: 'challenges',
            keywords: this.configs.keywords,
            previewRatio: this.previewRatio,
            consoleLoading: this.consoleLoading,
            setChallengeConfig: this.setChallengeConfig
          }
          props.name = 'challenges'
          break
      }
      this.settingProps = props
      this.$router.push(`/admin/console/settings/${this.tabSelected}`)
    },
    /**
     * Handle page loading via child event.
     * @param {Boolean} loadVal: event emitter value to render loading
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
     * Sets the database id.
     * @param {Boolean} databaseId: Event emitter value to render loading.
     */
    setDatabaseId: function (databaseId) {
      this.dbId = databaseId
    },
    /**
     * Set keywords from the child component and convert to
     * map to assign as one of the object inside this.configs var.
     * @param {Object} val: Event emitter value containing keywords
     *                      from database.
     */
    setKeywords: function (val) {
      if (val) {
        this.configs.keywords = {}

        for (let key in val) {
          this.configs.keywords[key] = val[key]
        }
      }
    },
    /**
     * Set project configuartion from the child component and
     * assign as one of the object inside this.configs var.
     * @param {Object} val: Event emitter value containing
     *                      database information.
     */
    setProjectConfig: function (val) {
      if (val) {
        this.configs.projects = val
      }
    },
    /**
     * Set challenge configuartion from the child component and
     * assign as one of the object inside this.configs var.
     * @param {Object} val: Event emitter value containing
     *                      database information.
     */
    setChallengeConfig: function (val) {
      if (val) {
        this.configs.challenges = val
      }
    },
    /**
     * Set user configuartion from the child component and assign
     * as one of the object inside this.configs var.
     * @param {Object} val: Event emitter value contating database information.
     */
    setUserConfig: function (val) {
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
