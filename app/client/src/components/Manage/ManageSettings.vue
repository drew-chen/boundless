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

  <div>
    <q-splitter
      disable
      class="console-content-tab"
      v-model="splitterModel"
    >
      <template v-slot:before>
        <q-tabs
          switch-indicator vertical inline-label stretch
          class="text-primary q-mr-sm ap-left-panel"
          indicator-color="secondary"
          active-color="secondary"
        >
          <q-route-tab
            no-caps exact
            label="General"
            name="general"
            :to="`${basePath}/general`"
          />
          <q-separator />
          <q-route-tab
            no-caps exact
            label="Database"
            name="database"
            :to="`${basePath}/database`"
          />
          <q-separator />
          <q-route-tab
            no-caps exact
            label="Projects"
            name="projects"
            :to="`${basePath}/projects`"
          />
          <q-separator />
          <q-route-tab
            no-caps exact
            v-if="layoutConfig && layoutConfig.challenges"
            label="Challenges"
            name="challenges"
            :to="`${basePath}/challenges`"
          />

        </q-tabs>

      </template>
      <template v-slot:after>
        <q-tab-panel :name="tabSelected">
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            appear
            :duration="160"
          >
            <keep-alive>
              <!-- See ./Settings directory for components. -->
              <router-view
                :settingProps="settingProps"
              >
              </router-view>
            </keep-alive>
          </transition>
        </q-tab-panel>
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
    <q-inner-loading :showing="haltConsole" />
</div>
</template>

<script>
import { layoutConfig } from '../../../../client/boundless.config'
import productionDb, { productionStorage } from '../../firebase/init_production'
import testingDb, { testingStorage } from '../../firebase/init_testing'

