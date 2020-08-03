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
    <q-inner-loading :showing="haltConsole">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
</div>
</template>

<script>
import { layoutConfig } from '../../../../client/boundless.config'

export default {
  created () {
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
  },
  directives: {
    focus: {
      /**
       * Custom directive to control tab focusing. This is needed to override
       * the focus based on route pathing. When navigating away and
       * pressing "cancel" on a confirm leave dialog, the cancelled
       * navigation will no longer cause a wrong tab focus.
       *
       * @param <Object>: el The element the directive is bound to. This can be used to directly manipulate the DOM.
       * @param <Object>: binding An object containg the 'arg' property. 'arg'
       *  is the argument passed to the directive, if any. For example in
       *  v-my-directive:foo, the arg would be "foo".
       * @param <Object>: vnode The virtual node produced by Vue’s compiler.
       *  The 'context' property provides this component's 'this'.
       */
      update (el, binding, vnode) {
        el.blur()
        if (binding.args === vnode.context.tabSelected) {
          console.log(binding.args, vnode.context.tabSelected)
          el.blur()
        } else {
          el.blur()
        }
      }
    }
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
     * here instead of through the router. 'this' is explicitly binded
     * to make sure each callback acts as if it was called in
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
            to render while switching to another route.
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
            db: this.db,
            switchDatabase: this.switchDatabase.bind(this)
          }
        case 'projects':
          return {
            name: 'projects',
            keywords: this.configs.keywords,
            previewRatio: this.previewRatio,
            consoleLoading: this.consoleLoading.bind(this),
            setProjectConfig: this.setProjectConfig.bind(this)
          }
        case 'challenges':
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
      // <String>: The path of this component and the parent path of child routes.
      basePath: '/admin/console/settings'
    }
  },
  methods: {
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
