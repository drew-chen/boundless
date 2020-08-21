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

Name:     components/Upload.vue
Purpose:  Component to help with uploading files into firebase storage
Methods:
  * Allows the user to multi attach files
  * Allows the user to upload the files into the firebase storage

## -->

<template>
  <q-card flat class="q-px-sm">
    <q-form @submit="onSubmit">
      <div class="q-mb-sm q-mx-sm" >
        <input
          :disable="uploading"
          multiple
          id="selectedFile"
          style="display: none;"
          type="file" ref="file"
          @change="onAdd"
        />

        <input
          type="button"
          value="Choose Files"
          onclick="document.getElementById('selectedFile').click();"
        >
        <span v-if="Object.keys(curData).length < 1" class="q-ml-xs">
          No file chosen
        </span>

        <span v-else class="q-ml-xs">
          {{ Object.keys(curData).length }}
          {{ Object.keys(curData).length > 1 ? 'files' : 'file' }}
        </span>
      </div>

      <div class="q-pa-sm" style="">
        <strong>Alias:</strong>
        <q-separator color="secondary" />

        <div v-if="Object.keys(curData).length">
          <div
            class="row q-mt-sm q-pa-xs cursor-pointer"
            v-for="(val, k, ind) in curData"
            :key="ind"
            style="
              border: solid 1px;
              border-radius: 3px;
            "
          >
            <div class="col">
              <strong>{{ k }}:</strong> {{ curData[k].key }}

              <popup-input-limit-len
                :initialValue="curData[k].key"
                :lenLimit="30"
                :label="k"
                @save="curData[k].key = $event"
              />

            </div>
            <div class="col-1 center-div">
              <q-btn
                flat round dense icon="close"
                @click="deleteAttachment(k)"
              />
            </div>
          </div>
        </div>

        <div v-else class="q-pa-sm">
          Please attach files...
        </div>
      </div>

      <div class="q-mt-sm q-gutter-sm" align="right" >
        <q-btn
          :disable="!attachedFile"
          no-caps
          :color="!attachedFile ? 'accent' : 'secondary'"
          class="" label="Upload"
          type="submit"
        >
          <q-tooltip v-if="!attachedFile">
            Please attach file or files.
          </q-tooltip>
        </q-btn>

        <q-btn
          no-caps outline
          class="" color="primary" label="Exit"
          @click="leaveEmit"
        />
      </div>

      <q-inner-loading :showing="uploading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-form>
  </q-card>
</template>

<script>
import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'

import PopupInputLimitLen from '../components/Popups/PopupInputLimitLen.vue'

export default {
  components: {
    PopupInputLimitLen
  },
  props: {
    uid: String,
    type: String
  },
  created () {
    // will never be here without boundless_db being selected
    if (this.$q.localStorage.has('boundless_db')) {
      let sessionDb = this.$q.localStorage.getItem('boundless_db')

      if (sessionDb === 'testing') {
        this.db = testingDb
        this.storage = testingStorage
      } else {
        this.db = productionDb
        this.storage = productionStorage
      }
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase object referencing the database
      storage: null, // <Object>: firebase object referencing the storage
      attachedFile: false, // <Boolean>: flag to lock submit
      uploading: false, // <Boolean>: flag to render internal loading
      data: {}, // <Object>: static data of the component from db
      curData: {} // <Object>: mutable copy of data
    }
  },
  methods: {
    deleteAttachment: function (key) {
      /**
       * deletes the key, value pair from this.curData
       * @param {String} key: key of the item to be deleted
       * @return {void}
       */

      delete this.curData[key]

      if (Object.keys(this.curData).length === 0) {
        this.attachedFile = false
      } else {
        this.attachedFile = true
      }

      this.$forceUpdate()
    },
    leaveEmit: function () {
      /**
       * emitter for 'leave' event
       * @param {void}
       * @return {void}
       */

      this.$emit('leave')
    },
    onSubmit: function () {
      /**
       * submit function which uploads files to storage and keep a record of
       * the uploaded files inside webpage of the respective projects
       * @param {void}
       * @return {void}
       */

      this.uploading = true

      let webFiles = {}

      for (let file in this.curData) {
        webFiles[this.curData[file].key] = this.curData[file].val
      }

      this.db.collection(this.type).doc(this.uid).set({
        files: webFiles
      }, { merge: true })

      this.uploadToStorage()
    },
    onAdd: function () {
      /**
       * helper function to add file to the files to be uploaded
       * @param {void}
       * @return {void}
       */

      this.attachedFile = true

      if (Object.keys(this.curData).length === 0) {
        for (let i = 0; i < this.$refs.file.files.length; i++) {
          let file = this.$refs.file.files[i]

          this.data[file.name] = {
            key: file.name,
            val: `${this.uid}/files/${Date.now()}_${file.name}`
          }
        }

        this.curData = this.deepObjCopy(this.data)
        this.data = {} // to save memory
      } else {
        for (let i = 0; i < this.$refs.file.files.length; i++) {
          let file = this.$refs.file.files[i]

          // if the file does not exists in curData
          if (!(file.name in this.curData)) {
            this.data[file.name] = {
              key: file.name,
              val: `${this.uid}/files/${Date.now()}_${file.name}`
            }
          }
        }

        let tmpDeepClone = this.deepObjCopy(this.data)
        this.data = {} // to save memory

        for (let fileName in tmpDeepClone) {
          this.curData[fileName] = tmpDeepClone[fileName]
        }
      }

      this.$forceUpdate()
    },
    onRemove: function (fileArray) {
      /**
       * helper function to handle file removed from the list of files
       * inside the uploader
       * @param {Array<File>} fileArray: list of files to be uploaded
       * @return {void}
       */

      if (this.$refs.file.files.length === 0) {
        this.attachedFile = false
      } else {
        this.attachedFile = true
      }

      // delete this.data[fileArray[0].name]
      delete this.curData[fileArray[0].name]

      this.$forceUpdate()
    },
    uploadToStorage: async function () {
      /**
       * helper function to handle upload into the storage
       * @param {void}
       * @return {void}
       */

      let promises = []
      let file = ''
      let pathToFile = ''

      for (let i = 0; i < this.$refs.file.files.length; i++) {
        file = this.$refs.file.files[i]

        if (file.name in this.curData) {
          pathToFile = this.curData[file.name].val

          promises.push(
            this.storage.ref().child(`${this.type}/${pathToFile}`).put(file)
          )
        }
      }

      try {
        await Promise.all(promises)

        this.attachedFile = false
        this.showLoading()

        this.$q.notify({
          type: 'positive',
          message: 'Uploaded successfully!'
        })
        this.$emit('close', this.curData)

        return true
      } catch (error) {
        return false
      }
    },
    showLoading: function () {
      /**
       * helper function to render loading for the component
       * @param {void}
       * @return {void}
       */

      setTimeout(() => {
        this.uploading = false
      }, 500)
    },
    deepObjCopy: function (aObject) {
      /**
       * https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript/34624648#34624648
       * creates a deep copy of the input
       * @param {Object} aObject: the object to be cloned
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
    }
  }
}
</script>

<style lang="stylus">

</style>
