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

Name:     components/SettingPanels/Config.vue
Purpose:  To allow the user configure project/challenge UI via a config panel
          inside admin console
Methods:
  * Allow the user to manage keywords for project/challenge
  * Allow the user to manage banners for project/challenge
  * The changes persists to display table as well

## -->

<template>
  <div :hidden="loading">
    <!-- -------------------- Progress Bar -------------------- -->
    <div v-if="data.progressBar">
      <div
        v-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        <div class="row">
          Project Progress Bar

          <q-space />

          <div class="q-mb-xs">
            <q-btn
              :disabled="!updated"
              no-caps
              label="Submit"
              :color="!updated ? 'accent' : 'secondary'"
              @click="onSubmit"
            />
          </div>
        </div>
        <q-separator color="secondary" />
      </div>

      <div class="row">
        <div class="col-2 q-px-lg">
          Tags:
        </div>

        <div class="col-2 q-pl-lg q-ml-xs">
          <q-btn
            dense round
            color="accent" size="md" icon="add"
            @click="addProgressTag"
          />
        </div>

        <div class="col">
          <q-chip
            v-for="(arrVal, arrInd) in data.progressBar.tags" :key="arrInd"
            color="primary" text-color="white"
            :label='arrVal'
            removable
            @remove="deleteProgressTag(arrInd)"
          />
        </div>

      </div>

      <div class="row">
        <div class="col-2 q-px-lg q-my-md">
          Half-step:
        </div>

        <div class="col q-pt-sm">
          <q-item tag="label" v-ripple style="border-radius: 3px;">
            <!-- <q-item-section>
            </q-item-section> -->
            <q-item-section avatar>
              <q-toggle
                color="green"
                v-model="data.progressBar.half"
                @input="forceUpdate()"
              />
            </q-item-section>
          </q-item>
        </div>
      </div>

    </div>

    <!-- -------------------- Keywords -------------------- -->
    <div>

      <div
        v-if="type === 'challenges'"
        class="text-h4 q-mb-md"
      >
        <div class="row">
          Challenge Keywords
          <q-space />

          <div class="q-mb-xs">
            <q-btn
              :disabled="!updated"
              no-caps
              label="Submit"
              :color="!updated ? 'accent' : 'secondary'"
              @click="onSubmit"
            />
          </div>
        </div>
        <q-separator color="secondary" />
      </div>

      <div
        v-else-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        Project Keywords
        <q-separator color="secondary" />
      </div>

      <!-- If there is at least one keyword - then list them w/check box -->
      <div v-if="Object.keys(keywordOptions).length">
        <dir class="text-italic text-grey">
          You can select up to 6 keywords to diplay under the banner.
        </dir>
        <q-option-group
          v-if="data.keywords"
          dense inline
          class="q-px-lg q-py-md"
          color="primary" type="checkbox"
          :options="keywordOptions"
          v-model="data.keywords"
          @input="checkMax"
        />
      </div>
      <!-- No keywords yet -->
      <div v-else class="q-ml-sm">
        Keywords must be added in <b>General Settings</b>.
      </div>

      <p v-if="data.keywords" class="q-px-lg q-py-md">
        <b> Selected Keyword Ordering:</b> {{ data.keywords }} <br >
        <dir class="text-italic text-grey">
          This is the order in which they will appear.
        </dir>
      </p>
    </div>

    <!-- -------------------- Listing Table -------------------- -->
    <div>
      <div
        v-if="type === 'challenges'"
        class="text-h4 q-mb-md"
      >
        Challenge Listing Page
        <q-separator color="secondary" />
      </div>

      <div
        v-else-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        Project Listing Page
        <q-separator color="secondary" />
      </div>

      <div>
        <div
          v-if="data.listingTable !== undefined"
          class="q-pa-lg"
        >
          <div>
            <strong>
              Listing Banner:
            </strong>
            <q-list>
              <q-item style="border-radius: 3px;">
                <q-item-section>
                  <input
                    type="file" accept="image/*"
                    @change="
                      filePickerOnChange(type, 'listingTable.bannerImg');
                      updated = true
                    "
                  />
                </q-item-section>

              </q-item>

              <q-item
                v-if="
                  !data.listingTable.bannerImg.url ||
                  !data.listingTable.bannerImg.url.includes('http')
                "
                style="height: 27vh;"
              >
                <q-item-section
                  class="hoverable"
                  :style="
                    !data.listingTable.bannerImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.listingTable.bannerImg.active = false; updated = true
                  "
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 22vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 22vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-else style="height: 20vh;">
                <q-item-section
                  class="hoverable"
                  :style="
                    data.listingTable.bannerImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.listingTable.bannerImg.active = true; updated = true
                  "
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      :src="data.listingTable.bannerImg.url"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Custom
                      </div>
                    </q-img>
                  </div>
                </q-item-section>

                <q-item-section
                  class="hoverable"
                  :style="
                    !data.listingTable.bannerImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.listingTable.bannerImg.active = false; updated = true
                  "
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <q-separator class="q-my-sm" />
        </div>
      </div>
    </div>

    <!-- -------------------- Display Page -------------------- -->
    <div>
      <div
        v-if="type === 'challenges'"
        class="text-h4 q-mb-md"
      >
        Challenge Display Page
        <q-separator color="secondary" />
      </div>

      <div
        v-else-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        Project Display Page
        <q-separator color="secondary" />
      </div>

      <div>
        <div
          v-if="data.webpage !== undefined"
          class="q-pa-lg"
        >
          <div>
            <strong>
              Page Banner:
            </strong>
            <q-list>
              <q-item style="border-radius: 3px;">
                <q-item-section>
                  <input
                    type="file" accept="image/*"
                    @change="
                      filePickerOnChange(type, 'webpage.bannerImg');
                      updated = true
                    "
                  />
                </q-item-section>

              </q-item>

              <q-item
                v-if="
                  !data.webpage.bannerImg.url ||
                  !data.webpage.bannerImg.url.includes('http')
                "
                style="height: 27vh;"
              >
                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.bannerImg.active ? selectedStyle : ''"
                  @click="data.webpage.bannerImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 22vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 22vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-else style="height: 20vh;">
                <q-item-section
                  class="hoverable"
                  :style="data.webpage.bannerImg.active ? selectedStyle: ''"
                  @click="data.webpage.bannerImg.active = true; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      :src="data.webpage.bannerImg.url"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Custom
                      </div>
                    </q-img>
                  </div>
                </q-item-section>

                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.bannerImg.active ? selectedStyle : ''"
                  @click="data.webpage.bannerImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <q-separator class="q-my-sm" />

          <div>
            <strong>
              Page Image:
            </strong>
            <q-list>
              <q-item style="border-radius: 3px;">
                <q-item-section>
                  <input
                    type="file" accept="image/*"
                    @change="
                      filePickerOnChange(type, 'webpage.mainImg');
                      updated = true
                    "
                  />
                </q-item-section>

              </q-item>

              <q-item
                v-if="
                  !data.webpage.mainImg.url ||
                  !data.webpage.mainImg.url.includes('http')
                "
                style="height: 27vh;"
              >
                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.mainImg.active ? selectedStyle : ''"
                  @click="data.webpage.mainImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      src="../../statics/images/computer-keyboard.jpg"
                      :ratio="ratio"
                      style="max-height: 22vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-else style="height: 20vh;">
                <q-item-section
                  class="hoverable"
                  :style="data.webpage.mainImg.active ? selectedStyle: ''"
                  @click="data.webpage.mainImg.active = true; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      :src="data.webpage.mainImg.url"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Custom
                      </div>
                    </q-img>
                  </div>
                </q-item-section>

                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.mainImg.active ? selectedStyle : ''"
                  @click="data.webpage.mainImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      src="../../statics/images/computer-keyboard.jpg"
                      :ratio="ratio"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <q-separator class="q-my-sm" />
        </div>
      </div>
    </div>

    <!-- -------------------- Button -------------------- -->
    <div class="q-px-lg q-pb-lg">
      <div class="q-px-md q-pb-md q-gutter-sm" align="right">
        <q-btn
          :disabled="!updated"
          no-caps
          label="Submit"
          :color="!updated ? 'accent' : 'secondary'"
          @click="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defaultImages } from '../../../boundless.config'

