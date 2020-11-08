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

Name:     components/Manage/Settings/SettingsProjectsAndChallenges.vue
Purpose:

  To allow the user configure project/challenge UI via a config panel
  inside admin console.

Methods:

  Allow the user to manage keywords for project/challenge.
  Allow the user to manage banners for project/challenge.
  The changes persists to display table as well.

## -->

<template>
  <div :hidden="loading">

    <div class="float-right">
      <button-undo-and-save
        :disabled="!updated"
        :save="submit"
        :undo="openResetDialog"
      />
    </div>

    <!-- -------------------- Progress Bar -------------------- -->
    <div v-if="data.progressBar">
      <div
        v-if="type === 'projects'"
        class="q-my-sm"
      >

        <div class="text-h4 q-my-sm">Project Progress Bar</div>

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

        <div class="col-2 q-pt-sm q-ml-md">
            <!-- <q-item-section>
            </q-item-section> -->
              <q-toggle
                color="green"
                v-model="data.progressBar.half"
                @input="forceUpdate()"
              />
          </div>
      </div>

    </div>

    <!-- -------------------- Keywords -------------------- -->
    <div>
      <div
        v-if="type === 'challenges'"
        class="q-my-sm"
      >
        <div class="text-h4 q-my-sm">Challenge Keywords</div>
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
          You can select up to 6 keywords to display under the banner.
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

    <!-- -------------------- Project Submission Questions -------------------- -->
    <project-create-custom-form
      :type="type"
      ref="projectCreateCustomForm"
      @modified="updated = true"
    />

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
                      :src="`${staticsPath}/${staticImages.challenges.tableBanner}`"
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
                      :src="`${staticsPath}/${staticImages.projects.tableBanner}`"
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
                      :src="`${staticsPath}/${staticImages.challenges.tableBanner}`"
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
                      :src="`${staticsPath}/${staticImages.projects.tableBanner}`"
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
                      :src="`${staticsPath}/${staticImages.challenges.webBanner}`"
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
                      :src="`${staticsPath}/${staticImages.projects.webBanner}`"
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
                      :src="`${staticsPath}/${staticImages.challenges.webBanner}`"
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
                      :src="`${staticsPath}/${staticImages.projects.webBanner}`"
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
                      :src="`${staticsPath}/images/computer-keyboard.jpg`"
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
                      :src="`${staticsPath}/images/computer-keyboard.jpg`"
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

    <div class="float-right">
      <button-undo-and-save
        :disabled="!updated"
        :save="submit"
        :undo="openResetDialog"
      />
    </div>

    <!-- -------------------- Dialog to confirm leaving with unsaved changes. -------------------- -->
    <dialog-confirm-leave
      ref="dialogConfirmLeave"
      :save="submit"
      :onLeave="revokeUrls"
      :undo="reset"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/clonedeep'
import Vue from 'vue'
import isFirebaseError from '../../../errors/isFirebaseError'
import { defaultImages } from '../../../../../client/boundless.config'

import productionDb, { productionStorage } from '../../../firebase/init_production'
import testingDb, { testingStorage } from '../../../firebase/init_testing'

import ProjectCreateCustomForm from '../../Forms/Project/ProjectCreateCustomForm.vue'
import ButtonUndoAndSave from '../../Buttons/ButtonUndoAndSave.vue'
import DialogConfirmLeave from '../../Dialogs/DialogConfirmLeave.vue'

import mixinConfirmUnload from '../../../mixins/mixinConfirmUnload'

