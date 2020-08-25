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

Name:     components/Manage/Settings/SettingsDatabase.vue
Purpose:  To allow the user to export data from firestore and import data
          into firestore
Methods:
  * Allows the data to be exported from firestore into .json file
  * Allows the data to be imported from .json file to firestore

## -->

<template>
  <div class="q-px-sm full-width">
    <q-card flat>
      <!-- IMPORT DATABASE -->
      <div class="">
        <div>
          <b class="text-h6">Import Database</b>
          <q-separator color="secondary" />
        </div>

        <q-card
          flat bordered
          class="q-my-md q-pa-sm input-field row"
        >
          <input
            class="col-10"
            type="file"
            ref="form"
            accept=".json"
            @change="retrieveDataFromFile"
          >
          <q-btn
            flat
            class="col-2"
            size="sm"
            icon="clear"
            @click.stop="reset"
          />
        </q-card>

        <q-form @submit="submit">
          <div class="">
            <q-btn
              no-caps label="Import" type="submit"
              style="width: 145px;"
              :disable="!attachedFile"
              :color="attachedFile ? 'secondary' : 'grey'"
            />
          </div>
        </q-form>
      </div>

      <!-- EXPORT DATABASE -->
      <div class="q-mt-lg">
        <div>
          <b class="text-h6">Export Database</b>
          <q-separator color="secondary" />
        </div>

        <div class="q-pt-sm">
          <q-btn
            no-caps
            style="width: 145px;"
            class="col" color="secondary" label="Download"
            @click="download(`${dbId}.data`, data)"
          />
        </div>
      </div>
    </q-card>
      <!-- -------------------- Dialog -------------------- -->
    <dialog-confirm-leave
      ref="dialogConfirmLeave"
      :save="submit"
      :undo="reset"
    />
  </div>
</template>

<script>
import productionDb from '../../../firebase/init_production'
import testingDb from '../../../firebase/init_testing'

import { dbMeta } from '../../../../../client/boundless.config'

import DialogConfirmLeave from '../../Dialogs/DialogConfirmLeave'

export default {
  components: {
    DialogConfirmLeave
  },
  async created () {
    await this.loadFireRefs()
    await this.loadData()

    this.dbId = this.db.XT.bT.ci.projectId
    this.$emit('databaseId', this.dbId)
  },
  computed: {
    // <Boolean>: Tells mixinSettingNavGuard.js when to open the dialog.
    updated () {
      return this.attachedFile
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase object referencing the database
      dbId: null, // <String>: project id of the firebase cred
      loading: false, // <Boolean>: flag for page loading
      attachedFile: false, // <Boolean>: flag to check import file is attached
      // <Object>: meta data of the database to be exported or imported
      meta: {},
      // <Array<Object>>: list of information to be exported or imported
      data: [],
      importDataField: '' // <String>: data to be imported
    }
  },
  methods: {
    /**
     * Load firebase database, storage (if applicable)
     * and cloud functions reference (if applicable).
     */
    loadFireRefs: async function () {
      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')
        if (sessionDb === 'testing') {
          this.db = testingDb
        } else {
          this.db = productionDb
        }
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
    /**
     * Importing to the database. Dialog is wrapped in a promise so that this
     * function can be awaited.
     */
    async submit () {
      const promisedDialog = await new Promise(resolve => {
        this.$q.dialog({
          title: 'Confirmation to Import',
          message: 'The old data will be overwritten!',
          cancel: true,
          persistent: true
        }).onOk(() => resolve(true)
        ).onCancel(() => resolve(false))
      })

      // ok is clicked
      if (promisedDialog) {
        await (async () => {
          let promises = []

          this.$emit('importingToDB', true)

          this.importDataField.forEach(colObj => {
            let dbCollection = this.db.collection(colObj.name)

            colObj.data.forEach(colData => {
              promises.push(dbCollection.doc(colData.doc_id).set(colData.data))
            })
          })

          await Promise.all(promises)

          setTimeout(() => {
            this.$q.sessionStorage.remove('boundless_config')
            this.$q.sessionStorage.remove('boundless_timeout')

            this.$emit('importingToDB', false)

            location.reload()
          }, 100)
        })()
      }
    },
    /**
     * https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
     * exporting the data from the database into a .json file
     * @param {String} filename: name of the file
     * @param {String} text: data to be written on the file
     */
    download: function (filename, text) {
      let todayDate = new Date(Date.now()).toISOString().substring(0, 19)
      let element = document.createElement('a')

      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(text, null, 2)))

      element.setAttribute('download', `${filename}.${todayDate}.json`)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    /**
     * Load the data from the database.
     */
    loadData: async function () {
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
    },
    /**
     * Read the data from the file attached to the uploader.
     */
    retrieveDataFromFile: function () {
      if (!this.$refs.form.files || !this.$refs.form.files[0]) {
        this.attachedFile = !this.attachedFile
      } else {
        let fr = new FileReader()
        fr.readAsText(this.$refs.form.files[0])
        fr.onload = () => {
          this.importDataField = JSON.parse(fr.result)

          this.attachedFile = !this.attachedFile
        }
      }
    },
    /**
     * Removes uploaded file. Does NOT reset the database imported.
     */
    reset () {
      this.importDataField = ''
      this.attachedFile = false
      this.$refs.form.value = ''
    }
  }
}
</script>

<style lang="stylus">

.input-field
  width 300px

</style>
