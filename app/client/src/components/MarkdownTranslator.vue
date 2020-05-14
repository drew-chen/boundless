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

Name:     components/MarkdownTranslator.vue
Purpose:  Translate the relative paths to absolute paths then display in
          markdown
Methods:
  * Translate the relative paths from pass-in data to absolute path
  * Render the translated text in markdown

## -->

<template>
  <q-markdown v-if="typeof source === 'string'" :src="source" ></q-markdown>
</template>

<script>
export default {
  props: {
    data: String,
    storage: Object
  },
  created () {
    this.markdownLinkTranslate()
  },
  data () {
    return {
      source: null // <String>: source text for the q-markdown
    }
  },
  methods: {
    markdownLinkTranslate: async function () {
      /**
       * translate the pass-in data by locating relative path delim and convert
       * them to absolute path before rendering
       * @param {void}
       * @return {Promise<Boolean>}
       */

      if (!this.data) {
        return false
      }

      try {
        let delim = 'local://'
        let d = this.data
        let start = d.indexOf(delim)
        let end

        // while (start >= 0 && d.lastIndexOf('src', start) >= 0) {
        while (start >= 0) {
          end = d.indexOf(')', start)
          if (end < 0) end = d.indexOf('\'', start)
          if (end < 0) end = d.indexOf('"', start)

          let storagePath = d.substring(start + delim.length, end)

          if (storagePath && storagePath.includes('.')) {
            let url = await this.storage.ref().child(
              storagePath
            ).getDownloadURL()
            d = d.replace(`${delim}${storagePath}`, url)
          }

          start = d.indexOf(delim, start + 1)
        }
        this.source = d

        return true
      } catch (error) {
        this.source = this.data

        return false
      }
    }
  },
  watch: {
    data: 'markdownLinkTranslate'
  }
}
</script>

<style lang="stylus" scoped>

</style>
