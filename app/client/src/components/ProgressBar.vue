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

Name:     components/ProgressBar.vue
Purpose:  Helper component to dynamic render the progress bar of the projects
          with depending on the pass-in values
Methods:
  * Dynamically renders progress bar for projects

## -->

<template>
  <div>
    <div v-if="progressBar.half" class="row" >
      <div
        v-for="(val, ind) in progressBar.tags"
        :key="ind"
        class="col"
        :class="{
          'null-color': progress < 2 * ind,
          'half-full-color': progress === 2 * ind,
          'full-color': progress >= 2 * ind + 1
        }"
      >
        {{ val }}
      </div>
    </div>

    <div v-else class="row" >
      <div
        v-for="(val, ind) in progressBar.tags"
        :key="ind"
        class="col"
        :class="{
          'null-color': progress < ind,
          'full-color': progress >= ind
        }"
      >
        {{ val }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressBar: Object,
    progress: Number
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">

</style>
