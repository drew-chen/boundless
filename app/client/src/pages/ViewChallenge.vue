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

Name:     pages/ViewChallenge.vue
Purpose:  Webpage layout for the individual challenge
Methods:
  * Renders the dyanmic webpage for the individual challenge

## -->

<template>
  <NotFound v-if="notFound" />
  <q-page v-else class="q-pa-lg">
    <!-- -------------------- Loading -------------------- -->
    <div
      v-if="loading"
      class="absolute-center"
    >
      <q-spinner
        color="primary"
        size="8em"
      />
    </div>

    <div v-else>
      <q-splitter
        v-model="splitterModel"
        disable
      >

        <template v-slot:before>
          <q-tabs
            vertical inline-label stretch
            class="text-primary"
            v-model="pageTab"
          >
            <q-route-tab
              exact no-caps
              name="main" icon="view_stream" label="Main"
              :to="`/challenge/${challengeId}`"
            />

            <q-separator />

            <!-- <q-route-tab
              exact no-caps
              name="logs" icon="forum" label="Logs"
              :to="`/challenge/${challengeId}/logs`"
            />

            <q-separator /> -->

            <!-- <div v-if="$q.sessionStorage.has('admin_token')"> -->
            <q-route-tab
              :to="`/challenge/${data.uuid}/attachments`"
              name="attachments"
              icon="attachment"
              label="Attachments"
              no-caps
            />

            <q-separator />

            <!-- </div> -->
            <q-route-tab
              exact no-caps
              name="projects" label="Projects"
              icon="img:statics/images/projects-icon.png"
              :to="`/challenge/${challengeId}/projects`"
            />

            <q-separator />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="pageTab"
            animated
            transition-prev="scale"
            transition-next="scale"
          >
            <q-tab-panel name="main">
              <Banner
                :bannerObj="bannerObj"
              />

              <div v-if="data">
                <!-- -------------------- Main Page -------------------- -->
                <div
                  align="center" class="shadow-2"
                  style="margin: auto; max-width: 1000px; min-width: 800px; border-radius: 3px;"
                >
                  <br class="small">

                  <!-- ------------------ Challenge Page ------------------- -->
                  <div class="q-pa-md" align="left">
                    <br><br>
                    <div class="row q-mb-sm">
                      <div class="col q-pa-sm">
                        <!-- --------------- Challenge Title --------------- -->
                        <div class="text-h4 text-primary text-center">
                          {{ data.challenge }}
                          <q-separator color="secondary" />
                        </div>

                        <!-- ---------------- Description ---------------- -->
                        <div class="q-pa-sm">
                          <pre>{{ data.description }}</pre>
                        </div>
                      </div>
                      <div class="col q-ml-md">
                        <q-img
                          contain
                          class="project-img"
                          :src="challengeImagePath"
                          :style="
                            `background: ${
                              mainImgBgColor ? mainImgBgColor : 'black'
                            }`
                          "
                          :ratio="4/3"
                        />
                      </div>
                    </div>

                    <q-separator inset />

                    <!-- ----------------- Priority Gague ------------------ -->
                    <div class="q-pa-md text-h7" align="center">
                      <div class="text-h5">
                        Priority
                      </div>

                      <div class="q-mt-sm">
                        <q-knob
                          show-value readonly
                          size="70px" class="q-ma-md"
                          track-color="grey-3"
                          v-model="priorityGague.val[data.priority]"
                          :angle="225"
                          :max="360"
                          :thickness="0.4"
                          :color="priorityGague.color[data.priority]"
                        >
                          <strong>
                            {{ priorityGague.text[data.priority] }}
                          </strong>
                        </q-knob>
                      </div>

                    </div>

                    <q-separator inset />

                    <!-- ------------------ Project Chips ------------------ -->
                    <div class="q-pa-md" align="center">

                      <q-chip
                        clickable
                        color="secondary"
                        text-color="white"
                        icon="far fa-clipboard"
                        @click="copyURLtoClipboard"
                      >
                        Copy URL
                      </q-chip>

                      <span
                        v-for="(chipContent, chipInd) in data.webpage.chips"
                        :key="chipInd"
                      >
                        <q-chip
                          v-if="!chipContent.hidden"
                          clickable
                          color="secondary" text-color="white"
                          :icon="chipContent.content.icon"
                          @click="openNewTab(chipContent.content.url)"
                        >
                          {{ chipContent.content.label }}
                        </q-chip>
                      </span>

                      <q-chip
                        clickable
                        @click="popDialog('keywords')"
                        color="secondary"
                        text-color="white"
                        icon="vpn_key"
                      >
                        Keywords
                      </q-chip>

                    </div>

                    <!-- --------------- Business Rationale ---------------- -->
                    <div v-if="data.rationale">
                      <div
                        class="
                          text-h4
                          text-primary
                        "
                      >
                        Business Rationale
                        <q-separator color="secondary" />
                      </div>

                      <div class="q-pa-sm">
                        <pre>{{ data.rationale }}</pre>
                      </div>
                    </div>

                    <!-- -------------------- Body -------------------- -->
                    <div>
                      <div
                        v-for="(bodyContent, bodyInd) in data.webpage.body"
                        :key="bodyInd"
                      >
                        <div :hidden="bodyContent.hidden === true">
                          <div
                            v-if="bodyContent.content.label"
                            class="text-h4 q-mt-sm"
                          >
                            {{ bodyContent.content.label }}
                            <q-separator color="secondary" />
                          </div>

                          <div>
                            <div v-if="bodyContent.content.type === 'TEXT_BOX'">
                              <div class="q-pa-sm">
                                <pre>{{ bodyContent.content.text }}</pre>
                              </div>
                            </div>

                            <div
                              v-else-if="
                                bodyContent.content.type === 'MARKDOWN'
                              "
                            >
                              <div class="q-pa-sm">
                                <MarkdownTranslator
                                  :storage="storage"
                                  :data="bodyContent.content.text"
                                />
                              </div>
                            </div>

                            <div v-else>
                              <ul>
                                <li
                                  v-for="(link, ulIndex) in bodyContent.content.list"
                                  :key="ulIndex"
                                >
                                  <div
                                    v-if="bodyContent.content.type === 'EVENT_LIST'"
                                    style="display: inline; padding-left: 12px;"
                                  >
                                    {{ link.subject }}
                                    <hr>
                                    Description: {{ link.body }} <br>
                                    Date and Time: {{ link.date }} <br>
                                    <a v-if="link.url !== ''" :href="link.url">More...</a>
                                  </div>
                                  <span v-else>
                                    <em v-if="link.url === ''">
                                      {{ link.item }}
                                    </em>
                                    <a
                                      v-else
                                      target="_blank" rel="noopener noreferrer"
                                      :href="link.url"
                                    >
                                      {{ link.item }}
                                    </a>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div><br>

                        </div>
                      </div>
                    </div>

                    <!-- ---------------- Sponsor List ------------------- -->
                    <div>
                      <div class="text-h4 text-primary" >
                        Sponsors
                        <q-separator color="secondary" />
                      </div>

                      <q-list
                        bordered separator
                        class="rounded-borders"
                        style="max-width: 98%; margin: 1em auto;"
                      >
                        <q-item
                          v-for="sponsor in data.sponsors"
                          :key="sponsor.id"
                          clickable v-ripple
                        >
                          <q-item-section class="col" align="center">
                            <div v-if="sponsor.imgURL">
                              <q-avatar
                                size="75px" color="primary"
                                text-color="white"
                              >
                                <q-img
                                  :src="extraSponsorInfo.img[sponsor.imgURL]"
                                  style="height: 75px;"
                                />
                              </q-avatar>
                            </div>

                            <div v-else>
                              <q-avatar
                                v-if="sponsor.name"
                                size="75px" color="primary"
                                font-size="32px" text-color="white"
                              >
                                {{ sponsor.name.split(' ')[0][0] + sponsor.name.split(' ')[1][0] }}
                              </q-avatar>
                            </div>
                          </q-item-section>

                          <q-item-section class="col">
                            <strong style="font-size: 20px;">{{ sponsor.name }}</strong>
                          </q-item-section>

                          <q-item-section class="col">
                            <!-- <q-item-label lines="1">
                              <span class="text-weight-medium">[quasarframework/quasar]</span>
                              <span class="text-grey-8"> - GitHub repository</span>
                            </q-item-label> -->

                            <q-item-label lines="1">
                              {{ sponsor.email }}
                            </q-item-label>

                            <q-item-label v-if="sponsor.title" lines="1">
                              <span class="text-weight-medium">{{ sponsor.title }}</span>
                            </q-item-label>

                            <!-- <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                              <span class="cursor-pointer">Open in GitHub</span>
                            </q-item-label> -->
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                  </div>

                  <br><br>

                </div>

                <!-- -------------------- Popup Dialog -------------------- -->
                <div class="q-pa-md q-gutter-sm">
                  <q-dialog v-model="fixedDialog">
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">{{ dialogJSON.title }}</div>
                      </q-card-section>

                      <q-separator />

                      <q-card-section v-if="dialogJSON.message" style="width: 50vh;">
                        <ul>
                          <li v-for="(val, ind) in dialogJSON.message" :key="ind">
                            {{ val }}
                          </li>
                        </ul>
                      </q-card-section>

                      <q-card-section v-else style="width: 50vh;">
                        <p>N/A</p>
                      </q-card-section>

                      <q-separator />

                      <q-card-actions align="right">
                        <q-btn flat label="Close" color="primary" v-close-popup />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>
              </div>

              <q-inner-loading :showing="!Boolean(challengeImagePath)">
                <q-spinner-gears size="50px" color="primary" />
              </q-inner-loading>
            </q-tab-panel>

            <!-- TODO: FUTURE UPDATE -->
            <q-tab-panel name="logs">
              <Banner
                :bannerObj="bannerObj"
              />

              <div
                v-if="data"
                align="center"
                class="shadow-2"
                style="
                  margin: auto;
                  max-width: 1000px;
                  min-width: 800px;
                  border-radius: 3px;
                "
              >
                <div
                  v-if="Array.isArray(data.logs) && data.logs.length > 0"
                  class="q-pa-md q-gutter-sm"
                >
                  <div
                    v-for="(val, ind) in data.logs"
                    :key="ind"
                  >
                    <div
                      v-if="!val.hidden"
                      align="left"
                      class="shadow-2 q-pa-sm"
                      style="border-radius: 3px;"
                    >
                      <div
                        v-ripple
                        class="relative-position cursor-pointer"
                      >
                        {{ val.title }}
                      </div>

                      <div
                        v-if="val.description"
                        class="q-pa-sm"
                      >
                        <pre>{{ val.description }}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else>
                  No log currently available...
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="attachments">
              <div
                class="shadow-2 q-pa-md"
                style="
                  margin: auto;
                  max-width: 1000px;
                  min-width: 800px;
                  border-radius: 3px;
                "
              >
                <div class="text-h5 q-mb-md">
                  Attachments
                  <q-separator color="secondary" />
                </div>

                <li
                  v-for="(val, key, ind) in data.files"
                  :key="ind"
                  class="row q-ma-sm"
                >
                  <div class="col">
                    {{ key }}
                  </div>

                  <q-space></q-space>

                  <div class="col q-gutter-sm" align="right">
                    <q-btn
                      v-if="
                        val.toLowerCase().includes('.jpg') ||
                        val.toLowerCase().includes('.jpeg') ||
                        val.toLowerCase().includes('.png') ||
                        val.toLowerCase().includes('.pdf')
                      "
                      round dense flat
                      icon="image_search"
                      @click="fetchAttachmentURLAndOpen(val, 'challenges')"
                    />

                    <q-btn
                      round dense flat
                      icon="get_app"
                      @click="downloadAttachment(key, val, 'challenges')"
                    />
                  </div>
                </li>

                <div
                  v-if="!data || !data.files || !Object.keys(data.files).length"
                  class="q-ml-sm"
                >
                  No attachments to display.
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="projects">
              <Banner
                :bannerObj="bannerObj"
              />

              <div
                class="shadow-2 q-pa-md"
                style="
                  margin: auto;
                  max-width: 1000px;
                  min-width: 800px;
                  border-radius: 3px;
                "
              >
                <!-- Project Table Goes Here -->
                <ProjectTable
                  :viewProjectList="data.projects"
                  :childDb="db"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>

      </q-splitter>
    </div>

  </q-page>
