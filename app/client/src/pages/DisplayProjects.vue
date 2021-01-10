<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software
## distributed under the License is distributed on an "AS IS" BASIS,
## WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

Name:     pages/DisplayProjects.vue
Purpose:  Display the short summary of of all projects in a table
Methods:
  * Filters projects via string matching
  * Searchbar for filter param
  * Dropbox for filter param
  * Clickable icons for filter param
  * Redirect to individual project

## -->

<template>
  <q-page class="q-pa-lg" style="min-width: 620px;">
    <!-- -------------------- Page Loader -------------------- -->
    <div v-if="loading" class="absolute-center">
      <q-spinner color="primary" size="8em" />
    </div>

    <div v-else>
      <Banner :bannerObj="bannerObj" />

      <div
        align="center" class="text-caption text-italic"
        style="font-size: 18px;"
      >
        List of Employee Proposed Projects, Ideas, and Explorations
      </div>

      <!-- --------------- By The Numbers on Project Display --------------- -->
      <div class="q-pa-sm q-mb-sm">
        <div class="row" align="center">

          <div
            class="col"
            @click="filter = ''"
          >
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ projectList.length }}
            </strong>
            <br>
            <strong>Projects</strong>
            <br>
            <q-img
              class="cursor-pointer"
              src="../statics/images/projects-icon.png"
              style="height: 40px; max-width: 45px"
            />
          </div>

          <div class="col">
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ memberList.length }}
            </strong>

            <br>

            <strong>Innovators</strong>

            <br>

            <q-img
              src="../statics/images/innovator-icon.png"
              style="height: 40px; max-width: 45px"
            />
          </div>

          <div
            v-for="(key, ind) in keywordsInUse"
            :key="ind"
            class="col" @click="filter = key"
          >
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ keywordCounts[key] ? keywordCounts[key] : 0 }}
            </strong>

            <br>

            <strong>{{ keywordsValToKeyMap[key] }}</strong>

            <br>

            <img
              class="cursor-pointer"
              :src="keywordsImage[key] || '../statics/images/other-icon.png'"
              style="height: 40px; max-width: 45px"
            />
          </div>

          <div
            v-for="(val, valInd) in (6 - keywordsInUse.length)"
            :key="keywordsInUse.length + valInd"
            class="col"
          >
            <!-- PLACEHOLDING FOR THE BANNER -->
          </div>

        </div>
      </div>

      <!-- -------------------- Project Display Table -------------------- -->
      <q-table
        binary-state-sort
        class="my-sticky-header-table"
        row-key="project"
        :data="projectList"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right>

          <q-toolbar>
            <q-btn
              round dense flat
              class="q-mr-xs" icon="menu"
            >
              <q-menu dense>
                <q-list
                  v-for="(keyword, index) in popkeywords"
                  :key="index"
                  style="min-width: 100px"
                >
                  <q-item clickable v-close-popup dense>
                    <q-item-section @click="filter = keyword.value">
                      {{ keyword.label }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-btn>

            <q-space />

            <q-input
              dense
              debounce="300"
              color="primary" placeholder="keyword search"
              style="min-width: 400px;"
              v-model="filter"
            >
              <template v-slot:append>
                <q-icon v-if="filter === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
              </template>
            </q-input>
          </q-toolbar>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="font-size: 18px; font-weight: normal;"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props" >
          <q-tr :props="props">
            <!-- Project 'new' column (date) -->
            <q-td
              key="new"
              :props="props"
            >
              <q-icon
                v-if="todayDate <= (props.row.created ? props.row.created.substring(0, 10) : props.row.timestamp.substring(0, 10))"
                name="fiber_new"
                color="accent"
                size="2.5em"
              />
              <div hidden>
                {{ joinKeywords(props.row.keywords) }}
              </div>
            </q-td>
            <!-- Project name column -->
            <q-td
              key="project"
              :props="props">
              <p>{{ props.row.project }}</p>
            </q-td>
            <!-- Description column -->
            <q-td
              key="description"
              :props="props"
              style="max-width: 300px; min-width: 220px;"
            >
              <div class="row">
                <p
                  class="col"
                  align="left"
                >
                  {{ props.row.description }}
                </p>

                <div
                  :hidden="!(props.row.description.length > 60)"
                  class="col-1"
                >
                  <div
                    class="text-blue cursor-pointer q-mx-sm"
                    @click="popDialog(props.row.description)"
                  >
                    [more]
                  </div>
                </div>
              </div>
            </q-td>
            <!-- Progress bar column -->
            <q-td key="progress"
              :props="props"
            >
              <ProgressBar
                :progressBar="progressBar"
                :progress="props.row.progress"
              />
            </q-td>
            <!-- Lead members column -->
            <q-td
              key="members"
              :props="props"
              style="max-width: 90px; overflow: hidden;"
            >
              <div align="left">
                {{ displayMembers(props.row.members) }}
              </div>
            </q-td>
            <!-- Details column -->
            <q-td
              auto-width
              key="url"
              :props="props"
            >
              <q-chip
                dense
                clickable
                @click="displayProjectPage(props.row.alias || props.row.uuid)"
                color="info"
                text-color="white"
                label="more"
              />
            </q-td>

          </q-tr>
        </template>

      </q-table>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="fixedDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Project Description</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="height: 40vh; overflow: auto">
            <p>
              {{ rowMessage }}
            </p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

  </q-page>
</template>

<script>
import { defaultImages } from '../../boundless.config'
import isFirebaseError from '../../src/errors/isFirebaseError'

import { productionStorage } from '../firebase/init_production'
import { testingStorage } from '../firebase/init_testing'
import { createNamespacedHelpers } from 'vuex'
// Ensures mapActions and mapGetters can only use the 'store/project-submit' module.
const { mapGetters } = createNamespacedHelpers('projectDisplay')

import Banner from '../components/Banners/Banner'
import ProgressBar from '../components/ProgressBar'

export default {
  components: {
    Banner,
    ProgressBar
  },
  computed: {
    ...mapGetters([
      'projectTocPromise',
      'projectConfigPromise',
      'userTocPromise'
    ])
  },
  async created () {
    // fetches data from database
    await this.loadFireRefs()
    await this.loadConfig()
    await this.loadProjectList()
    this.loadProgressBarConf()

    this.keywordsInUse = this.keywordsInUse.filter(
      v => v in this.keywordsValToKeyMap
    )
  },
  beforeUpdate () {
    this.loadProgressBarConf()
  },
  data () {
    return {
      db: null, // <Object>: firebase firestore credentials
      storage: null, // <Object>: firebase storage credentials
      bannerObj: { // <Object>: default banner information
        // path <String>: file path of the default image
        path: `../statics/${defaultImages.projects.tableBanner}`,
        ratio: '8', // <String>: ratio of the banner
        type: 'table', // <String>: type of the banner
        category: 'projects' // <String>: category of the banner
      },
      userToC: {}, // <Map<Object>>: ToC content of user collection
      memberList: [], // <Array<String>>: list of emails
      // keywords <Array<String>>: list of keywords appearing in all projects
      keywords: [],
      keywordsInUse: [], // <Array<String>>: list of keywords in use
      keywordCounts: {}, // <Map>: map of how many times each keywords appear
      keywordsValToKeyMap: {}, // <Map>: map of value to key of keywords
      keywordsImage: {}, // <Map>: map of keyword's images
      popkeywords: [], // <Array<Object>>: dropdown menu values
      todayDate: '', // <Date>: today's date
      rowMessage: '', // <String>: description of the project to be displayed
      fixedDialog: false, // <Boolean>: trigger for pop-up dialog
      filter: '', // <String>: value of the search
      loading: true, // <Boolean>: flag for the page loading
      projectList: [], // <Array<Object>>: list of all the projects in ToC
      pagination: { // <Object>: pagination object for the table
        sortBy: 'new', // <String>: name of the column to be sorted
        rowsPerPage: 50 // <Integer>: numbers of projects to display by default
      },
      // columns <Array<Object>>: column layout of the display table
      columns: [
        {
          name: 'new',
          label: 'New',
          field: row => row.created || row.timestamp,
          align: 'center',
          sortable: true,
          sort: (a, b) => (b > a) ? 1 : ((a > b) ? -1 : 0),
          headerClasses: 'project-new-col',
          classes: 'project-new-col'
        },
        {
          name: 'project',
          required: true,
          label: 'Project Name',
          align: 'center',
          field: row => row.project,
          format: val => `${val}`,
          sortable: true,
          headerClasses: 'project-name-col',
          classes: 'project-name-col'
        },
        {
          name: 'description',
          align: 'center',
          label: 'Description',
          field: row => row.description,
          headerClasses: 'project-description-col',
          classes: 'project-description-col'
        },
        {
          name: 'progress',
          align: 'center',
          label: 'Progress',
          field: row => row.progress,
          format: val => `${val}`,
          sortable: true,
          headerClasses: 'progress-bar-col',
          classes: 'progress-bar-col'
        },
        {
          name: 'members',
          align: 'center',
          label: 'Lead(s)',
          field: row => this.displayMembers(row.members),
          headerClasses: 'lead-members-col',
          classes: 'lead-members-col'
        },
        {
          name: 'url',
          align: 'center',
          label: 'Details',
          field: row => row.keywords
        }
      ],
      progressBar: { // <Object>: default object of the progress bar
        // <Array<String>>: list of default values for the progress bar
        tags: ['Idea', 'PoC', 'Value'],
        half: true // <Boolean>: flag for the half step
      }
    }
  },
  methods: {
    loadProgressBarConf: function () {
      /**
       * loads progress bar configuration from session cache
       * @param {void}
       * @return {void}
       */

      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

        if (cachedConfig.projectsConfig.progressBar) {
          this.progressBar = cachedConfig.projectsConfig.progressBar
        }
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
          this.storage = testingStorage
        } else {
          this.storage = productionStorage
        }

        return true
      } else {
        try {
          let doc = await this.projectConfigPromise
          if (doc.exists) {
            if (doc.data().db === 'testing') {
              this.storage = testingStorage
              this.$q.localStorage.set('boundless_db', 'testing')
            } else {
              this.storage = productionStorage
              this.$q.localStorage.set('boundless_db', 'production')
            }

            return true
          } else {
            throw new Error('Required document not found!')
          }
        } catch (error) {
          this.storage = productionStorage
          this.$q.localStorage.set('boundless_db', 'production')

          throw error
        }
      }
    },
    displayProjectPage: function (entry) {
      /**
       * either route push to the project page or open new window
       * @param {String} entry: uuid or the alias of the project
       * @return {void}
       */

      const eventHandler = (e, entry) => {
        if (e.ctrlKey) {
          let routeData = this.$router.resolve(`project/${entry}`, '/')
          window.open(routeData.href, '_blank', 'noopener')
        } else {
          this.$router.push(`/project/${entry}`)
        }
      }

      // calling the event handler
      eventHandler(event, entry)
    },
    displayMembers: function (entry) {
      /**
       * create a list of members who are in charge of of the challenge
       * @param {Array<Object>} entry: list of member objects
       * @return {String}
       */

      let retMembers = ''

      entry.forEach(member => {
        if (member.role === 'lead') {
          if (member.email) {
            if (member) {
              retMembers += ', ' + member.name
            }
          } else {
            if (this.userToC[member.uuid]) {
              retMembers += ', ' + this.userToC[member.uuid].name
            }
          }
        }
      })

      return retMembers.substring(2, retMembers.length)
    },
    joinKeywords: function (entry) {
      /**
       * helper function to join keywords
       * @param {Array<String>} entry: string array with keywords to be
       *                               appended
       * @return {String}
       */

      return entry.join(', ')
    },
    popDialog: function (entry) {
      /**
       * trigger the description pop-up dialog
       * @param {String} entry: description of the challenge
       * @return {void}
       */

      this.fixedDialog = true
      this.rowMessage = entry
    },
    loadProjectList: async function () {
      /**
       * loads the list of all the projects from the db and
       * assign them to component states
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.projectTocPromise
        if (doc && doc.exists) {
          for (let project in doc.data()) {
            if (project !== 'alias') {
              if (!doc.data()[project].hidden) {
                // getting the project list
                this.projectList.push(doc.data()[project])

                // getting the innovator list
                if (doc.data()[project].members.length > 0) {
                  doc.data()[project].members.forEach(member => {
                    if (
                      member.email && !this.memberList.includes(member.email)
                    ) {
                      this.memberList.push(member.email)
                    } else if (
                      member.uuid && !this.memberList.includes(member.uuid)
                    ) {
                      this.memberList.push(member.uuid)
                    }
                  })
                }

                // getting the keywords
                if (doc.data()[project].keywords && doc.data()[project].keywords.length > 0) {
                  doc.data()[project].keywords.forEach(keyword => {
                    if (keyword in this.keywordCounts) {
                      this.keywordCounts[keyword] += 1
                    } else {
                      this.keywordCounts[keyword] = 1
                    }
                  })
                }
              }
            }
          }
        } else {
          throw new Error('ToC not found!')
        }

        doc = await this.userTocPromise

        if (doc.exists) {
          this.userToC = doc.data()
        } else {
          throw new Error('No ToC!')
        }

        this.loading = false

        return true
      } catch (error) {
        this.loading = false

        throw error
      }
    },
    /**
     * load the config from the db
     * TODO: this should be replaced since config/project is cached in session
     */
    loadConfig: async function () {
      let doc = await this.projectConfigPromise
      if (doc.exists) {
        let data = doc.data()

        // extracting keywords for the banner and dropdown filter
        // non-sorted to maintain order for now
        // let cachedKeywords = data.projectsConfig.keywords.sort()
        // let cachedKeywords = data.projectsConfig.keywords

        for (let key in data['keywords']) {
          this.popkeywords.push({
            label: key,
            value: data['keywords'][key]
          })

          this.keywordsValToKeyMap[data['keywords'][key]] = key

          // if (
          //   !cachedKeywords.includes(data['keywords'][key]) &&
          //   cachedKeywords.length < 5
          // ) {
          //   cachedKeywords.push(data['keywords'][key])
          // }
        }
        // this.keywordsInUse = cachedKeywords
        this.keywordsInUse = data.projectsConfig.keywords

        // make sure the database response has extraKeywordsData
        if (data.extraKeywordsData) {
          // loading the image url from extraKeywordsData
          let key = ''
          for (let prop in data.extraKeywordsData) {
            key = prop.toLowerCase()

            try {
              this.keywordsImage[key] = await this.storage.ref().child(
                data.extraKeywordsData[prop]
              ).getDownloadURL()
            } catch (error) {
              if (isFirebaseError(error, 'storage/object-not-found')) {
                console.error(error)
                this.keywordsImage[key] = '../statics/images/other-icon.png'
              } else {
                throw error
              }
            }
          }
        }

        if (typeof data['pagination'] === 'number') {
          this.pagination.rowsPerPage = data['pagination']
        }
        let expireDate = data.newFlag * 24 * 60 * 60 * 1000
        this.todayDate = new Date(Date.now() - expireDate)
        this.todayDate = this.todayDate.toISOString().substring(0, 10)
      } else {
        throw new Error('File not found!')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.project-new-col
  width 5%

.project-name-col
  font-weight bold
  text-align left // max width of max length name

// Hide name overflow
.project-description-col p,
.project-name-col p
  white-space nowrap
  overflow hidden
  text-overflow: ellipsis
  width 300px

.project-description-col
  width 40%

.progress-bar-col
  width 26%

.lead-members-col
  width 20%
  overflow-wrap break-word
  overflow normal

</style>
