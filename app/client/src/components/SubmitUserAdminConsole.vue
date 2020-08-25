<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

TODO:     Submit{User/Project/Challenge}AdminConsole can be one component
Name:     components/SubmitUserAdminConsole.vue
Purpose:  Encapsulates the Submit User component to invoke from admin console
Methods:
  * Adds user from the admin console
  * Closes the fullscreen dialog

## -->

<template>
  <div class="q-pa-lg">
    <q-layout>

      <br>
      <SubmitPage @added="emitAdded" />

      <q-page-sticky
        position="top-right"
        :offset="[30, 18]"
      >
        <q-btn
          round
          class="q-ml-xs" color="accent" icon="clear"
          @click="emitClose"
        >
          <q-tooltip content-class="bg-indigo" :offset="[0, 20]">
            Close
          </q-tooltip>
        </q-btn>
      </q-page-sticky>

    </q-layout>
  </div>
</template>

<script>
import SubmitPage from '../pages/SubmitUser'

export default {
  components: {
    SubmitPage
  },
  data () {
    return {

    }
  },
  methods: {
    emitClose: function () {
      /**
       * emit 'close' event for the parent
       * @param {void}
       * @return {void}
       */

      this.$emit('close')
    },
    emitAdded: function (passIn) {
      /**
       * emit 'added' event for the parent
       * @param {Object} passIn: new user's ToC information
       * @return {void}
      */

      this.$emit('added', passIn)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