export default {
  async created () {
    this.dataLoaded = false
    if (this.$q.localStorage.has('boundless_db')) {
      this.dbName = this.$q.localStorage.getItem('boundless_db')
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
    // TODO: Put this in the appropriate vuex module.
    await this.loadFireRefs()
    await this.loadInformation()
    this.dataLoaded = true
  },
  computed: {
    /**
     * Returns the name of the tab selected by slicing off the path of this
     * component from the url. The + 1 is needed to also slice off the
     * '/' before the child path.
     */
    tabSelected () {
      return this.$route.path.slice(this.basePath.length + 1)
    },
    /**
     * Each router-view needs different props. Some of these props interact
     * with the data in 'ManageSettings.vue' which is why they are passed in
     * here instead of through the router. 'this' is explicitly bound
     * to be safe and make sure each callback acts as if it was called in
     * 'ManageSettings.vue' instead of in a child component.
     *
     * @param <String>: The value of 'tabSelected'.
     * @returns <Object> An object where each property is a prop.
     */
    settingProps () {
      switch (this.tabSelected) {
        case 'general':
          return {
            /*
            The 'name' property is important so that the router view doesn't try
            to render while switching to another route. If the name does not
            match, the router-view will not be rendered.
            */
            name: 'general',
            setUserConfig: this.setUserConfig.bind(this),
            setChallengeConfig: this.setChallengeConfig.bind(this),
            setProjectConfig: this.setProjectConfig.bind(this),
            setKeywords: this.setKeywords.bind(this),
            consoleLoading: this.consoleLoading.bind(this)
          }
        case 'database':
          return {
            name: 'database',
            dbId: this.dbId,
            consoleLoading: this.consoleLoading.bind(this),
            setDatabaseId: this.setDatabaseId.bind(this),
            hideDatabaseSwitch: !this.layoutConfig.switchDatabase,
            dbName: this.dbName,
            switchDatabase: this.switchDatabase.bind(this)
          }
        case 'projects':
          if (!this.dataLoaded) {
            return {
              name: 'notLoaded'
            }
          }
          return {
            name: 'projects',
            keywords: this.configs.keywords,
            previewRatio: this.previewRatio,
            consoleLoading: this.consoleLoading.bind(this),
            setProjectConfig: this.setProjectConfig.bind(this)
          }
        case 'challenges':
          if (!this.dataLoaded) {
            return {
              name: 'notLoaded'
            }
          }
          return {
            name: 'challenges',
            keywords: this.configs.keywords,
            previewRatio: this.previewRatio,
            consoleLoading: this.consoleLoading.bind(this),
            setChallengeConfig: this.setChallengeConfig.bind(this)
          }
        default:
          return {}
      }
    }
  },
  data () {
    return {
      layoutConfig: null, // <Object>: dictionary of layout values
      splitterModel: 15, // <Number>: % of vw that left splitter is located
      dbName: '', // <String>: name of the database
      dbId: '', // <String>: project id of the firebase cred
      previewRatio: '5', // <String>: ratio for preview of imges in child
      configs: { // <Object<Object>>: configuration records of all collections
        users: {}, // <Object>: configuration record for users
        projects: {}, // <Object>: configuration record for projects
        challenges: {}, // <Object>: configuration record for challenges
        keywords: {} // <Object>: dictionary containing keywords
      },
      haltConsole: false, // <Boolean>: flag for loading animation
      // <String>: The path of this component and the parent path of child routes.
      basePath: '/admin/console/settings',
      // -- The following are variables which should be moved into vuex. --
      db: null,
      storage: null,
      data: {},
      dataLoaded: false

    }
  },
  methods: {
    // TODO: move into a new vuex module dedicated to settings.
    loadFireRefs: async function () {
      /**
       * load firebase database reference
       * load firebase storage reference (if applicable)
       * load firebase cloud functions reference (if applicable)
       * @param {void}
       * @return {Promise<Boolean>}
       */

      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')

        if (sessionDb === 'testing') {
          this.db = testingDb
          this.storage = testingStorage
        } else {
          this.db = productionDb
          this.storage = productionStorage
        }

        return true
      } else {
        try {
          let doc = await productionDb.collection('config').doc('project').get()

          if (doc.exists) {
            if (doc.data().db === 'testing') {
              this.db = testingDb
              this.$q.localStorage.set('boundless_db', 'testing')
            } else {
              this.db = productionDb
              this.$q.localStorage.set('boundless_db', 'production')
            }

            return true
          } else {
            let msg = '"/config/project" path does not exists!'

            throw new Error(msg)
          }
        } catch (error) {
          this.db = productionDb
          this.$q.localStorage.set('boundless_db', 'production')

          throw error
        }
      }
    },
    // TODO: move into a new vuex module dedicated to settings.
    loadInformation: async function () {
      /**
       * load information from config/project of the database
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection('config').doc('project').get()

        if (doc.exists) {
          this.data = doc.data()

          this.data.enabledChallenges = this.data.enabledChallenges || false

          let leftImg = {
            url: '',
            active: false,
            visible: true
          }
          // dealing with about logo to bind with 'Edit About Page'
          if (!this.data.generalConfig) {
            this.data.generalConfig = { leftImg }
          } else {
            let ssRef = this.$q.sessionStorage
            let storedConfig = ssRef.getItem('boundless_config')

            if (!storedConfig.generalConfig.leftImg) {
              this.data.generalConfig = {
                ...storedConfig.generalConfig,
                leftImg
              }
            } else if (
              storedConfig.generalConfig.leftImg.visible === undefined
            ) {
              this.data.generalConfig = { ...storedConfig.generalConfig }

              this.data.generalConfig.leftImg.visible = true
            }
          }

          // dealing with 'Wiki URL'
          if (!this.data.wikiInfo) {
            this.data.wikiInfo = {
              name: '',
              url: ''
            }
          }

          // TODO: take these out once the functions are done
          delete this.data.db
          delete this.data.config_version
          delete this.data.suggestedKeywords
          // delete this.data.keywords
          delete this.data.chipContentType
          delete this.data.bodyContentType
          delete this.data.allowedDomain

          this.setUserConfig(this.data.socialNetwork)
          this.setChallengeConfig(this.data.challengesConfig)
          this.setProjectConfig(this.data.projectsConfig)
          this.setKeywords(this.data.keywords)

          delete this.data.socialNetwork
          delete this.data.challengesConfig
          delete this.data.projectsConfig

          // sort data via key
          this.data = Object.fromEntries(Object.entries(this.data).sort())
          // sort data.keywords via key
          this.data.keywords = Object.fromEntries(
            Object.entries(this.data.keywords).sort()
          )
        } else {
          throw new Error('Config file does not exists in the database!')
        }

        return true
      } catch (error) {
        throw error
      }
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
     * Set project configuration from the child component and
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
     * Set challenge configuration from the child component and
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
     * Set user configuration from the child component and assign
     * as one of the object inside this.configs var.
     * @param {Object} val: Event emitter value containing database information.
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
      this.$q.localStorage.set('boundless_db', this.dbName)

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

// Affects .q-route-tab
.q-tab
  justify-content: left

// left-tab loadout
.console-content-tab
  border-radius: 3px
  overflow: hidden

.ap-left-panel
  border: solid $grey-5 1px
  border-radius: 3px

</style>
