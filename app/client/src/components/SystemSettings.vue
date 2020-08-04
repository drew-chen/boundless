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

Name:     components/SystemSettings.vue
Purpose:  To allow the admin to customize general settings from
          the admin console
Methods:
  * Allows the admin to customize logo
  * Allows the admin to customize chips
  * Allows the admin to enable challenges
  * Allows the admin to edit keywords
  * Allows the admin to set pagination params

## -->

<template>
  <div>
    <div>
      <div class="row text-h4">
        General

        <q-space />

        <div class="q-mb-xs">
          <q-btn
            :disabled="!updated" no-caps
            class="float-right"
            label="Submit"
            :color="!updated ? 'accent' : 'secondary'"
            @click="submit"
          />
        </div>
      </div>

      <q-separator color="secondary" />

      <div
        v-if="$q.sessionStorage.has('boundless_config')"
        class="q-ml-md"
      >
        {{
          $q.sessionStorage.has('boundless_config')
          ? ($q.sessionStorage.getItem(
            'boundless_config'
          ).config_version
          ? `(v ${$q.sessionStorage.getItem(
            'boundless_config'
          ).config_version})` : '')
          : ''
        }}
      </div>
    </div>

    <div class="q-pa-sm full-width">
      <div class="q-pa-md">
        <div>
          <div class="row">
            <div class="text-h6 col-3 q-pt-xs" >
              <div class="row">
                About Logo:
                <q-toggle
                  v-if="data.generalConfig"
                  color="positive"
                  v-model="data.generalConfig.leftImg.visible"
                  @input="forceUpdateWUpdated"
                />
              </div>
            </div>

            <q-list class="col q-pl-lg">
              <q-item style="border-radius: 3px;">
                <q-item-section>
                  <input
                    label="Choose Custom Logo"
                    type="file" accept="image/*"
                    @change="aboutLogoImageSelect"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div
            v-if="
              data.generalConfig && data.generalConfig.leftImg &&
              data.generalConfig.leftImg.visible
            "
          >
            <q-list>
              <q-item
                v-if="file.file"
                style="height: 27vh;"
              >
                <q-item-section
                  class="hoverable"
                  :style="
                    data.generalConfig.leftImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.generalConfig.leftImg.active = true; updated = true
                  "
                >
                  <div>
                    <q-img
                      contain
                      class="center-img" style="max-height: 15vh;"
                      :src="file.url"
                      :ratio="4/3"
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
                    !data.generalConfig.leftImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.generalConfig.leftImg.active = false; updated = true
                  "
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      :src="`../statics/images/boundless-logo2.png`"
                      :ratio="4/3"
                      style="max-height: 15vh;"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>

              <q-item
                v-else-if="
                  !data.generalConfig || !data.generalConfig.leftImg ||
                  !data.generalConfig.leftImg.url ||
                  !data.generalConfig.leftImg.url.includes('http')
                "
                style="height: 20vh;"
              >
                <q-item-section
                  class="hoverable"
                  :style="selectedStyle"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img" style="max-height: 15vh;"
                      :src="`../statics/images/boundless-logo2.png`"
                      :ratio="4/3"
                    >
                      <div class="absolute-bottom-right text-subtitle2">
                        Default
                      </div>
                    </q-img>
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-else style="height: 27vh;" >
                <q-item-section
                  class="hoverable"
                  :style="
                    data.generalConfig.leftImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.generalConfig.leftImg.active = true; updated = true
                  "
                >
                  <div>
                    <q-img
                      contain
                      class="center-img" style="max-height: 15vh;"
                      :src="data.generalConfig.leftImg.url"
                      :ratio="10/3"
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
                    !data.generalConfig.leftImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.generalConfig.leftImg.active = false; updated = true
                  "
                >
                  <div>
                    <q-img
                      contain
                      class="center-img" style="max-height: 15vh;"
                      :src="`../statics/images/boundless-logo2.png`"
                      :ratio="4/3"
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
        </div>

        <q-separator class="q-my-sm" />

        <div
          v-for="(val, field, index) in data"
          :key="index"
        >
          <!-- TODO: REMOVE THIS ONCE EXTRAKEYWORDSDATA IS REMOVED -->
          <div
            v-if="
              ![
                'extraKeywordsData', 'generalConfig',
                'enabledChallenges', 'wikiInfo'
              ].includes(field)
            "
          >
            <div class="row">

              <div class="text-h6 col-2">{{ fieldParser(field) }}:</div>

              <!-- Column For Buttons -->
              <div
                v-if="field !== 'newFlag' && field !== 'pagination'"
                class="col-2 q-pl-xl q-ml-xs"
              >
                <div v-if="field === 'keywords'">
                  <q-btn
                    dense round
                    color="accent" size="md" icon="add"
                    @click="addKeywords"
                  />
                </div>

                <div v-else-if="field === 'customChips'" class="q-pt-md">
                  <q-btn
                    dense round
                    color="accent" size="md" icon="add"
                    @click="addCustomChips"
                  />
                </div>
              </div>

              <div
                v-if="Array.isArray(val)"
                class="col"
              >
                <div v-if="field === 'customChips'">
                  <q-chip
                    v-for="(arrVal, arrInd) in val" :key="arrInd"
                    color="secondary" text-color="white"
                    :icon="arrVal.value" :label='arrVal.label'
                    removable
                    @remove="deleteCustomChips(arrInd)"
                  />
                </div>

                <div v-else>
                  <div v-if="val.length === 0">
                    {{ val }}
                    <!-- <q-popup-edit v-model="data[field]" title="Edit the Name">
                      <q-input dense autofocus v-model="data[field]" />
                    </q-popup-edit> -->
                  </div>

                  <div
                    v-else
                    v-for="(arrVal, arrInd) in val"
                    :key="arrInd"
                  >
                    {{ arrVal }}
                    <!-- <q-popup-edit v-model="data[field]" title="Edit the Name">
                      <q-input dense autofocus v-model="data[field]" />
                    </q-popup-edit> -->
                  </div>
                </div>
              </div>

              <div
                v-else-if="typeof val === 'object'"
                class="col"
              >
                <div>
                  <div v-if="Object.keys(val).length === 0" class="q-py-sm">
                    Nothing here!
                  </div>

                  <div
                    v-else
                    v-for="(val, key, keyInd) in val"
                    :key="keyInd"
                    class="row q-my-xs ss-keywords-border"
                  >
                    <div class="col q-pl-sm flex items-center">
                      {{ key }}
                    </div>

                    <div
                      class="col-7 row q-py-xs"
                    >
                      <img
                        class="cursor-pointer"
                        style="
                          height: 40px; max-width: 45px; border-radius: 3px;
                        "
                        :ref="`img${key}`"
                        :src="
                          data.extraKeywordsData[key] &&
                          data.extraKeywordsData[key].includes('http') ?
                          data.extraKeywordsData[key] :
                          '../statics/images/other-icon.png'
                        "
                        @click="invokeFilePicker(`input${key}`)"
                      />

                      <input
                        hidden
                        type="file" accept="image/*"
                        :ref="`input${key}`"
                        @change="filePickerOnChange(`img${key}`, key)"
                      />

                      <q-space />

                      <div class="flex flex-center q-mr-sm">
                        <q-btn
                          dense round flat
                          icon="delete" color="accent"
                          @click="keywordsDelete(key)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div v-else class="highlight col q-py-sm q-pl-lg q-ml-lg" >
                <b>{{ val }}</b>
                <q-popup-edit
                  :title="`Edit ${fieldParser(field)}`"
                  v-model="data[field]"
                  buttons
                  @save="updated = true"
                >
                  <q-input
                    dense autofocus filled
                    v-model="data[field]"
                  />
                </q-popup-edit>
              </div>
            </div>

            <q-separator class="q-my-sm" />

          </div>

          <div v-else-if="field === 'enabledChallenges'">
            <div class="row">

              <div class="text-h6 col-2">{{ fieldParser(field) }}:</div>

              <div class="col q-pl-lg" >
                <q-item tag="label" v-ripple style="border-radius: 3px;">
                  <!-- <q-item-section>
                  </q-item-section> -->
                  <q-item-section avatar>
                    <q-toggle
                      color="green"
                      v-model="data.enabledChallenges"
                      @input="forceUpdateWUpdated"
                    />
                  </q-item-section>
                </q-item>
              </div>

            </div>

            <q-separator class="q-my-sm" />

          </div>

        </div>

        <div class="q-pa-md q-gutter-sm">
          <q-btn
            :disabled="!updated" no-caps
            class="float-right"
            label="Submit"
            :color="!updated ? 'accent' : 'secondary'"
            @click="submit"
          />

          <q-btn
            v-if="$q.sessionStorage.has('admin_token')"
            no-caps outline
            label="Edit About Page"
            @click="aboutDialog.dialog = true"
          />

          <!-- TODO: dialog for edit wiki -->
          <q-btn
            v-if="$q.sessionStorage.has('admin_token')"
            no-caps outline
            label="Wiki URL"
            @click="wikiDialog.dialog = true"
          />

          <q-btn
            v-if="$q.sessionStorage.has('admin_token')"
            no-caps outline
            label="Change Admin Password"
            @click="invokeAdminPassChange"
          />

        </div>
      </div>

      <!-- -------------------- Edit About Page Dialog -------------------- -->
      <q-dialog
        v-model="aboutDialog.dialog"
        persistent
        :maximized="aboutDialog.maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <q-bar>
            <q-space />

            <q-btn
              :disable="!aboutDialog.maximizedToggle"
              dense flat
              icon="minimize"
              @click="aboutDialog.maximizedToggle = false"
            >
              <q-tooltip
                v-if="aboutDialog.maximizedToggle"
                content-class="bg-white text-primary"
              >
                Minimize
              </q-tooltip>
            </q-btn>

            <q-btn
              :disable="aboutDialog.maximizedToggle"
              dense flat
              icon="crop_square"
              @click="aboutDialog.maximizedToggle = true"
            >
              <q-tooltip
                v-if="!aboutDialog.maximizedToggle"
                content-class="bg-white text-primary"
              >
                Maximize
              </q-tooltip>
            </q-btn>

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>

          </q-bar>

          <q-card-section>
            <div class="text-h6">Editing About Page</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <Markdown
              :db="db"
              :storage="storage"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- -------------------- Edit Wiki URL Dialog -------------------- -->
      <q-dialog
        v-model="wikiDialog.dialog"
        persistent buttons
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card style="min-width: 30%;">
          <q-card-section class="">
            <div class="text-h6">Editing Wiki URL</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div v-if="data.wikiInfo" class="q-gutter-md">
              <q-input
                outlined dense
                v-model="data.wikiInfo.name"
                label="Wiki Name"
                @input="forceUpdateWOSubmit"
              />
              <q-input
                outlined dense
                v-model="data.wikiInfo.url"
                label="Wiki Link"
                @input="forceUpdateWOSubmit"
              />
            </div>
          </q-card-section>

          <q-card-actions class="" align="right">
            <q-btn v-close-popup outline color="primary" label="Cancel" />
            <q-btn
              v-close-popup outline
              color="primary" label="Submit"
              @click="wikiSubmit"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- -------------------- Dialog -------------------- -->
    <dialog-confirm-leave
      ref="dialogConfirmLeave"
      :save="submit"
    />
  </div>