export default {
  props: {
    // Dictionary containing keywords
    keywords: {
      type: Object,
      required: true
    },
    // Represents whether the parent component is handling projects or challenges.
    type: {
      type: String,
      required: true,
      validator (value) {
        // The value must match one of these strings.
        return ['projects', 'challenges'].indexOf(value) !== -1
      }
    },
    // The forced ratio given to images (used as a q-img prop).
    ratio: {
      type: String,
      required: true
    }
  },
  components: {
    ProjectCreateCustomForm,
    ButtonUndoAndSave,
    DialogConfirmLeave
  },
  // Requires 'this.updated' in data.
  mixins: [mixinConfirmUnload],
  /** Fetches data and initializes 'dbData' to the same initial values as 'data'. */
  async created () {
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

    await this.storageUrlFetcher('listingTable', 'bannerImg')
    await this.storageUrlFetcher('webpage', 'bannerImg')
    await this.storageUrlFetcher('webpage', 'mainImg')

    this.dbData = cloneDeep(this.data)
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
      // <Object>: Unmodified data from the database used to reset 'this.data'.
      dbData: {},
      recoveryPath: {}, // <Object>: record for paths to be recovered
      counter: 0, // <Integer>: Counter to track promises
      endCounter: 0, // <Integer>: counter to end the promise calls
      selectedStyle: { // <Object>: style of the dom once selected
        // boxShadow <String>: css property box-shadow
        boxShadow: '0px 0px 0px 3px orange inset',
        borderRadius: '3px' // <String>: css property border-radius
      },
      loading: true, // <Boolean>: flag for the page loading
      /**
       * <Boolean>: Flag for handling child emitted submit.
       * Describes to all updates except 'ProjectCreateCustomForm.vue' since
       * it's state is separate. Used in 'this.updated'.
       */
      updated: false,
      // <String>: Relative path of the statics directory
      staticsPath: '../../../statics'
    }
  },
  methods: {
    /**
     * Helper function to fetch the absolute url given relative
     * @param {String} property: name of the property inside config
     * @param {String} obj: name of the field inside the property
     */
    async storageUrlFetcher (property, obj) {
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
          } catch (error) {
            if (isFirebaseError(error, 'storage/object-not-found')) {
              console.error(error)
              this.data[property][obj].url = ''
            } else {
              throw error
            }
          }
        }
      }
    },
    /**
     * Helper function to add new tab on the progress
     * which creates a dialog when invoked and notifies
     * the user on success/failure.
     */
    addProgressTag () {
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
      })
    },
    /**
     * Helper function deletes the progress tag when invoked
     * and notifies the user on failure.
     * @param {Integer} index: of the tag to be deleted
     */
    deleteProgressTag (index) {
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
    /**
     * Updates the vue component by force once called and
     * sets true to this.updated.
     */
    forceUpdate () {
      this.updated = true
      this.$forceUpdate()
    },
    /**
     * Helper function to check if this.data.keywords is full (length of 5).
     * @param {Array<String>} keywords: List of keywords.
     */
    checkMax (keywords) {
      if (keywords.length > 6) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          position: 'bottom',
          message: 'Maximum of 6 keywords only.',
          timeout: 500
        })
        keywords.pop()
        this.data.keywords = keywords
      } else {
        this.updated = true
      }
    },
    /**
     * https://stackoverflow.com/questions/11876175/how-to-get-a-file-or-blob-from-an-object-url
     * fetch the blob data from the given url.
     * @param {String} url: Link of where the blob data is stored.
     * @param {String} property: Key of the config type.
     * @param {String} obj: Filename of the file to be stored
     *                      inside firebase storage.
     */
    async getBlobAndSubmitFromURL (url, property, obj) {
      let res = await fetch(url)
      res = await res.blob()

      let storageRef = this.storage.ref().child(
        `configs/${this.type}/${property}/${obj}.png`
      )
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

        this.dbData = (this.data)
        this.counter = 0
        this.updated = false
        this.$emit('submitting', false)
        this.$emit('submitted', this.data)
      }
    },
    /**
     * Load Firebase database, storage (if applicable),
     * and cloud functions reference (if applicable).
     */
    async loadFireRefs () {
      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')

        if (sessionDb === 'testing') {
          this.db = testingDb
          this.storage = testingStorage
        } else {
          this.db = productionDb
          this.storage = productionStorage
        }
      } else {
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
      }
    },
    /**
     * Submit handler for the component.
     */
    async submit () {
      this.endCounter = 0
      this.$emit('submitting', true)

      let blobFlag = false

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
        if (this.type === 'projects') {
          this.$refs.projectCreateCustomForm.submit()
        }
        this.dbData = cloneDeep(this.data)
        this.updated = false
        this.$emit('submitting', false)
        this.$emit('submitted', this.data)
      }
    },
    /**
     * Helper function to extract image out of the picked file.
     * @param {String} type: type of the field to be assigned.
     * @param {String} field: filed of the object to be assigned.
     */
    filePickerOnChange (type, field) {
      const eventHandler = (e, type, field) => {
        const file = e.target.files[0]
        const fToken = field.split('.')

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
    /** Opens confirmation to undo unsaved changes. */
    openResetDialog () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Undo all unsaved changes?',
        cancel: true
      }).onOk(() => {
        this.reset()
      })
    },
    /** Undo's local changes if there are changes to be saved. */
    reset () {
      if (this.updated) {
        if (this.type === 'projects') {
          this.$refs.projectCreateCustomForm.reset()
        }
        Vue.set(this.$data, 'data', cloneDeep(this.dbData))
        this.updated = false
      }
    },
    /**
     * When leaving the page, this function is called since we will no longer
     * use previously created URL objects. This is passed as a prop to
     * 'DialogConfirmLeave.vue'.
     */
    revokeUrls () {
      if (this.data.listingTable.bannerImg.url) {
        URL.revokeObjectURL(this.data.listingTable.bannerImg.url)
      }
      if (this.data.webpage.bannerImg.url) {
        URL.revokeObjectURL(this.data.webpage.bannerImg.url)
      }
      if (this.data.webpage.mainImg.url) {
        URL.revokeObjectURL(this.data.webpage.mainImg.url)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
