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

Name:     components/Tables/ProjectTable.vue
Purpose:  Displays the projects related to the challenge on the individual
          challenge page
Methods:
  * Adds projects to challenge (admin)
  * Deletes projects from challenge (admin)
  * Filters projects via string matching
  * Redirect to individual project

## -->

<template>
  <q-page class="q-pa-lg" style="min-width: 620px;">
    <!-- -------------------- Page Loader -------------------- -->
    <div v-if="loading" class="absolute-center">
      <q-spinner color="primary" size="8em" />
    </div>

    <div v-else>
      <!-- -------------------- Project Display Table -------------------- -->
      <q-table
        class="my-sticky-header-table"
        :data="childProjectList"
        :columns="columns"
        row-key="project"
        :filter="filter"
        :loading="loading"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right>

          <q-toolbar>
            <q-btn
              dense flat round
              class="q-mr-xs" icon="menu"
            >
              <q-menu dense>
                <q-list
                  v-for="(keyword, index) in childKeywords"
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
              color="primary"
              v-model="filter"
              placeholder="keyword search"
              style="min-width: 400px;"
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

            <q-td
              key="new"
              :props="props"
              style="width: 95px;"
            >
              <q-icon
                v-if="todayDate <= props.row.timestamp.substring(0, 10)"
                name="fiber_new"
                color="accent"
                size="2.5em"
              />
              <div hidden>
                {{ joinKeywords(props.row.keywords) }}
              </div>
            </q-td>

            <q-td key="project" :props="props">
              <div align="left">
                <q-btn
                  v-if="tableMode === 'edit'"
                  dense round color="accent"
                  size="sm" icon="delete" class="q-mr-xs"
                  @click="emitDeleteProject(props.row.project)"
                />
                <b>{{ props.row.project }}</b>
              </div>
            </q-td>

            <q-td
              key="description"
              :props="props"
              style="max-width: 300px; min-width: 220px;"
            >
              <div class="row">
                <div
                  class="col"
                  ref="descriptionDiv"
                  @click="popDialog(props.row.description)"
                  align="left"
                  style="overflow: hidden;"
                >
                  {{ props.row.description }}
                </div>
                <div class="col-2" :hidden="!(props.row.description.length > 40)">
                  <div
                    class="text-blue cursor-pointer"
                    @click="popDialog(props.row.description)"
                  >
                    &nbsp;&nbsp;[more]
                  </div>
                </div>
              </div>
            </q-td>

            <q-td key="progress" :props="props">
              <div
                style="
                  min-width: 150px;
                  max-width: 250px;
                  border: solid 1px;
                  border-color: #d0d7e2;
                "
              >
                <ProgressBar
                  :progressBar="progressBar"
                  :progress="props.row.progress"
                />
              </div>
            </q-td>

            <q-td
              key="members"
              :props="props"
              style="max-width: 150px; overflow: hidden;"
            >
              <div align="left">
                {{ displayMembers(props.row.members) }}
              </div>
            </q-td>

            <q-td key="url" :props="props">
              <q-chip
                :disable="tableMode === 'edit'"
                dense clickable
                @click="displayProjectPage(props.row.uuid)"
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

          <q-card-section style="width: 50vh; height: 40vh; overflow: auto">
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
import ProgressBar from '../ProgressBar'

