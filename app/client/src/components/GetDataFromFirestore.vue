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

Name:     components/GetDataFromFirestore.vue
Purpose:  To allow the user to export data from firestore and import data
          into firestore
Methods:
  * Allows the data to be exported from firestore into .json file
  * Allows the data to be imported from .json file to firestore

## -->

<template>
  <div class="q-pa-sm full-width">
    <q-card class="q-pa-md dbCard">

      <!-- <input type="file"> -->
      <q-uploader
        bordered hide-upload-btn
        ref="file"
        class="full-width q-mb-sm"
        label="Upload JSON file for 'Import'..." accept=".json"
        @added="retrieveDataFromFile"
        @removed="attachedFile = !attachedFile"
      />

      <q-form @submit="onSubmit">
        <div class="row q-gutter-sm" align="center">
          <div class="col">
            <q-btn
              no-caps
              class="full-width" label="Import"
              type="submit"
              :disable="!attachedFile"
            />

            <q-tooltip v-if="!attachedFile">
              Please attach a '*.json' file.
            </q-tooltip>
          </div>

          <q-btn
            no-caps
            class="col" color="secondary" label="Download"
            @click="download('boundless_data', data)"
          />
        </div>
      </q-form>

    </q-card>
  </div>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import { dbMeta } from '../../boundless.config'

export default {
  async created () {
    try {
      await this.loadFireRefs()
      await this.loadData()
    } catch (error) {
      throw new Error(error)
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase object referencing the database
      loading: false, // <Boolean>: flag for page loading
      attachedFile: false, // <Boolean>: flag to check import file is attached
      // meta <Object>: meta data of the database to be exported or imported
      meta: {},
      // data <Array<Object>>: list of information to be exported or imported
      data: [],
      importDataField: '' // <String>: data to be imported
    }
  },
  methods: {
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
        } else {
          this.db = productionDb
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

          return false
        }
      }
    },
    onSubmit: async function () {
      /**
       * importing to the database
       * @param {void}
       * @return {Promise<Boolean>}
       */

      let promises = []

      try {
        this.$emit('importingToDB', true)

        this.importDataField.forEach(colObj => {
          let dbCollection = this.db.collection(colObj.name)

          colObj.data.forEach(colData => {
            promises.push(dbCollection.doc(colData.doc_id).set(colData.data))
          })
        })

        await Promise.all(promises)

        setTimeout(() => {
          this.$refs.file.files.splice(0, 1)
          this.attachedFile = false

          this.$q.sessionStorage.remove('boundless_config')
          this.$q.sessionStorage.remove('boundless_timeout')

          this.$emit('importingToDB', false)

          location.reload()

          return true
        }, 100)
      } catch (error) {
        return false
      }
    },
    download: function (filename, text) {
      /**
       * https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
       * exporting the data from the database into a .json file
       * @param {String} filename: name of the file
       * @param {String} text: data to be written on the file
       * @return {void}
       */

      let todayDate = new Date(Date.now()).toISOString().substring(0, 19)
      let element = document.createElement('a')

      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(text, null, 2)))

      element.setAttribute('download', `${filename}.${todayDate}.json`)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    loadData: async function () {
      /**
       * load the data from the database
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection(
          '--db_meta--'
        ).doc('data').get()

        if (doc.exists) {
          this.meta = doc.data()
        } else {
          this.meta = dbMeta

          // write the meta collection to db
          await this.db.collection(
            '--db_meta--'
          ).doc('data').set(this.meta)
        }

        // copy each fields from file to db
        this.meta.collections.forEach(async (colId) => {
          let docs = await this.db.collection(colId).get()

          let collectionDocuments = []

          docs.forEach(doc => {
            collectionDocuments.push({
              doc_id: doc.id,
              data: doc.data()
            })
          })

          this.data.push({
            name: colId,
            data: collectionDocuments
          })
        })

        return true
      } catch (error) {
        return false
      }
    },
    retrieveDataFromFile: function () {
      /**
       * read the data from the file attached to the uploader
       * @param {void}
       * @return {void}
       */

      let fr = new FileReader()
      fr.readAsText(this.$refs.file.files[0])
      fr.onload = () => {
        this.importDataField = JSON.parse(fr.result)

        this.attachedFile = !this.attachedFile
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