</template>

<script>
import { defaultImages, layoutConfig } from '../../boundless.config'

import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'

import Banner from '../components/Banners/Banner'
import ProjectTable from '../components/Tables/ProjectTable'
import MarkdownTranslator from '../components/MarkdownTranslator'

import NotFound from './NotFound'

export default {
  components: {
    NotFound,
    Banner,
    ProjectTable,
    MarkdownTranslator
  },
  async created () {
    try {
      // fetch data from database
      await this.loadFireRefs()
      // TODO: work on loadInformation last
      await this.loadInformation()

      // get the layout information from session cache
      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
        this.layoutConfig = layoutConfig

        if (typeof cachedConfig.enabledChallenges === 'boolean') {
          this.layoutConfig.challenges = cachedConfig.enabledChallenges
        }
      } else {
        this.layoutConfig = layoutConfig
      }

      if (!this.layoutConfig.challenges) {
        this.$router.push('/err')
      }

      this.setPageTab()
    } catch (error) {
      throw error
    }
  },
  beforeUpdate () {
    this.setPageTab()

    this.$q.sessionStorage.set('boundless_page_info', {
      key: this.challengeId,
      data: this.data
    })
  },
  beforeDestroy () {
    this.$q.sessionStorage.remove('boundless_page_info')
  },
  data () {
    return {
      db: null, // <Object>: firebase firestore credentials
      storage: null, // <Object>: firebase storage credentials
      layoutConfig: null,
      bannerObj: { // <Object>: default banner information
        // path <String>: file path of the default image
        path: `../statics/${defaultImages.challenges.webBanner}`,
        ratio: '8', // <String>: ratio of the banner
        type: 'webpage', // <String>: type of the banner
        category: 'challenges' // <String>: category of the banner
      },
      challengeImagePath: '', // <String>: url of the main image
      mainImgBgColor: 'black', // <String>: background color of main image
      fixedDialog: false, // <Boolean>: trigger for chip pop-up dialog
      dialogJSON: { // <Object>: information to display inside chip pop-up
        title: '', // <String>: label of the chip
        message: '' // <String>: message of the chip
      },
      extraSponsorInfo: { // <Object>: extra information regarding sponors
        img: {} // <Map>: dictionary of sponsor uid to avatar image
      },
      // challengeId <String>: UID of the challenge
      challengeId: this.$route.params.challenge_id,
      loading: true, // <Boolean>: flag for the page loading
      data: {}, // <Object>: webpage information regarding the specifc challenge
      notFound: false, // <Boolean>: flag for 404
      pageTab: '', // <String>: tab tracker for the webpage
      splitterModel: 15, // <Number>: % of vw that left splitter is located
      priorityGague: { // <Object>: data for knob animation
        // val <Array<Integer>>: the values of the possible angles
        val: [0, 90, 180, 270],
        // color <Array<String>>: the color of the knob
        color: ['green', 'green', 'yellow-8', 'red'],
        // text <Array<String>>: the display text of the knob
        text: ['Null', 'Long', 'Med', 'Short']
      }
    }
  },
  methods: {
    downloadAttachment: async function (alias, pathToFile, type) {
      /**
       * fetches the download url then download the file for the client
       * @param {String} alias: shown filename on the web
       * @param {String} pathToFile: file path on the cloud storage
       * @param {String} type: type of the collection inside storage
       * @return {Promise<Boolean>}
       */

      try {
        let url = await this.storage.ref().child(
          `${type}/${pathToFile}`
        ).getDownloadURL()

        let res = await fetch(url)
        let blob = await res.blob()

        let extension = pathToFile.split('.').pop()

        let a = document.createElement('a')
        a.style = 'display: none'

        let bUrl = URL.createObjectURL(blob)
        a.href = bUrl
        a.download = `${alias}.${extension}`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(bUrl)
        document.body.appendChild(a)

        return true
      } catch (error) {
        this.$q.notify({
          message: 'File is either broken or missing!',
          position: 'bottom',
          timeout: 2000,
          color: 'negative',
          textColor: 'white',
          icon: 'warning',
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })

        return false
      }
    },
    fetchAttachmentURLAndOpen: async function (pathToFile, type) {
      /**
       * fetches the attachment url and open the url on a new tab
       * params:
       * @param {String} pathToFile: path to file
       * @param {String} type: collection type
       * @return {Promise<Boolean>}
       */

      try {
        let url = await this.storage.ref().child(
          `${type}/${pathToFile}`
        ).getDownloadURL()

        window.open(url, '_blank', 'noopener')

        return true
      } catch (error) {
        this.$q.notify({
          message: 'File is either broken or missing!',
          position: 'bottom',
          timeout: 2000,
          color: 'negative',
          textColor: 'white',
          icon: 'warning',
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })

        return false
      }
    },
    setPageTab: function () {
      /**
       * assigns challenge route extension to this.pageTab
       * @param {void}
       * @return {void}
       */

      if (this.$route.params.extraRoute === 'logs') {
        this.pageTab = 'logs'
      } else if (this.$route.params.extraRoute === 'projects') {
        this.pageTab = 'projects'
      } else {
        this.pageTab = 'main'
      }
    },
    replyLog: function (familyIndex, responseObj) {
      /**
       * allow the user to reply to a log and notifies user on fail
       * @param {Integer} familyIndex: index number on the log list
       * @param {Object} responseObj: the targetted response
       * @return {void}
       */

      this.$q.dialog({
        dark: true,
        title: 'Response...',
        message: '<strong>Please enter your response.</strong><br><br><p class="text-red">Note: Your response cannot be empty!</p>',
        html: true,
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let tmpLog = {
            title: `In response to: "${responseObj.title}"!`,
            date: Date(),
            description: `>>>>>>>>>>\n${responseObj.description}\n>>>>>>>>>>\n${data}`,
            hidden: false
          }

          // let size = this.curData.logs[familyIndex].data.length

          this.data.logs[familyIndex].data.push(tmpLog)
          // let size = this.curData.logs[index].data.length
          // this.updated = true

          this.$forceUpdate()

          this.db.collection('challenges').doc(this.data.uuid).set({
            logs: this.data.logs
          }, { merge: true })
        } else {
          this.$q.notify({
            message: 'Not a valid response!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      }).onCancel(() => {
        // nothing goes here
      }).onDismiss(() => {
        // nothing goes here
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
              this.storage = testingStorage
              this.$q.localStorage.set('boundless_db', 'testing')
            } else {
              this.db = productionDb
              this.storage = productionStorage
              this.$q.localStorage.set('boundless_db', 'production')
            }

            return true
          } else {
            let msg = '"/config/project" path does not exists!'

            throw new Error(msg)
          }
        } catch (error) {
          this.db = productionDb
          this.storage = productionStorage
          this.$q.localStorage.set('boundless_db', 'production')

          return false
        }
      }
    },
    updateId: function () {
      /**
       * update this.challengeId depending on route object load the webpage
       * information from cache if the information are already presented
       * @param {void}
       * @return {void}
       */

      this.challengeId = this.$route.params.challenge_id

      if (this.$q.sessionStorage.has('boundless_page_info')) {
        let storageData = this.$q.sessionStorage.getItem('boundless_page_info')
        if (storageData.key === this.challengeId) {
          this.data = storageData.data
        } else {
          this.loadInformation()
        }
      } else {
        this.loadInformation()
      }
    },
    loadInformation: async function () {
      /**
       * loading all the required information regarding the uid provided,
       * and check for alias table to see if the alias can be mapped to uid
       * @param {void}
       * @return {Promise<Boolean>}
       */

      // start loading
      this.loading = true

      try {
        // return the promise to check for alias
        let doc = await this.db.collection('challenges').doc('ToC').get()
        let errMsg
        let res

        if (doc.exists) {
          if (
            doc.data().alias &&
            doc.data().alias.hasOwnProperty(this.challengeId)
          ) {
            let actualUid = doc.data().alias[this.challengeId]

            res = doc.data()[actualUid]
          } else if (doc.data().hasOwnProperty(this.challengeId)) {
            res = doc.data()[this.challengeId]
          } else {
            errMsg = 'UUID nor the ALIAS exists!'

            throw new Error(errMsg)
          }
        } else {
          errMsg = 'ToC does not exists!'

          throw new Error(errMsg)
        }

        doc = await this.db.collection('challenges').doc(res.uuid).get()

        if (doc.exists) {
          for (let objField in res) {
            this.data[objField] = res[objField]
          }

          for (let objField in doc.data()) {
            this.data[objField] = doc.data()[objField]
          }

          this.sortBody()
          this.sortChip()

          if (!this.data.webpage.imgURL) {
            this.challengeImagePath = await this.getMainPhoto()
          } else {
            try {
              let url = await this.storage.ref().child(
                this.data.webpage.imgURL
              ).getDownloadURL()

              this.challengeImagePath = url
            } catch (error) {
              this.challengeImagePath = await this.getMainPhoto()
            }
          }

          if (this.data.webpage.imgBgColor) {
            this.mainImgBgColor = this.data.webpage.imgBgColor
          }
        } else {
          errMsg = 'Webpage information are corrupted!'

          throw new Error(errMsg)
        }

        // handling old user mapping
        let tmpSponsors = []

        if (this.data.sponsors[0].email) {
          // handling old data
          this.data.sponsors.forEach(sponsor => {
            tmpSponsors.push({
              uuid: sponsor.uuid || sponsor.email
            })
          })

          this.data.sponsors = tmpSponsors
          tmpSponsors = []
        }
        let correctionReq = false // bool to check if data correction req
        let uuidList = [] // list to correct data in db

        // handling new data
        doc = await this.db.collection('users').doc('ToC').get()

        if (doc.exists) {
          this.data.sponsors.forEach(sponsor => {
            // check if sponsor.uuid return empt user
            if (!doc.data()[sponsor.uuid]) {
              // hard check if the user is not in db
              for (let userUid in doc.data()) {
                if (doc.data()[userUid].email === sponsor.uuid) {
                  tmpSponsors.push({
                    ...doc.data()[userUid]
                  })
                  uuidList.push({
                    uuid: userUid
                  })

                  correctionReq = true
                  break
                }
              }
            } else {
              tmpSponsors.push({
                ...doc.data()[sponsor.uuid]
              })
              uuidList.push({
                uuid: sponsor.uuid
              })
            }
          })

          this.data.sponsors = tmpSponsors

          if (correctionReq) {
            await this.db.collection('challenges').doc('ToC').set({
              [this.data.uuid]: {
                sponsors: uuidList
              }
            }, { merge: true })
          }
        } else {
          errMsg = 'Webpage information are corrupted!'

          throw new Error(errMsg)
        }

        this.data.sponsors.forEach(async sponsor => {
          if (sponsor.imgURL) {
            try {
              let url = await this.storage.ref().child(
                sponsor.imgURL
              ).getDownloadURL()

              this.extraSponsorInfo.img[sponsor.imgURL] = url
            } catch (error) {
              this.extraSponsorInfo.img[sponsor.imgURL] = ''
            }
          }
        })

        setTimeout(() => {
          this.loading = false

          return true
        }, 300)
      } catch (error) {
        setTimeout(() => {
          this.notFound = true

          return false
        }, 1500)
      }
    },
    popDialog: function (entry) {
      /**
       * allow the dialog to pop-up when the chip other than
       * 'Copy URL' is clicked
       * @param {String} entry: name of the member to access
       * @return {void}
       */

      if (entry === 'awards') {
        this.dialogJSON['title'] = 'Impact Awards'
      } else {
        this.dialogJSON['title'] = entry.charAt(0).toUpperCase() + entry.slice(1)
      }
      this.dialogJSON['message'] = this.data[entry]
      this.fixedDialog = true
    },
    getMainPhoto: async function () {
      /**
       * get the path of the main photo of the challenge
       * @param {void}
       * @return {Promise<String>}
       */

      let val = `statics/images/computer-keyboard.jpg`

      if (this.$q.sessionStorage.has('boundless_config')) {
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        if (
          storedConfig && storedConfig.challengesConfig &&
          storedConfig.challengesConfig.webpage &&
          storedConfig.challengesConfig.webpage.mainImg.url &&
          storedConfig.challengesConfig.webpage.mainImg.active
        ) {
          try {
            val = await this.storage.ref().child(
              storedConfig.challengesConfig.webpage.mainImg.url
            ).getDownloadURL()
          } catch (error) {
            val = storedConfig.challengesConfig.webpage.mainImg.url
          }
        }
      }

      return val
    },
    sortBody: function () {
      /**
       * sort the content of this.data.webpage.body in order by index field
       * @param {void}
       * @return {void}
       */

      this.data.webpage.body.sort((a, b) => {
        return a.index - b.index
      })

      this.data.webpage.body.forEach(webContent => {
        if (webContent.content.type === 'ORDERED_LIST') {
          webContent.content.list.sort((a, b) => {
            return a.index - b.index
          })
        }
      })
    },
    sortChip: function () {
      /**
       * sort the content of this.data.webpage.chips in order by index field
       * @param {void}
       * @return {void}
       */

      this.data.webpage.chips.sort((a, b) => {
        return a.index - b.index
      })
    },
    copyURLtoClipboard: function () {
      /**
       * https://stackoverflow.com/questions/6725890/location-host-vs-location-hostname-and-cross-browser-compatibility
       * copy the current url onto the clipboard
       * @param {void}
       * @return {void}
       */

      if (!window.location.origin) {
        window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '')
      }

      let routeData = window.location.origin + '/' + this.$router.resolve('', this.$route).href
      this.copyTextToClipboard(routeData)

      this.$q.notify({
        message: 'The URL has been copied to the clipboard.',
        position: 'top',
        timeout: 2000,
        color: 'positive',
        textColor: 'white',
        actions: [
          {
            icon: 'close',
            color: 'white'
          }
        ]
      })
    },
    fallbackCopyTextToClipboard: function (entry) {
      /**
       * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
       * fall back url copy to clipboard if not hosted on https
       * @param {void}
       * @return {void}
       */

      let textArea = document.createElement('textarea')
      textArea.value = entry
      document.body.prepend(textArea)
      // textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (err) {
        if (err) {
          // error
        }
      }

      document.body.removeChild(textArea)
    },
    copyTextToClipboard: function (entry) {
      /**
       * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
       * logic handler to call either fallback or built-in
       * @param {String} entry: current url
       * @return {void}
       */

      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(entry)
      } else {
        navigator.clipboard.writeText(entry)
      }
    },
    openNewTab: function (entry) {
      /**
       * open new tab given a link
       * @param {String} entry: url of the link
       * @return {void}
       */

      window.open(entry, '_blank', 'noopener')
    }
  },
  watch: {
    $route: 'updateId'
  }
}
</script>

<style lang="stylus" scoped>
.project-img {
  border: 3px solid #ddd;
  border-radius: 4px;
  padding: 5px
}

ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "\25A0";       // Add content: \25A0 is the CSS Code/unicode for a block bullet
  color: $secondary;      // Set the color
  font-weight: bold;
  display: inline-block;  // add space between the bullet and the text
  width: 1em; // space between bullet and text
  margin-left: -2em; // space between bullet and margin
}
</style>