import productionDb, { productionStorage } from '../../firebase/init_production'
import testingDb, { testingStorage } from '../../firebase/init_testing'

export default {
  props: {
    keywords: Object,
    type: String,
    ratio: String
  },
  async created () {
    try {
      setTimeout(() => {
        this.loading = false
      }, 100)

      // data fetching goes here
      await this.loadFireRefs()
      this.data = this.$q.sessionStorage.getItem('boundless_config')
      this.data = this.data[`${this.type}Config`]

      // help instantiate this.data.progressBar if not found in config
      if (
        this.type === 'projects' &&
        typeof this.data.progressBar === 'undefined'
      ) {
        this.data.progressBar = {
          tags: ['Idea', 'PoC', 'Value'],
          half: true
        }
      }

      for (let key in this.keywords) {
        this.keywordOptions.push({
          label: key,
          value: this.keywords[key]
        })
      }

      this.data.keywords = this.data.keywords.filter(
        v => Object.values(this.keywords).includes(v)
      )
      // this.data.listingTable.bannerImg.url
      // this.data.webpage.bannerImg.url
      // this.data.webpage.mainImg.url
      await this.storageUrlFetcher('listingTable', 'bannerImg')
      await this.storageUrlFetcher('webpage', 'bannerImg')
      await this.storageUrlFetcher('webpage', 'mainImg')
    } catch (error) {
      throw new Error(error)
    }
  },
  beforeDestroy () {
    // verfiy for user to leave if changes were detected
    if (!this.submitted && this.updated) {
      this.$q.dialog({
        title: 'Are you sure you want to leave without submitting changes? (All changes will be lost).',
        cancel: {
          flat: true,
          noCaps: true,
          label: 'Submit'
        },
        ok: {
          flat: true,
          noCaps: true,
          label: 'Leave'
        },
        persistent: true
      }).onOk(() => {
        if (this.data.listingTable.bannerImg.url) {
          URL.revokeObjectURL(this.data.listingTable.bannerImg.url)
        }
        if (this.data.webpage.bannerImg.url) {
          URL.revokeObjectURL(this.data.webpage.bannerImg.url)
        }
        if (this.data.webpage.mainImg.url) {
          URL.revokeObjectURL(this.data.webpage.mainImg.url)
        }
      }).onCancel(() => {
        this.onSubmit()
      })
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase firestore credentials
      storage: null, // <Object>: firebase storage credentials
      // staticImages <Object>: information related to the default images
      staticImages: defaultImages,
      // keywordOptions <Array<Object>>: list of keywords and their
      // respective values from the pass-in keywords list
      keywordOptions: [],
      // data <Object>: config information of either project or challenge
      data: {},
      recoveryPath: {}, // <Object>: record for paths to be recovered
      counter: 0, // <Integer>: couter to track promises
      endCounter: 0, // <Integer>: counter to end the promise calls
      selectedStyle: { // <Object>: style of the dom once selected
        // boxShadow <String>: css property box-shadow
        boxShadow: '0px 0px 0px 3px orange inset',
        borderRadius: '3px' // <String>: css property border-radius
      },
      loading: true, // <Boolean>: flag for the page loading
      submitted: false, // <Boolean>: flag for handling child emitted submit
      updated: false // <Boolean>: flag for handling child emitted submit
    }
  },
  methods: {
    storageUrlFetcher: async function (property, obj) {
      /**
       * helper function to fetch the absolute url given relative
       * @param {String} property: name of the property inside config
       * @param {String} obj: name of the field inside the property
       * @return {Promise<Boolean>}
       */

      if (
        this.data[property] && this.data[property][obj] &&
        this.data[property][obj].url
      ) {
        if (!this.data[property][obj].url.includes('firebasestorage')) {
          this.recoveryPath[`${property}.${obj}`] = this.data[property][obj].url
          // fetch the item from firebase storage
          try {
            let url = await this.storage.ref().child(
              this.data[property][obj].url
            ).getDownloadURL()

            this.data[property][obj].url = url

            return true
          } catch (error) {
            this.data[property][obj].url = ''

            return false
          }
        }

        return true
      }

      return false
    },
    addProgressTag: function () {
      /**
       * helper function to add new tab on the progress
       * which creates a dialog when invoked and notifies
       * the user on success/failure
       * @param {void}
       * @return {void}
       */

      this.$q.dialog({
        title: 'Add new tag for progress bar',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (
          data && data.length < 7 &&
          !(data in this.data.progressBar.tags) &&
          this.data.progressBar.tags.length < 4
        ) {
          this.data.progressBar.tags.push(data)

          this.forceUpdate()
        } else if (data.length > 6) {
          this.$q.notify({
            message: 'Tag must be at most 6 characters!',
            icon: 'warning',
            color: 'negative'
          })
        } else if (this.data.progressBar.tags.length >= 4) {
          this.$q.notify({
            message: 'Must have at most 4 tag for the progress bar!',
            icon: 'warning',
            color: 'negative'
          })
        } else {
          this.$q.notify({
            message: 'Tag cannot be empty!',
            icon: 'warning',
            color: 'negative'
          })
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    deleteProgressTag: function (index) {
      /**
       * helper function deletes the progress tag when invoked
       * and notifies the user on failure
       * @param {Integer} index: of the tag to be deleted
       * @return {void}
       */

      if (this.data.progressBar.tags.length > 1) {
        this.data.progressBar.tags.splice(index, 1)

        this.forceUpdate()
      } else {
        this.$q.notify({
          message: 'Must have at least 1 tag for the progress bar!',
          icon: 'warning',
          color: 'negative'
        })
      }
    },
    forceUpdate: function () {
      /**
       * updates the vue component by force once called and
       * sets true to this.updated
       * @param {void}
       * @return {void}
       */

      this.updated = true
      this.$forceUpdate()
    },
    checkMax: function (keywords) {
      /**
       * helper function to check if this.data.keywords is full (length of 5)
       * @param {Array<String>} keywords: list of keywords
       * @return {void}
       */

      if (keywords.length > 6) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          position: 'bottom',
          message: 'Maximun of 6 keywords only.',
          timeout: 500
        })

        keywords.pop()
        this.data.keywords = keywords
      } else {
        this.updated = true
      }
    },
    getBlobAndSubmitFromURL: async function (url, property, obj) {
      /**
       * https://stackoverflow.com/questions/11876175/how-to-get-a-file-or-blob-from-an-object-url
       * fetch the blob data from the given url
       * @param {String} url: link of where the blob data is stored
       * @param {String} property: key of the config type
       * @param {String} obj: filename of the file to be stored
       *                      inside firebase storage
       * @return {Promise<Blob>}
       */

      try {
        let res = await fetch(url)
        res = await res.blob()

        let storageRef = this.storage.ref().child(
          `configs/${this.type}/${property}/${obj}.png`
        )
        // let ss = await storageRef.put(res)
        // let dlURL = await ss.ref.getDownloadURL()
        await storageRef.put(res)
        let dlURL = `configs/${this.type}/${property}/${obj}.png`

        URL.revokeObjectURL(url)
        this.data[property][obj].url = dlURL
        delete this.data[property][obj].prev
        this.counter = this.counter + 1

        if (this.counter === this.endCounter) {
          await this.db.collection('config').doc('project').set({
            [`${this.type}Config`]: this.data
          }, { merge: true })

          if (this.$q.sessionStorage.has('boundless_config')) {
            let dbConfig = this.$q.sessionStorage.getItem('boundless_config')
            dbConfig[`${this.type}Config`] = this.data

            this.$q.sessionStorage.set('boundless_config', dbConfig)
          }

          await this.storageUrlFetcher('listingTable', 'bannerImg')
          await this.storageUrlFetcher('webpage', 'bannerImg')
          await this.storageUrlFetcher('webpage', 'mainImg')

          this.counter = 0
          this.updated = false
          this.$emit('submitting', false)
          this.$emit('submitted', this.data)
        }
      } catch (error) {
        throw new Error(error)
      }
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
    onSubmit: async function () {
      /**
       * submit handler for the component
       * @param {void}
       * @return {void}
       */

      this.endCounter = 0
      this.submitted = true
      this.$emit('submitting', true)

      let blobFlag = false

      try {
        for (let property in this.data) {
          for (let obj in this.data[property]) {
            let blobURL = this.data[property][obj].url

            if (blobURL && blobURL.split(':')[0] === 'blob') {
              blobFlag = true
              this.endCounter = this.endCounter + 1
              this.getBlobAndSubmitFromURL(blobURL, property, obj)
            }
          }
        }

        if (!blobFlag) {
          // this.data.listingTable.bannerImg.url
          // this.data.webpage.bannerImg.url
          // this.data.webpage.mainImg.url
          for (let key in this.recoveryPath) {
            let val = this.recoveryPath[key]

            key = key.split('.')

            this.data[key[0]][key[1]].url = val
            if (this.data[key[0]][key[1]].prev) {
              delete this.data[key[0]][key[1]].prev
            }
          }

          await this.db.collection('config').doc('project').set({
            [`${this.type}Config`]: this.data
          }, { merge: true })

          if (this.$q.sessionStorage.has('boundless_config')) {
            let dbConfig = this.$q.sessionStorage.getItem('boundless_config')
            dbConfig[`${this.type}Config`] = this.data

            this.$q.sessionStorage.set('boundless_config', dbConfig)
          }

          await this.storageUrlFetcher('listingTable', 'bannerImg')
          await this.storageUrlFetcher('webpage', 'bannerImg')
          await this.storageUrlFetcher('webpage', 'mainImg')

          setTimeout(() => {
            this.updated = false

            this.$emit('submitting', false)
            this.$emit('submitted', this.data)
          }, 300)
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    filePickerOnChange: function (type, field) {
      /**
       * helper function to extract image out of the picked file
       * @param {String} type: type of the field to be assigned
       * @param {String} field: filed of the object to be assigned
       * @return {void}
       */

      const eventHandler = (e, type, field) => {
        const file = e.target.files[0]
        let fToken = field.split('.')

        if (file) {
          this.data[fToken[0]][fToken[1]].prev = this.data[fToken[0]][fToken[1]].url
          this.data[fToken[0]][fToken[1]].url = URL.createObjectURL(file)

          this.data[fToken[0]][fToken[1]].active = true
        } else {
          URL.revokeObjectURL(this.data[fToken[0]][fToken[1]].url)
          this.data[fToken[0]][fToken[1]].url = this.data[fToken[0]][fToken[1]].prev
          delete this.data[fToken[0]][fToken[1]].prev

          if (!this.data[fToken[0]][fToken[1]].url) {
            this.data[fToken[0]][fToken[1]].active = false
          }
        }
      }

      eventHandler(event, type, field)
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

<style lang="stylus" scoped>

</style>