export default {
  props: {
    userId: String, // used by EditUser
    childDb: Object, // used by ViewChallenge
    tableMode: String, // used by AdminConsole
    viewProjectList: Array, // used by ViewChallenge
    projectList: Array // used by AdminConsole
  },
  components: {
    ProgressBar
  },
  created () {
    // fetching required data for component creation hook
    this.loadProgressBarConf()

    if (this.userId) {
      this.loadUserProjectList()
    } else {
      if (this.viewProjectList) {
        this.loadChildProjectList()
      } else {
        this.refactorProjectList()
      }
      this.loadConfig()
    }
  },
  data () {
    return {
      childProjectList: [], // <Array<Object>>: list of all the projects in ToC
      // childKeywords <Array<String>>: list of keywords appearing in all
      //                                projects
      childKeywords: [],
      todayDate: '', // <Date>: today's date
      rowMessage: '', // <String>: description of the project to be displayed
      fixedDialog: false, // <Boolean>: trigger for pop-up dialog
      filter: '', // <String>: value of the search
      loading: true, // <Boolean>: flag for the page loading
      pagination: { // <Object>: pagination object for the table
        sortBy: 'new', // <String>: name of the column to be sorted
        rowsPerPage: 50 // <Integer>: numbers of projects to display by default
      },
      // columns <Array<Object>>: column layout of the display table
      columns: [
        {
          name: 'new',
          label: 'New',
          field: row => row.timestamp,
          align: 'center',
          sortable: true,
          sort: (a, b) => (b > a) ? 1 : ((a > b) ? -1 : 0)
        },
        {
          name: 'project',
          required: true,
          label: 'Project Name',
          align: 'center',
          field: row => row.project,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'description',
          align: 'center',
          label: 'Description',
          field: row => row.description
        },
        {
          name: 'progress',
          align: 'center',
          label: 'Progess',
          field: row => row.progress,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'members',
          align: 'center',
          label: 'Lead(s)',
          field: row => row.members,
          format: val => {
            let membersRetVal = ''
            val.forEach(entry => {
              if (entry.role === 'lead') {
                membersRetVal += entry.name + ', '
              }
            })
            return membersRetVal.substring(0, membersRetVal.length - 2)
          },
          sortable: true
        },
        {
          name: 'url',
          align: 'center',
          label: 'Details',
          field: row => row.keywords
        }
      ],
      progressBar: { // <Object>: default object of the progress bar
        // tags <Array<String>>: list of default values for the progress bar
        tags: ['Idea', 'PoC', 'Value'],
        half: true // <Boolean>: flag for the half step
      }
    }
  },
  methods: {
    loadProgressBarConf: function () {
      /*
      // loads progress bar configuration from session cache
      // params: <void>
      // return: <void>
      */

      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

        if (cachedConfig.projectsConfig.progressBar) {
          this.progressBar = cachedConfig.projectsConfig.progressBar
        }
      }
    },
    loadUserProjectList: async function () {
      /*
      // loads the list of projects which are associated with the user only
      // params: <void>
      // return: <Promise<Boolean>>
      */

      try {
        let doc = await this.childDb.collection('projects').doc('ToC').get()

        // this code is temporary since the data will morph
        if (doc.exists) {
          for (let project in doc.data()) {
            if (project !== 'alias') {
              doc.data()[project].members.forEach(member => {
                if (member.email === this.userId) {
                  this.childProjectList.push(doc.data()[project])
                }
              })
            }
          }
        } else {
          throw new Error('No document named ToC inside the collection.')
        }

        setTimeout(() => {
          this.loading = false

          return true
        }, 300)
      } catch (error) {
        return false
      }
    },
    loadChildProjectList: async function () {
      /*
      // loads the list of all the projects from the db and
      // assign them to component states
      // params: <void>
      // return: <Promise<Boolean>>
      */

      try {
        let doc = await this.childDb.collection('projects').doc('ToC').get()

        if (doc.exists) {
          this.viewProjectList.forEach(uid => {
            this.childProjectList.push(doc.data()[uid])
          })
        } else {
          throw new Error('No document named ToC inside the collection.')
        }

        setTimeout(() => {
          this.loading = false

          return true
        }, 300)
      } catch (error) {
        return false
      }
    },
    loadConfig: async function () {
      /*
      // load the config from the db
      // TODO: this should be replaced since config/project is cached in session
      // params: <void>
      // return: <Promise<Boolean>>
      */

      try {
        let doc = await this.childDb.collection('config').doc('project').get()

        if (doc.exists) {
          let data = doc.data()

          for (let key in data['keywords']) {
            this.childKeywords.push({
              label: key,
              value: data['keywords'][key]
            })
          }

          if (typeof data['pagination'] === 'number') {
            this.pagination.rowsPerPage = data['pagination']
          }

          let expireDate = data.newFlag * 24 * 60 * 60 * 1000
          this.todayDate = new Date(Date.now() - expireDate)
          this.todayDate = this.todayDate.toISOString().substring(0, 10)

          return true
        } else {
          throw new Error('File not found!')
        }
      } catch (error) {
        return false
      }
    },
    emitDeleteProject: function (entry) {
      /*
      // emit 'deleted' event to the parent
      // params:
      //    @entry <Object>: record of the project
      // return: <void>
      */

      this.$emit('deleted', entry)
    },
    refactorProjectList: function () {
      let tmpList = []

      if (this.projectList) {
        this.projectList.forEach(project => {
          tmpList.push(project.value)
        })
      }

      this.childProjectList = tmpList

      this.loading = false
    },
    displayProjectPage: function (entry) {
      /*
      // either route push to the project page or open new window
      // params:
      //    @entry <String>: uuid or the alias of the project
      // return: <void>
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
      /*
      // create a list of members who are in charge of of the challenge
      // params:
      //    @entry <Array<Object>>: list of member objects
      // return: <String>
      */

      let retMembers = ''

      entry.forEach(member => {
        if (member.role === 'lead') {
          retMembers += ', ' + member.name
        }
      })

      return retMembers.substring(2, retMembers.length)
    },
    joinKeywords: function (entry) {
      /*
      // helper function to join keywords
      // params:
      //    @entry <Array<String>>: string array with keywords to be appeneded
      // return: <String>
      */

      return entry.join(', ')
    },
    popDialog: function (entry) {
      /*
      // trigger the description pop-up dialog
      // params:
      //    @entry <String>: description of the challenge
      // return: <void>
      */

      this.fixedDialog = true
      this.rowMessage = entry
    }
  },
  watch: {
    projectList: 'refactorProjectList'
  }
}
</script>

<style lang="stylus">

</style>
