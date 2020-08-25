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

Name:     layouts/BoundlessLayout.vue
Purpose:  Define the standard layout of the application on every page.
          For example, menus, logos, and navigation bar borders.
Methods:
  * Define navigation menu
  * Admin log in/out
  * Header/Footer

## -->

<template>
  <q-layout view="hHh lpR fff">

    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="routeHomeURL" >
          <div class="row">
            <q-toolbar class="col">
              <q-icon class="q-mr-sm" name="home" />

              <span v-if="layoutConfig && layoutConfig.homeName">
                Home ({{ layoutConfig.homeName }})
              </span>

              <span v-else>
                Home
              </span>
            </q-toolbar>

            <q-toolbar
              v-if="
                $q.localStorage.has('boundless_db') &&
                $q.localStorage.getItem('boundless_db') === 'testing'
              "
              class="col-2"
            >
              <q-space/>

              <q-img
                contain
                src="../statics/images/testing-db-icon.png"
                :ratio="4/1"
              />

              <q-space/>
            </q-toolbar>
          </div>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs
        no-caps
        class="text-secondary shadow-1"
        align="left" style="background: #F5F5F5;"
      >
        <q-route-tab
          to="/"
          label="About"
        />
        <q-route-tab
          to="/project/display"
          label="Projects"
        />
        <q-route-tab
          to="/project/add"
          label="Add Project"
        />
        <q-route-tab
          v-if="layoutConfig && layoutConfig.challenges"
          to="/challenge/display"
          label="Challenges"
        />
        <q-route-tab
          v-if="layoutConfig && layoutConfig.challenges"
          to="/challenge/add"
          label="Add Challenge"
        />
        <q-route-tab
          v-if="layoutConfig && layoutConfig.hairCut"
          to="/haircut"
          icon="fas fa-cut"
        />
        <q-route-tab
          v-if="$q.sessionStorage.has('admin_token')"
          to="/admin"
          label="Admin"
        />
        <q-space />
        <q-tab
          :label="
            $q.sessionStorage.has('admin_token') ? 'Log Out' : 'Admin Log In'
          "
          @click="logInLogOut"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      class="bg-primary">
      <div class="row" style="width: 98%; margin: 0 auto;">
        <div class="q-pa-md">
          <div class="text-white" style="font-size: 1.5em;">
            <div v-if="layoutConfig && layoutConfig.companyName" >
              Boundless Innovation @ {{ layoutConfig.companyName }}
            </div>

            <div v-else>
              Boundless Innovation
            </div>
          </div>

          <!-- <i
            class="text-weight-thin text-grey-5"
            style="font-size: .9em;"
          >
            Copyright © 2019 Wind River Systems, Inc.
          </i> -->
        </div>

        <q-space />

        <div class="q-pa-md" align="center">
          <div
            class="text-white cursor-pointer"
            @click="routeTo('/notices')"
          >
            Notices
          </div>
        </div>

        <!-- <div class="q-pa-md" align="center">
          <div class="text-white cursor-pointer" @click="routeTo('rootAbout')">
            About Us
          </div>
        </div> -->

        <div class="q-pa-md" align="center">
          <div class="text-white">
            Follow Us On
          </div>

          <div>
            <q-icon
              class="cursor-pointer" color="white"
              name="fab fa-github-square" size="2rem"
              @click="goTo('https://www.github.com')"
            />

            <!-- <q-icon
              class="cursor-pointer" color="white"
              name="fab fa-facebook-square" size="2rem"
              @click="goTo('https://www.facebook.com')"
            />

            <q-icon
              class="cursor-pointer" color="white"
              name="fab fa-instagram" size="2rem"
              @click="goTo('https://www.instagram.com/')"
            />

            <q-icon
              class="cursor-pointer" color="white"
              name="fab fa-twitter-square" size="2rem"
              @click="goTo('https://twitter.com/')"
            /> -->
          </div>
        </div>

      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import sha256 from 'sha256'

import {
  layoutConfig, dbMeta, configSkeleton
} from '../../boundless.config'

