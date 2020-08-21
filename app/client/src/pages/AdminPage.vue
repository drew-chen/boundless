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
    <q-card class="q-px-md q-py-sm console-page">
      <!-- -------------------- Page Header -------------------- -->
      <h6>
        Admin Console
      </h6>
      <q-separator />

      <!-- -------------------- Content Tabs -------------------- -->
      <div>
        <q-tabs
          dense inline-label
          class="text-grey"
          align="justify"
          active-color="primary"
          indicator-color="primary"
        >
          <q-route-tab
            no-caps exact
            icon="img:statics/images/projects-icon.png"
            label="Projects"
            to="/admin/manage-projects"
          />

          <q-route-tab
            no-caps
            v-if="layoutConfig && layoutConfig.challenges"
            icon="img:statics/images/challenge-icon1.png"
            label="Challenges"
            to="/admin/manage-challenges"
          />

          <q-route-tab
            no-caps
            label="Users"
            icon="person"
            to="/admin/manage-users"
          />

          <q-route-tab
            no-caps
            label="Settings"
            icon="settings"
            to="/admin/settings"
          />

        </q-tabs>
        <div class="q-pa-xs console-content-tab">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { layoutConfig } from '../../boundless.config'

import NotFound from './NotFound'

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
      layoutConfig: null // <Object>: dictionary of layout values
    }
  }
}

</script>

<style lang="stylus" scoped>

h6
  text-align center
  margin 5px 0
  font-weight strong
// console-page page loadout

.console-page
  min-width 800px
  max-width 98%
  margin: auto

// left-tab loadout
.console-content-tab
  border-radius 3px
  overflow hidden

.ap-left-panel
  border solid $grey-5 1px
  border-radius 3px

</style>