</template>

<script>
import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'
import { layoutConfig } from '../../boundless.config'

import sha256 from 'sha256'

import Markdown from '../components/Markdown.vue'
import DialogConfirmLeave from '../components/Dialogs/DialogConfirmLeave.vue'

export default {
  components: {
    Markdown,
    DialogConfirmLeave
  },
  async created () {
    try {
      // fectches required data
      await this.loadFireRefs()
      await this.loadInformation()

      if (this.$q.sessionStorage.getItem('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
        this.layoutConfig = layoutConfig

        if (typeof cachedConfig.enabledChallenges === 'boolean') {
          this.layoutConfig.challenges = cachedConfig.enabledChallenges
        }
      } else {
        this.layoutConfig = layoutConfig
      }

      await this.storageUrlFetcher()
    } catch (error) {
      throw error
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase object referencing the database
      storage: null, // <Object>: firebase object referencing the storage
      layoutConfig: null, // <Object>: configurations related to layout
      fileDeleteQueue: [], // <Array<File>>: list of files to be deleted
      data: {}, // <Object>: data of the component
      aboutDialog: { // <Object>: information regarding the about dialog
        dialog: false, // <Boolean>: flag for about dialog
        // maximizedToggle <Boolean>: flag for about dialog to be fullscreen
        maximizedToggle: true
      },
      wikiDialog: { // <Object>: information regarding the wiki dialog
        dialog: false // <Boolean>: flag for wiki dialog
      },
      file: { // <Object>: informaion regarding current and previous file
        file: '', // <File>: current file
        prev: '', // <String or File>: url or file of the previous blob
        url: '' // <String>: url of the file or blob
      },
      selectedStyle: { // <Object>: style of the selected image
        boxShadow: '0px 0px 0px 3px orange inset',
        borderRadius: '3px'
      },
      updated: false, // <Boolean>: flag to track updated
      submitted: false // <Boolean>: flag to track submitted
    }
  },
  methods: {
    storageUrlFetcher: async function () {
      /**
       * helper function to fetch the absolute url for system settings
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let promises = []
        let keysWithNewImage = []

        if (this.data && this.data.extraKeywordsData) {
          for (let key in this.data.extraKeywordsData) {
            let path = this.data.extraKeywordsData[key]

            if (path && !path.includes('http')) {
              keysWithNewImage.push(key)

              promises.push(
                this.storage.ref().child(path).getDownloadURL()
              )
            }
          }

          let storedFiles = await Promise.all(promises)

          // put the download links into the extraKeywordsData
          let key = ''

          for (let i = 0; i < keysWithNewImage.length; i++) {
            key = keysWithNewImage[i]

            this.data.extraKeywordsData[key] = storedFiles[i]
          }
        }

        if (
          this.data && this.data.generalConfig &&
          this.data.generalConfig.leftImg &&
          this.data.generalConfig.leftImg.url &&
          !this.data.generalConfig.leftImg.url.includes('firebasestorage')
        ) {
          let leftLogo = await this.storage.ref().child(
            this.data.generalConfig.leftImg.url
          ).getDownloadURL()

          this.data.generalConfig.leftImg.url = leftLogo
        }

        return true
      } catch (error) {
        return false
      }
    },
    staticDataChange: function () {
      /**
       * keep track of layoutConfig changing to update the App.vue
       * @param {void}
       * @return {void}
       */

      let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

      if (typeof storedConfig.enabledChallenges === 'boolean') {
        this.layoutConfig.challenges = storedConfig.enabledChallenges
      }

      if (
        storedConfig.wikiInfo &&
        typeof storedConfig.wikiInfo.name === 'string'
      ) {
        this.layoutConfig.homeName = storedConfig.wikiInfo.name
        this.layoutConfig.homeURL = storedConfig.wikiInfo.url || ''
      }
    },
    wikiSubmit: async function () {
      /**
       * submit handler for the wiki
       * @param {void}
       * @return {Promise<Boolean>}
       */

      this.$emit('submitting', true)
      let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

      storedConfig.wikiInfo = this.data.wikiInfo

      try {
        await this.db.collection('config').doc('project').update(storedConfig)

        this.$q.sessionStorage.set('boundless_config', storedConfig)
        this.$emit('submitting', false)

        return true
      } catch (error) {
        this.$emit('submitting', false)

        return false
      }
    },
    forceUpdateWOSubmit: function () {
      /**
       * helper function for force update
       * @param {void}
       * @return {void}
       */

      this.$forceUpdate()
    },
    aboutLogoImageSelect: function (e) {
      /**
       * logo of the left panel on the about page
       * @param {Event} e: event invoker
       * @return {void}
       */

      let reader = new FileReader()
      this.file.file = e.target.files[0]

      if (this.file.file) {
        this.data.generalConfig.leftImg.active = true
        this.file.prev = this.data.generalConfig.leftImg.url

        reader.onload = (event) => {
          this.file.url = event.target.result
        }

        reader.readAsDataURL(this.file.file)
      } else {
        this.data.generalConfig.leftImg.active = false
        this.file.url = this.file.prev
      }

      this.updated = true
    },
    forceUpdateWUpdated: function () {
      /**
       * helper function for force update while updated
       * @param {void}
       * @return {void}
       */

      this.updated = true
      this.$forceUpdate()
    },
    addCustomChips: function () {
      /**
       * add custom chip to while letting the user craft to their likings
       * @param {void}
       * @return {void}
       */

      // adding custChips
      let tmpChip = {}

      this.$q.dialog({
        title: 'Add new chip',
        message: 'What would the label be?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          tmpChip.label = data

          this.$q.dialog({
            title: 'Add new chip',
            message: 'What would the icon be?<br />Need the icon code from following sites: <ul><li><a href="https://material.io/resources/icons/?style=baseline" target="_blank" rel="noopener noreferrer">material</a></li><li><a href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer">fontawesome</a></li></ul><br /> ie: "3d_rotation", "alarm_on", or "fab fa-google"',
            html: true,
            prompt: {
              model: '',
              type: 'text' // optional
            },
            cancel: true,
            persistent: true
          }).onOk(data => {
            if (data) {
              tmpChip.value = data

              this.data.customChips.push(tmpChip)
              this.updated = true
            } else {
            }
          }).onCancel(() => {
          }).onDismiss(() => {
          })
        } else {
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    deleteCustomChips: function (index) {
      /**
       * helper function to delete the custom chip from this.data.customChips
       * @param {Integer} index: value of the index to be removed
       * @return {void}
       */

      // confirm with dialog
      this.updated = true
      this.data.customChips.splice(index, 1)
    },
    invokeAdminPassChange: function () {
      /**
       * allow the admin to change the admin password
       * @param {void}
       * @return {void}
       */

      let tmpObj = {}

      this.$q.dialog({
        title: 'Admin Password Change',
        message: 'Old Password:',
        prompt: {
          model: '',
          type: 'password'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        tmpObj.old_pw = data

        this.$q.dialog({
          title: 'Admin Password Change',
          message: 'New Password:',
          prompt: {
            model: '',
            type: 'password'
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          tmpObj.new_pw = data

          this.$q.dialog({
            title: 'Admin Password Change',
            message: 'Confirm New Password:',
            prompt: {
              model: '',
              type: 'password'
            },
            cancel: true,
            persistent: true
          }).onOk(async (data) => {
            tmpObj.conf_pw = data

            if (tmpObj.new_pw === tmpObj.old_pw) {
              this.$q.dialog({
                title: 'Error!',
                message: 'New password cannot be the same as old password.'
              })
            } else if (tmpObj.new_pw !== tmpObj.conf_pw) {
              this.$q.dialog({
                title: 'Error!',
                message: 'New passwords do not match.'
              })
            } else {
              try {
                this.$emit('submitting', true)

                let doc = await this.db.collection(
                  '--db_meta--'
                ).doc('data').get()

                if (doc.exists) { // if doc is there
                  let docData = doc.data()
                  let shaOldPass = sha256(tmpObj.old_pw)
                  let shaNewPass = sha256(tmpObj.new_pw)

                  let correctPass = shaOldPass === docData.admin.password

                  if (correctPass) { // if the old_pw is same as real
                    let newMetaAdmin = {
                      username: docData.admin.username,
                      password: shaNewPass
                    }

                    await this.db.collection('--db_meta--').doc('data').update({
                      admin: newMetaAdmin
                    })

                    this.$emit('submitting', false)
                    this.$q.notify({
                      type: 'positive',
                      message: '<div align="center">Sucessful!<div>',
                      html: true,
                      timeout: 750
                    })
                  } else { // if the old_pw is not same as real
                    this.$emit('submitting', false)
                    this.$q.dialog({
                      title: 'Error!',
                      message: 'The password was incorrect!'
                    })
                  }
                } else { // if there is no db_meta.data
                  this.$emit('submitting', false)
                  this.$q.dialog({
                    title: 'Error!',
                    message: 'Db_Meta.data does not exists.'
                  })
                }
              } catch (error) {
                this.$emit('submitting', false)
                this.$q.dialog({
                  title: 'Error!',
                  message: 'The password change was not sucessful!'
                })
              }
            }
          })
        })
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    invokeFilePicker: function (entry) {
      /**
       * helper function to click on the hidden file picker
       * @param {String} entry: key of the refs
       * @return {void}
       */

      this.$refs[entry][0].click()
    },
    filePickerOnChange: function (entry, key) {
      /**
       * fetching the file/blob url on file change
       * @param {String} entry: name of the refs
       * @param  {String} key: keyword
       * @return {void}
       */

      let eventHandler = async (e, entry) => {
        if (!e.target.files[0]) {
          this.$refs[entry][0].src = this.data.extraKeywordsData[key] ||
            '../statics/images/other-icon.png'
        } else {
          try {
            await this.onFileSelected(e.target.files[0], this.$refs[entry][0])
            this.updated = true
          } catch (err) {
            if (err) {
              // error
            }
          }
        }
      }

      eventHandler(event, entry)
    },
    onFileSelected: function (file, target) {
      /**
       * https://stackoverflow.com/questions/3814231/loading-an-image-to-a-img-from-input-file
       * helper function to generate file/blob url of the file
       * @param {File} file: file to be converted to url
       * @param {DOM} target: html component for the url
       * @return {void}
       */

      let reader = new FileReader()

      reader.onload = (event) => {
        target.src = event.target.result
      }

      reader.readAsDataURL(file)
    },
    keywordsDelete: function (key) {
      /**
       * helper function to delete keywords;
       * also deletes the file associated with the keyword
       * @param {String} key: keyword to be deleted
       * @return {void}
       */

      if (key in this.data.extraKeywordsData) {
        this.fileDeleteQueue.push(key)
      }
      delete this.data.keywords[key]

      this.updated = true
      this.$forceUpdate()
    },
    addKeywords: function () {
      /**
       * function handler to adding keywords into the system
       * @param {void}
       * @return {void}
       */

      this.$q.dialog({
        title: 'Add new keyword',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          if (!(data in this.data.keywords)) {
            this.data.keywords[data] = data.toLowerCase()

            this.updated = true
            this.$forceUpdate()
          }
        } else {
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
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
          this.db = productionDb
          this.$q.localStorage.set('boundless_db', 'production')

          return false
        }
      }
    },
    submit: async function () {
      /**
       * submit files, gets urls, and upate session config
       * @param {void}
       * @return {Promise<String>}
       */

      // start loading
      this.$emit('submitting', true)

      // int casting the data.props
      this.data.pagination = parseInt(this.data.pagination)
      this.data.newFlag = parseInt(this.data.newFlag)

      // getting ready to put keywords images into storage
      let promises = []
      let storagePaths = []
      let keysWithNewImage = []

      for (let prop in this.data.keywords) {
        if (
          this.$refs[`input${prop}`][0] &&
          this.$refs[`input${prop}`][0].files[0]
        ) {
          let storagePath = `configs/keywords/${prop}.png`
          let file = this.$refs[`input${prop}`][0].files[0]

          keysWithNewImage.push(prop)

          promises.push(this.storage.ref().child(storagePath).put(file))
          storagePaths.push(storagePath)
        }
      }

      try {
        await Promise.all(promises)

        // put the download links into the extraKeywordsData
        let key = ''

        for (let i = 0; i < keysWithNewImage.length; i++) {
          key = keysWithNewImage[i]

          this.data.extraKeywordsData[key] = storagePaths[i]
        }

        // getting ready to delete images if keywords were deleted
        promises = []

        if (this.fileDeleteQueue.length > 0) {
          this.fileDeleteQueue.forEach(queuedKey => {
            let storagePath = `configs/keywords/${queuedKey}.png`

            delete this.data.extraKeywordsData[queuedKey]
            promises.push(this.storage.ref().child(storagePath).delete())
          })
        }

        this.fileDeleteQueue = []

        for (let key in this.data.extraKeywordsData) {
          let storagePath = `configs/keywords/${key}.png`

          this.data.extraKeywordsData[key] = storagePath
        }

        try {
          await Promise.all(promises)
        } catch (error) {
          // file no longer in storage to delete
        }

        if (this.file.file) {
          // write logo to storage
          await this.storage.ref().child(
            'configs/about/left.png'
          ).put(this.file.file)
        }

        this.data.generalConfig.leftImg.url = 'configs/about/left.png'

        // finally updating to the database
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        storedConfig.generalConfig = storedConfig.generalConfig || {}
        storedConfig.generalConfig = {
          ...storedConfig.generalConfig,
          leftImg: this.data.generalConfig.leftImg
        }

        this.data.generalConfig = storedConfig.generalConfig

        await this.db.collection('config').doc('project').update(this.data)

        // write to SessionStorage to save some read
        storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        storedConfig.keywords = this.data.keywords
        storedConfig.enabledChallenges = this.data.enabledChallenges
        storedConfig.extraKeywordsData = this.data.extraKeywordsData

        storedConfig.generalConfig = storedConfig.generalConfig || {}
        storedConfig.generalConfig = {
          ...storedConfig.generalConfig,
          leftImg: this.data.generalConfig.leftImg
        }

        this.$q.sessionStorage.set('boundless_config', storedConfig)

        // update the keywords for Challenges and Projects Config
        this.$emit('keywords', this.data.keywords)

        this.staticDataChange()

        // load the url for display purposes
        await this.storageUrlFetcher()

        // finish loading
        this.submitted = true
        this.$emit('submitting', false)
        this.updated = false

        return true
      } catch (error) {
        return false
      }
    },
    loadInformation: async function () {
      /**
       * load information from config/project of the database
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection('config').doc('project').get()

        if (doc.exists) {
          this.data = doc.data()

          this.data.enabledChallenges = this.data.enabledChallenges || false

          let leftImg = {
            url: '',
            active: false,
            visible: true
          }
          // dealing with about logo to bind with 'Edit About Page'
          if (!this.data.generalConfig) {
            this.data.generalConfig = { leftImg }
          } else {
            let ssRef = this.$q.sessionStorage
            let storedConfig = ssRef.getItem('boundless_config')

            if (!storedConfig.generalConfig.leftImg) {
              this.data.generalConfig = {
                ...storedConfig.generalConfig,
                leftImg
              }
            } else if (
              storedConfig.generalConfig.leftImg.visible === undefined
            ) {
              this.data.generalConfig = { ...storedConfig.generalConfig }

              this.data.generalConfig.leftImg.visible = true
            }
          }

          // dealing with 'Wiki URL'
          if (!this.data.wikiInfo) {
            this.data.wikiInfo = {
              name: '',
              url: ''
            }
          }

          // TODO: take these out once the functions are done
          delete this.data.db
          delete this.data.config_version
          delete this.data.suggestedKeywords
          // delete this.data.keywords
          delete this.data.chipContentType
          delete this.data.bodyContentType
          delete this.data.allowedDomain

          this.$emit('usersConfigInfo', this.data.socialNetwork)
          this.$emit('challengesConfigInfo', this.data.challengesConfig)
          this.$emit('projectsConfigInfo', this.data.projectsConfig)
          this.$emit('keywords', this.data.keywords)

          delete this.data.socialNetwork
          delete this.data.challengesConfig
          delete this.data.projectsConfig

          // sort data via key
          this.data = Object.fromEntries(Object.entries(this.data).sort())
          // sort data.keywords via key
          this.data.keywords = Object.fromEntries(
            Object.entries(this.data.keywords).sort()
          )
        } else {
          throw new Error('Config file does not exists in the database!')
        }

        return true
      } catch (error) {
        return false
      }
    },
    fieldParser: function (val) {
      /**
       * helper function to data fields inside the data
       * @param {String} val: camel cased field to be splitted and capitalized
       * @return {String}
       */

      if (val === 'db') {
        return 'Database'
      } else {
        let strTokens = val.split(/(?=[A-Z])/)
        for (let i = 0; i < strTokens.length; i++) {
          strTokens[i] = strTokens[i][0].toUpperCase() + strTokens[i].slice(1).toLowerCase()
        }
        return strTokens.join(' ')
      }
    },
    /**
     * Helper function for parent component's 'beforeRouteLeave' method. The
     * dialog opens if changes have been made.
     *
     * @param {Function} next This function must be called to resolve the hook.
     *  This is the exact same object as 'beforeRouteLeave''s 'next' method.
     */
    openConfirmLeaveDialog (next) {
      if (this.canSave()) {
        this.$refs.dialogConfirmLeave.open(next)
      } else {
        next()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.ss-keywords-border {
  border: solid $grey-5 1px;
  border-radius: 3px;
}
</style>