export default {
  async created () {
    // cookie manager to maintain log in sessions
    this.cookieCheck()

    // setting window var to login on focus
    // TODO: explain more
    window.onfocus = this.cookieCheck

    try {
      // loading required data from the database
      await this.loadFireRefs()
      // TODO: short description
      if (
        !this.$q.sessionStorage.has('boundless_config') ||
        this.$q.sessionStorage.getItem('boundless_timeout') < Date.now()
      ) {
        this.loadConfig()
      } else {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

        this.loadChallengeFlag(cachedConfig)
      }

      if (!this.layoutConfig.switchDatabase) {
        this.$q.localStorage.set('boundless_db', 'production')
      }
    } catch (error) {
      throw error
    }
  },
  beforeUpdate () {
    // fetch loadConfig once per every 5 mins
    if (this.$q.sessionStorage.getItem('boundless_timeout') < Date.now()) {
      this.loadConfig()
    }
  },
  data () {
    return {
      // TODO: describe their functions inside the vue component
      db: null,
      layoutConfig: null
    }
  },
  methods: {
    routeTo: function (path) {
      /**
       * helper function for route pushing
       * @param {String} path: path to be pushed
       * @return {void}
       */

      this.$router.push(path).catch(() => false)
    },
    goTo: function (path) {
      /**
       * helper function for page to href to path
       * @param {String} path: path to be pushed
       * @return {void}
       */

      location.href = path
    },
    loadChallengeFlag: function (config) {
      /**
       * helper function to check if challenge is enabled or not
       * @param {Object} config: record containing the flag for challenge
       * @return {void}
       */

      this.layoutConfig = layoutConfig

      if (typeof config.enabledChallenges === 'boolean') {
        this.layoutConfig.challenges = config.enabledChallenges
      }

      if (config.wikiInfo && config.wikiInfo.name) {
        this.layoutConfig.homeName = config.wikiInfo.name
        this.layoutConfig.homeURL = config.wikiInfo.url || ''
      }
    },
    loadFireRefs: async function () {
      /**
       * load firebase database reference
       * load firebase storage reference (if applicable)
       * load firebase cloud functions reference (if applicable)
       * @return {Promise<Boolean>}
       */

      if (this.$q.localStorage.has('boundless_db')) {
        // TODO: add description
        let sessionDb = this.$q.localStorage.getItem('boundless_db')

        // loading firebase references
        if (sessionDb === 'testing') {
          this.db = testingDb
        } else {
          this.db = productionDb
        }

        return true
      } else {
        try {
          // loading the firebase references from the database and save
          // into cache for later usages
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
            let msg = '"/config/project" path does not exists'

            throw new Error(msg)
          }
        } catch (error) {
          this.db = productionDb
          this.$q.localStorage.set('boundless_db', 'production')

          return false
        }
      }
    },
    loadConfig: async function () {
      /**
       * load the config from the db to session
       * TODO: this should be replaced since config/project is cached in session
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection('config').doc('project').get()

        if (doc.exists) {
          this.$q.sessionStorage.set('boundless_config', doc.data())
          // count down to refetch config from db
          this.$q.sessionStorage.set(
            'boundless_timeout', Date.now() + 5 * 60 * 1000
          )

          this.loadChallengeFlag(doc.data())

          this.$forceUpdate()
        } else {
          throw new Error('Fresh db!')
        }
      } catch (error) {
        this.layoutConfig = layoutConfig

        this.$forceUpdate()

        return false
      }
    },
    deepObjCopy: function (aObject) {
      /**
       * https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript/34624648#34624648
       * helper function for deep copy
       * @param {Object} aObject: object to be copied
       * @return {Object}
       */

      if (!aObject) {
        return aObject
      }

      let v
      let bObject = Array.isArray(aObject) ? [] : {}
      for (const k in aObject) {
        v = aObject[k]
        bObject[k] = (typeof v === 'object') ? this.deepObjCopy(v) : v
      }

      return bObject
    },
    routeHomeURL: function () {
      /**
       * helper function to route to homeURL
       * if specified inside the boundless config file
       * else route back to 'About Page'
       * @param {void}
       * @return {void}
       */

      if (this.layoutConfig.homeURL) {
        window.open(this.layoutConfig.homeURL)
      } else {
        this.$router.push({ path: '/' }).catch(err => {
          if (err) {
            // error
          }
        })
      }
    },
    logInLogOut: function () {
      /**
       * helper function for admin logout
       * @param {void}
       * @return {void}
       */

      // if logged in, clean cookies and session token
      if (this.$q.sessionStorage.has('admin_token')) {
        this.$q.sessionStorage.remove('admin_token')
        this.$q.cookies.remove('userToken')

        this.$router.replace('/').catch(err => {
          if (err) {
          }
        })
      // otherwise, admin is not logged in, and wants to log in
      } else {
        this.logInDialog()
      }

      this.$forceUpdate()
    },
    logInDialog: async function () {
      /**
       * this function processes the admin log in
       * @param {void}
       * @return {void}
       */
      // TODO: build an actual dialog component later

      this.$q.dialog({
        title: 'Admin Log In',
        message: 'Admin Username:',
        prompt: {
          model: '',
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        // passed in data is 'admin', then prompt password
        if (data === dbMeta.admin.username) {
          this.$q.dialog({
            title: 'Admin Log In',
            message: 'Password:',
            prompt: {
              dense: true,
              model: '',
              type: 'password'
            },
            cancel: true,
            persistent: true
          }).onOk(async (data) => {
            try {
              // grab the db meta data
              let metaCol = this.db.collection('--db_meta--').doc('data')
              let doc = await metaCol.get()

              // if db_meta collection exists, proceed to log in
              if (doc.exists) {
                let docData = doc.data()
                let correctPass = false
                let shaPass = sha256(data)

                // if the admin field is not there initially
                if (!docData.admin) {
                  // update db_meta
                  await this.db.collection('--db_meta--').doc('data').set({
                    admin: dbMeta.admin
                  }, { merge: true })

                  correctPass = shaPass === dbMeta.admin.password
                } else { // if the admin field is already there
                  correctPass = shaPass === docData.admin.password
                }

                if (correctPass) {
                  this.$q.sessionStorage.set('admin_token', 'admin')
                  this.$q.cookies.set(
                    'userToken', 'admin', { sameSite: 'Strict' }
                  )

                  this.$router.go()
                } else {
                  setTimeout(() => {
                    alert('Unsuccessful log in!')
                  }, 300)
                }
              } else {
                // does not exist, construct/initialize the db
                let dbConfigRef = this.db.collection('config').doc('project')

                await this.db.collection('--db_meta--').doc('data').set(dbMeta)
                await dbConfigRef.set(configSkeleton)

                let correctPass = false
                let shaPass = sha256(data)

                correctPass = shaPass === dbMeta.admin.password

                if (correctPass) {
                  this.$q.sessionStorage.set('admin_token', 'admin')
                  this.$q.cookies.set(
                    'userToken', 'admin', { sameSite: 'Strict' }
                  )

                  this.$router.go()
                } else {
                  setTimeout(() => {
                    alert('Unsuccessful log in!')
                  }, 300)
                }
              }
            } catch (error) {
            }
          })
        } else {
          setTimeout(() => {
            alert('User does not exists!')
          }, 300)
        }
      })
    },
    cookieCheck: function () {
      /**
       * check sessionStorage and cookies for login information
       * @param {void}
       * @return {return}
       */
      // TODO: more description on what it does with the information

      if (
        this.db &&
        this.$q.sessionStorage.getItem('boundless_timeout') < Date.now()
      ) {
        this.loadConfig()
      }

      if (
        this.$q.cookies.has('userToken') &&
        this.$q.cookies.get('userToken') === dbMeta.admin.username
      ) {
        if (!this.$q.sessionStorage.has('admin_token')) {
          this.$q.sessionStorage.set('admin_token', 'admin')

          this.$router.go()
        }
      } else {
        if (this.$q.sessionStorage.has('admin_token')) {
          this.$q.sessionStorage.remove('admin_token')
          this.$router.go()
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
