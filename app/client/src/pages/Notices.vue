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

Name:     pages/Notices.vue
Purpose:  To render notices and attributions
Methods:
  * Render notices and attributions

## -->

<template>
  <q-page>
    <div class="q-pa-sm" style="max-width: 90vw; margin: 2vh auto;">
      <div>
        <b class="text-h4">{{ main.title }}</b>
        <q-separator color="secondary" />
        <div class="q-mt-sm">
          {{ main.introduction }}
        </div>
      </div>
      <div class="row" v-if="Object.keys(notices).length">
        <div
          v-for="(v, k, idx) in notices"
          :key="idx"
          class="col-6 q-pa-md gt-xs"
          style="max-width: 650px;"
        >
          <b>{{ v.name }}</b>
          <q-separator color="secondary" />
          <div class="q-my-sm">
            <b>DESCRIPTION:</b>
            <span class="q-ml-lg">
              {{ v.description }}
            </span><br />
            <b>URL:</b>
            <span class="q-ml-lg">
              [<a :href="v.url">Link</a>]
            </span><br />
            <div class="q-mt-sm" align="center">
              <b>NOTICE(S):</b>
            </div>
            <pre class="q-ml-lg" style="margin-top: -18px;">
              {{ v.notice }}
            </pre>
          </div>
        </div>
        <div>
          <div
            v-for="(v, k, idx) in notices"
            :key="idx"
            class="col-12 q-pa-md xs lt-xs"
            style="max-width: 650px;"
          >
            <b>{{ v.name }}</b>
            <q-separator color="secondary" />
            <div class="q-my-sm">
              <b>DESCRIPTION:</b>
              <span class="q-ml-lg">
                {{ v.description }}
              </span><br />
              <b>URL:</b>
              <span class="q-ml-lg">
                <a :href="v.url">
                  <div class="ellipsis">
                    [{{ v.url }}]
                  </div>
                </a>
              </span><br />
              <div class="q-mt-sm" align="center">
                <b>NOTICE(S):</b>
              </div>
              <pre class="q-ml-lg" style="margin-top: -18px;">
                {{ v.notice }}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { main, notices } from '../../notices'

export default {
  data () {
    return {
      main,
      notices
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>

</style>
