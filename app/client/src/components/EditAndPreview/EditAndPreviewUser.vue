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

Name:     components/EditAndPreview/EditAndPreviewUser.vue
Purpose:  The user interface to allow the admin to edit and preview the
          resulting edits of the user before submitting
Methods:
  * Allows the admin to edit user
  * Allows the admin to preview user

## -->

<template>

  <div class="q-pa-lg">
    <q-layout>
      <!-- -------------------- Header -------------------- -->
      <q-header reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center" >
              <strong>Edit Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <!-- -------------------- Footer -------------------- -->
      <q-footer reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center">
              <strong>Edit Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <!-- -------------------- Loading Spinner -------------------- -->
      <div
        v-if="loading"
        class="absolute-center"
        style="bottom: 15em;"
      >
        <q-spinner color="primary" size="8em" />
      </div>

      <!-- -------------------- Main Content -------------------- -->
      <q-form
        v-else
        @submit="onSubmit"
      >
        <q-splitter
          disable
          v-model="splitterModel"
        >
          <template v-slot:before>
            <q-tabs
              vertical inline-label stretch
              class="text-primary"
              v-model="pageTab"
            >
              <q-tab
                no-caps
                name="main" icon="person_pin" label="Profile"
              />
              <q-separator />
              <q-tab
                no-caps
                name="projects" icon="share" label="Projects"
              />
              <q-separator />
              <q-tab
                no-caps
                name="achievements" icon="brightness_high" label="Achievements"
              />
              <q-separator />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              animated
              transition-prev="jump-up" transition-next="jump-up"
              v-model="pageTab"
            >
              <q-tab-panel name="main">
                <q-card
                  class="q-pa-md"
                  style="min-width: 800px;"
                >
                  <!-- -------------------- Title -------------------- -->
                  <div
                    class="q-mb-sm"
                    align="center"
                  >
                    <strong
                      style="font-size: 18px;"
                    >
                      User Profile
                    </strong>
                    <q-separator color="secondary" />
                  </div>

                  <!-- ---------------- Profile Information ---------------- -->
                  <div class="row q-gutter-md">
                    <!-- ------------------- Main Image -------------------- -->
                    <div
                      class="col-4 cursor-pointer"
                      @click="invokeFilePicker"
                    >
                      <q-img
                        contain
                        :src="mainImage.cur" :ratio="1"
                        class="bg-black"
                        style="border-radius: 3px;"
                      />

                      <q-icon
                        dense flat
                        size="xs" color="accent" name="collections"
                        class="full-width"
                      />

                      <input
                        hidden
                        type="file" ref="imageInput"
                        accept="image/*"
                        @change="filePickerOnChange"
                      />

                      <q-tooltip
                        anchor="bottom middle"
                        self="top middle"
                        :offset="[10, 10]"
                      >
                        Choose your image file...
                      </q-tooltip>
                    </div>

                    <!-- -------------------- Content -------------------- -->
                    <div
                      class="col shadow-2 q-pa-sm"
                      style="border-radius: 3px;"
                    >
                      <!-- ----------------- User Name -------------------- -->
                      <div
                        class="q-pa-md q-mb-sm cursor-pointer"
                        style="border-radius: 3px;"
                      >
                        <strong>
                          Name:
                        </strong>
                        {{ curTocData.name }}

                        <popup-input-limit-len
                          title="Edit User Name"
                          :initialValue="curTocData.name"
                          :lenLimit="60"
                          @save="saveEditedName"
                        />

                        <dir style="
                          font-style: italic;
                          color: gray;
                          font-size: 14px;"
                        >
                          Member since {{ curTocData.created ? curTocData.created.substring(0, 10) : curTocData.timestamp.substring(0, 10) }}
                        </dir>
                      </div>

                      <!-- ------------------ User Email ------------------- -->
                      <div
                        class="q-pa-md q-mb-sm cursor-pointer"
                        style="border-radius: 3px;"
                      >
                        <strong>
                          Email:
                        </strong>
                        {{ curTocData.email }}
                        <q-popup-edit
                          buttons
                          v-model="curTocData.email"
                          :validate="popUpEmailValidation"
                          @hide="popUpReset"
                          @save="
                            curTocData.email = curTocData.email.toLowerCase();
                            reRender();
                          "
                        >
                          <q-input
                            dense filled autofocus label="Name"
                            :error="errorObj.error"
                            :error-message="errorObj.message"
                            v-model="curTocData.email"
                          />
                        </q-popup-edit>
                      </div>

                      <!-- ------------------ User Title ------------------- -->
                      <div
                        class="q-pa-md q-mb-sm cursor-pointer"
                        style="border-radius: 3px;"
                      >
                        <strong>
                          Title:
                        </strong>
                        {{ curTocData.title }}
                        <q-popup-edit
                          buttons
                          v-model="curTocData.title"
                          @save="reRender"
                        >
                          <q-input
                            dense filled autofocus label="Name"
                            v-model="curTocData.title"
                          />
                        </q-popup-edit>
                      </div>

                      <!-- ------------- Additional Information ------------ -->
                      <div>
                        <div class="row q-px-md">
                          <strong style="fontSize: 20px;">
                            Additional Information
                          </strong>
                          <q-separator class="q-mx-sm q-mt-md" color="secondary" />
                          <q-btn
                            dense round
                            color="accent" icon="add"
                            class="q-mb-sm"
                            @click="addAdditionalInformation"
                          />
                        </div>

                        <div
                          class="row q-px-md q-mb-md"
                          style="border-radius: 3px;"
                          v-for="(val, key, ind) in curData.socialNetwork"
                          :key="ind"
                        >
                          <div class="col q-ml-sm">
                            <strong>
                              {{ capitalizeKeys(key) }}:
                            </strong>
                            <q-input
                              dense filled
                              v-model="curData.socialNetwork[key]"
                              @blur="reRender"
                            />
                          </div>
                          <div class="col-1" align="right">
                            <q-btn
                              dense round
                              style="top: 1.2em;"
                              color="accent" size="md" icon="delete"
                              @click="deleteAdditionalInformation(key)"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  <!-- {{ curData }} -->
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="projects">
                <div
                  class="shadow-2 q-pa-md"
                  style="
                    margin: auto;
                    max-width: 1000px;
                    min-width: 800px;
                    border-radius: 3px;
                  "
                >
                  <div align="center">
                    <strong>Projects</strong>
                    <hr>
                    <div class="q-pa-md">
                      <div class="q-gutter-md">
                        <!-- <q-select
                          filled use-input hide-selected
                          multiple options-selected-class="text-red"
                          label="Add Menu for Projects"
                          input-debounce="0"
                          :options="projectList.filter"
                          v-model="projectList.projects"
                          @filter="filterFn"
                          @input="updated = true"
                        /> -->
                      </div>
                    </div>
                  </div>
                  <!-- ---------------- ToC Project Content ---------------- -->
                  <!-- <ProjectTable
                    :tableMode="childMode"
                    :popkeywords="keywordsOptions"
                    :projectList="projectList.projects"
                    @deleted="projectDeleteByChild"
                  /> -->
                  <ProjectTable
                    :uuid="curTocData.uuid"
                    :childDb="db"
                    :projectList="curData.projects || []"
                  />
                    <!-- @deleted="projectDeleteByChild" -->
                </div>
              </q-tab-panel>

              <q-tab-panel name="achievements">
                <div
                  class="shadow-2 q-pa-md"
                  style="
                    margin: auto;
                    max-width: 1000px;
                    min-width: 800px;
                    border-radius: 3px;
                  "
                >
                  <div align="center">
                    <strong>Achievements</strong>
                    <hr>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>

        <!-- -------------------- Sticky Buttons -------------------- -->
        <q-page-sticky
          position="top-right"
          :offset="[30, 18]"
        >
          <q-btn
            round
            class="q-ml-xs"
            size="sm" icon="done" type="submit"
            :disabled="!updated"
            :color="updated ? 'secondary' : 'accent'"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Submit
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            class="q-ml-xs"
            size="sm" color="accent" icon="clear"
            @click="emitClose"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Close
            </q-tooltip>
          </q-btn>
        </q-page-sticky>
      </q-form>
    </q-layout>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import productionDb, { productionStorage } from '../../firebase/init_production'
import testingDb, { testingStorage } from '../../firebase/init_testing'

import PopupInputLimitLen from '../../components/Popups/PopupInputLimitLen.vue'
import ProjectTable from '../../components/Tables/ProjectTable.vue'

export default {
  props: {
    uuid: String,
    emailSet: Set
  },
  components: {
    // uploadGUI
    ProjectTable,
    PopupInputLimitLen
  },
  async created () {
    try {
      // fetch data from database
      await this.loadFireRefs()
      await this.loadInformation()
    } catch (error) {
      throw error
    }
  },
  data () {
    return {
      errorObj: { // <Object>: record of error to be displayed
        error: false, // <Boolean>: flag for error
        message: '' // <String>: message of the error
      },
      mainImage: { // <Object>: record of main image
        prev: '', // <String>: url of the previous image
        cur: '', // <String>: url of the current image
        file: '' // <File>: file of the current image
      },
      db: null, // <Object>: firebase object referencing the database
      storage: null, // <Object>: firebase object referencing the storage
      loading: true, // <Boolean>: flag of page loading
      // data <Object>: required data of the component (check loadInformation)
      data: {},
      tocData: {}, // <Object>: data from the ToC
      curData: {}, // <Object>: mutable copy of data
      curTocData: {}, // <Object>: mutable copy of tocData
      updated: false, // <Boolean>: flag for update
      pageTab: 'main', // <String>: value of the tab
      splitterModel: 15 // <Integer>: % vw for the splitter to occur
    }
  },
  methods: {
    popUpReset: function () {
      /**
       * resetting error message
       * @param {void}
       * @return {void}
       */

      this.errorObj.error = false
      this.errorObj.message = ''
    },
    popUpEmailValidation: function (val) {
      /**
       * validation check for pop-up edit
       * @param {String} val: value to be validated
       * @return {void}
       */

      if (val === undefined) {
        this.errorObj.error = false
        this.errorObj.message = ''
        return true
      }

      if (!val || val.length === 0) {
        this.errorObj.error = true
        this.errorObj.message = 'Cannot be empty!'
        return false
      } else if (!this.validateEmailFormat(val)) {
        this.errorObj.error = true
        this.errorObj.message = 'Not a valid email format!'
        return false
      } else if (this.emailSet.has(String(val).toLowerCase())) {
        this.errorObj.error = true
        this.errorObj.message = 'This email is already taken!'
        return false
      }

      // successful call
      this.errorObj.error = false
      this.errorObj.message = ''
      return true
    },
    validateEmailFormat: function (entry) {
      /**
       * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
       * helper function to check if the email is valid
       * @param {String} entry: email to be checked
       * @return {String}
       */

      let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/

      return re.test(String(entry).toLowerCase())
    },
    reRender: function () {
      /**
       * force re-render while updated
       * @param {void}
       * @return {void}
       */

      this.updated = true
      this.$forceUpdate()
    },
    saveEditedName (editedName) {
      this.curTocData.name = editedName
      this.reRender()
    },
    deleteAdditionalInformation: function (entry) {
      /**
       * helper function to delete fields from socialNetwork
       * @param {String} entry: field to be deleted
       * @return {void}
       */

      delete this.curData.socialNetwork[entry]
      this.reRender()
    },
    addAdditionalInformation: function () {
      /**
       * function handler to add additional information to user
       * @param {void}
       * @return {void}
       */

      this.$q.dialog({
        title: 'Social Media',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          this.curData.socialNetwork[data.toLowerCase()] = ''
          this.reRender()
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Cannot be empty!',
            icon: 'warning'
          })
        }
      })
    },
    getMainPhoto: function () {
      /**
       * TODO: user missing default image
       * get the path of the main photo of the project
       * @param {void}
       * @return {String}
       */

      let max = 5
      let photoId = Math.floor(Math.random() * (max - 1 + 1)) + 1
      return 'statics/images/project-img-' + photoId + '.jpg'
    },
    invokeFilePicker: function () {
      /**
       * helper function to click on the hidden file picker
       * @param {String} entry: key of the refs
       * @return {void}
       */

      this.$refs.imageInput.click()
    },
    filePickerOnChange: function (e) {
      /**
       * changes file references on file change
       * @param {Event} e: event handler of the event
       * @return {void}
       */

      const file = e.target.files[0]

      if (file) {
        this.mainImage.cur = URL.createObjectURL(file)
        this.mainImage.file = file
        this.updated = true
      } else {
        this.mainImage.cur = this.mainImage.prev
        this.mainImage.file = ''
        // this.updated = false // removed for persistance
      }
    },
    capitalizeKeys: function (entry) {
      /**
       * helper function to capitalize the first character of the field
       * @param {String} entry: field string to be capitalized
       * @return {String}
       */

      if (entry === 'github') {
        return 'GitHub'
      }
      return entry[0].toUpperCase() + entry.slice(1)
    },
    onSubmit: async function () {
      /**
       * submit handler of the component; put images and files into storage;
       * update user's data to ToC as well as webpage; emit 'added' event
       * @param {void}
       * @return {void}
       */

      try {
        this.loading = true

        if (this.mainImage.file) {
          this.curTocData.imgURL = `users/${this.curTocData.email}`
          this.curTocData.imgURL += `/main/${this.mainImage.file.name}`

          // update the file to storage
          await this.storage.ref().child(
            this.curTocData.imgURL
          ).put(this.mainImage.file)
        }
        let timeOfSubmit = new Date(Date.now()).toISOString()

        this.curTocData.timestamp = timeOfSubmit
        this.curTocData.imgURL = this.curTocData.imgURL || ''

        if (this.curTocData.updated) {
          this.curTocData.updated = firebase.firestore.FieldValue.delete()
        }

        await this.db.collection('users').doc('ToC').set({
          [this.uuid]: this.curTocData
        }, { merge: true })

        this.curData.socialNetwork = this.curData.socialNetwork || {}
        this.curData.projects = this.curData.projects || []
        this.curData.achievements = this.curData.achievements || {}

        await this.db.collection('users').doc(this.uuid).set(this.curData)

        this.emitClose()
        this.$emit('added')

        return true
      } catch (error) {
        return false
      }
    },
    emitClose: function () {
      /**
       * 'close' event emitter
       * @param {void}
       * @return {void}
       */

      this.$emit('close')
    },
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
          this.storage = testingStorage
        } else {
          this.db = productionDb
          this.storage = productionStorage
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
          return false
        }
      }
    },
    loadInformation: async function () {
      /**
       * load information from config/project of the database
       * @param {void}
       * @return {Promise<Boolean>}
       */

      this.loading = true
      // this.projectImagePath = this.getMainPhoto()
      let promises = []
      promises.push(this.db.collection('users').doc(this.uuid).get())
      promises.push(this.db.collection('users').doc('ToC').get())

      try {
        let res = await Promise.all(promises)

        for (let objField in res[0].data()) {
          // code to fix old user.page
          if (objField === 'github' || objField === 'jive') {
            this.data.socialNetwork = this.data.socialNetwork || {}
            this.data.socialNetwork[objField] = res[0].data()[objField]
          } else {
            this.data[objField] = res[0].data()[objField]
          }
          // optimally, this should be used
          // this.data[objField] = res[0].data()[objField]
        }

        for (let objField in res[1].data()[this.uuid]) {
          this.tocData[objField] = res[1].data()[this.uuid][objField]
        }

        this.curData = this.deepObjCopy(this.data)
        this.curTocData = this.deepObjCopy(this.tocData)
        this.data = {}
        this.tocData = {}

        // this code is here to fix morph the data to next version
        this.curTocData.uuid = this.curTocData.uuid || this.curTocData.email
        this.curTocData.created = this.curTocData.created || this.curTocData.timestamp
        this.curTocData.title = this.curTocData.title || ''

        if (!this.curTocData.imgURL) {
          this.mainImage.cur = this.getMainPhoto()
          this.mainImage.prev = this.mainImage.cur
        } else {
          try {
            // get photo from storage
            let storageRef = this.storage.ref().child(this.curTocData.imgURL)
            let url = await storageRef.getDownloadURL()

            this.mainImage.cur = url
            this.mainImage.prev = url
          } catch (error) {
            // photo not in storage (data corruption)
            this.mainImage.cur = this.getMainPhoto()
            this.mainImage.prev = this.mainImage.cur
          }
        } // gonna ignore the load time it takes

        setTimeout(() => {
          this.loading = false
          return true
        }, 100)
      } catch (error) {
        return false
      }
    },
    loadConfig: async function () {
      /**
       * TODO: remove and currently not in use
       * load config for the component
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection('config').doc('project').get()

        if (doc.exists) {
          let data = doc.data()

          for (let key in data['keywords']) {
            this.keywordsOptions.push({
              label: key,
              value: data['keywords'][key]
            })
          }

          this.allowedDomain = data['allowedDomain']
          this.bodyTypeOptions = data['bodyContentType']
          this.chipTypeOptions = data['chipContentType']
        }

        return true
      } catch (error) {
        return false
      }
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

<style lan="stylus">

</style>
