
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

Name:     components/Admin/Shared/AdminTable.vue
Purpose:  Display, edit, add, and delete challenge from the admin console
Methods:

  * Allows projects, challenges, or users to be added, deleted, or edited
  * Display the list of projects, challenges, or users in a table

## -->

<template>
  <q-page flat>
    <!-- -------------------- Main Content -------------------- -->
    <q-table
      flat wrap-cells binary-state-sort virtual-scroll
      color="secondary"
      :row-key="rowKey"
      :data="rowList"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      :pagination.sync="pagination"
      selection="multiple"
      :selected.sync="selected"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="90"
      class="table"
    >
      <template v-slot:top-left>

        <div class="row">
          <q-btn
            rounded
            color="accent"
            icon="add"
            :label="`Add ${capitalizeFirst(rowType)}`"
            @click="dialog = true; dialogOption = 'add'"
          />
          <transition name="fade">
            <q-btn
              flat rounded
              class="q-ml-sm"
              color="accent"
              icon="delete"
              key="delete"
              v-if="selected.length !== 0"
              @click="deleteSelected()">
              <q-tooltip>
                delete selection
              </q-tooltip>
            </q-btn>
          </transition>

          <transition name="fade">
            <q-btn
              flat rounded
              color="accent" icon="edit"
              v-if="selected.length === 1"
              @click="editRow()">
              <q-tooltip>
                edit a row
              </q-tooltip>
            </q-btn>
          </transition>

        </div>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            auto-width
            class="table-header">
            <q-checkbox v-model="props.selected"/>
          </q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="table-header"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <q-toolbar>
          <q-btn
            v-if="popkeywords.length > 0"
            dense flat round
            icon="menu"
            class="q-mr-xs"
          >
            <q-menu dense>
              <q-list
                v-for="(keyword, index) in popkeywords"
                :key="index"
                class="keyword-dropdown"
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
            debounce="300" color="primary" placeholder="Search"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon
                v-if="filter === ''"
                name="search"
              />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="filter = ''"
              />
            </template>
          </q-input>
        </q-toolbar>
      </template>

      <template v-slot:body="props">
        <q-tr
          :props="props"
          @click="selectRow(props.row)"
          class="body-table-row"
        >
          <q-td auto-width>
            <q-checkbox v-model="props.selected"/>
          </q-td>

          <!-- Invisible column for keyword searching. -->
          <q-td
            key="keywords"
            :props="props"
            invisible
          />

          <q-td
            key="name"
            :props="props"

          >
            <div align="left">
              {{ props.row[rowType] || props.row.name }}
            </div>
          </q-td>

          <q-td
            :key="middleColumn"
            :props="props"
          >
            <div align="center">
              {{ props.row[middleColumn] }}
            </div>
          </q-td>

          <q-td
            key="uuid"
            :props="props"
          >
            <div align="center">
              {{ props.row.uuid }}
            </div>
          </q-td>

          <q-td
            key="icons"
            :props="props"
          >
            <q-btn
              dense round flat
              color="secondary" icon="edit"
              @click.stop="editRow(props.row.uuid || props.row[rowKey])"
            />
          </q-td>

        </q-tr>
      </template>

    </q-table>
    <q-dialog
      persistent maximized
      transition-show="slide-up" transition-hide="slide-down"
      v-model="dialog"
    >
      <q-card>

        <q-card-section
          v-if="dialogOption === 'add'"
        >
          <component :is="getAddRowComponent"
            @added="updateAllRowsAndClose"
            @close="dialog = false"
          />
        </q-card-section>

        <q-card-section v-if="dialogOption === 'edit'">
          <br>
          <component :is="getEditRowComponent"
            :uuid="uuid"
            :emailSet="emailSet"
            @added="updateAllRows"
            @close="dialog = false"
          />
        </q-card-section>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import addChallenge from '../../../components/SubmitChallengeAdminConsole'
import editChallenge from '../../../components/EditAndPreviewChallenge'
import addProject from '../../../components/SubmitProjectAdminConsole'
import editProject from '../../../components/EditAndPreviewProject'
import addUser from '../../../components/SubmitUserAdminConsole'
import editUser from '../../../components/EditUser'

import productionDb, { proAppCall } from '../../../firebase/init_production'
import testingDb, { testAppCall } from '../../../firebase/init_testing'

export default {
  props: {
    // <String>: Whether this component displays projects, challenges, or users
    rowType: {
      type: String,
      required: true,
      validator: prop => [
        'challenge',
        'project',
        'user'
      ].includes(prop)
    },
    // <String>: Label name and row property name of the middle column.
    // see ManageChallenge.vue and this.columns for examples.
    middleColumn: {
      required: true,
      type: String
    },
    // <Boolean> Whether keywords are used. Keywords are currently only used for projects and challenges, not users.
    useLoadConfig: {
      type: Boolean,
      default: true
    },
    // <String> The name of the row key used by q-table. It is also used as an id when a row doesn't have a uuid.
    rowKey: {
      type: String,
      default: 'uuid'
    }
  },
  components: {
    addChallenge,
    addProject,
    addUser,
    editChallenge,
    editProject,
    editUser
  },
  computed: {
    getAddRowComponent () {
      /**
       * Gets the name of the imported component which adds a row to the admin table.
       * @return {String} The component name
       */
      return `add${this.capitalizeFirst(this.rowType)}`
    },
    getEditRowComponent () {
      /**
       * Gets the name of the imported component which edits a row of the admin table.
       * @return {String} The component name
       */
      return `edit${this.capitalizeFirst(this.rowType)}`
    }
  },
  async created () {
    try {
      // fetching row of rowType (project, challenges, or users) and config from db
      await this.loadFireRefs()
      await this.loadAllRows()
      if (this.useLoadConfig) {
        await this.loadConfig()
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase object referencing the database
      cloudFunctions: null, // <Object>: firebase ref to cloud functions
      uuid: '', // <String>: uid of rowType, i.e., project, challenges, or users, to be edited. Used in conjunction with
      //                     rowKey prop since some user data doesn't have a uuid, but does have a rowKey like 'email'.
      // popkeywords <Array<Object>>: list of keywords for projects and challenges converted to object
      //                              with label and value (not for users)
      popkeywords: [],
      emailSet: new Set(), // <Set<String>>: set of user email (not for projects or challenges)

      dialog: false, // <Boolean>: flag to invoke dialog
      dialogOption: '', // <String>: mode of the dialog
      rowList: [], // <Array<Object>>: list of rows of the same rowType (project, challenges, or users) from ToC
      uuidList: [], // <Array<String>>: list of uid from ToC
      filter: '', // <String>: value of the search
      loading: true, // <Boolean>: flag for page loading
      pagination: { // <Object>: pagination object for the table
        sortBy: 'name', // <String>: name of the column to be sorted
        rowsPerPage: 50 // <Integer>: number of items to be listed per page
      },
      selected: [],
      // columns <Array<Object>>: column layout of the display table
      columns: [
        {
          name: 'keywords',
          label: '',
          field: row => row.keywords
        },
        {
          name: 'name',
          required: true,
          align: 'center',
          label: this.capitalizeFirst(this.rowType),
          field: row => row[this.rowType] || row.name || '',
          format: val => `${val}`,
          sort: this.stringCompare,
          sortable: true,
          classes: 'left-column',
          headerClasses: 'left-column'
        },
        {
          name: this.middleColumn,
          required: true,
          align: 'center',
          label: this.capitalizeFirst(this.middleColumn),
          field: row => row[this.middleColumn] || '',
          format: val => `${val}`,
          sort: this.stringCompare,
          sortable: true,
          classes: 'middle-column',
          headerClasses: 'middle-column'
        },
        {
          name: 'uuid',
          required: true,
          label: 'UUID',
          align: 'center',
          field: row => row.uuid,
          format: val => `${val}`,
          sort: this.stringCompare,
          sortable: true,
          classes: 'right-column',
          headerClasses: 'right-column'
        },
        {
          name: 'icons',
          align: 'center',
          label: ''
        }
      ]
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
          this.cloudFunctions = testAppCall.httpsCallable('appCall')
        } else {
          this.db = productionDb
          this.cloudFunctions = proAppCall.httpsCallable('appCall')
        }

        return true
      } else {
        try {
          let doc = await productionDb.collection('config').doc('project').get()

          if (doc.exists) {
            if (doc.data().db === 'testing') {
              this.db = testingDb
              this.cloudFunctions = testAppCall.httpsCallable('appCall')
              this.$q.localStorage.set('boundless_db', 'testing')
            } else {
              this.db = productionDb
              this.cloudFunctions = proAppCall.httpsCallable('appCall')
              this.$q.localStorage.set('boundless_db', 'production')
            }

            return true
          } else {
            let msg = '"/config/project" path does not exists!'

            throw new Error(msg)
          }
        } catch (error) {
          this.db = productionDb
          this.cloudFunctions = proAppCall.httpsCallable('appCall')
          this.$q.localStorage.set('boundless_db', 'production')

          return false
        }
      }
    },
    loadConfig: async function () {
      /**
       * load keywords into this.popkeywords by converting to fit q-option
       * @param {void}
       * @return {Promise<Boolean>}
       */

      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

        this.pagination.rowsPerPage = cachedConfig.pagination
      }
      if (this.rowType !== 'user') {
        try {
          let doc = await this.db.collection('config').doc('project').get()

          if (doc.exists) {
            let data = doc.data()

            for (let key in data['keywords']) {
              this.popkeywords.push({
                label: key,
                value: data['keywords'][key]
              })
            }

            return true
          } else {
            throw new Error('"config/project" not found!')
          }
        } catch (error) {
          return false
        }
      }
    },
    loadAllRows: async function () {
      /**
       * load all the projects, challenges, or users from the ToC for the admin console
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection(`${this.rowType}s`).doc('ToC').get()

        if (doc.exists) {
          let tocAllRowData = doc.data()
          let row = null
          for (let rowUuid in tocAllRowData) {
            if (rowUuid !== 'alias') {
              row = tocAllRowData[rowUuid]
              this.rowList.push(row)
              this.uuidList.push(rowUuid)
              if (row.hasOwnProperty('email')) { // this row describes a user
                this.emailSet.add(row.email)
              }
            }
          }
        } else {
          throw new Error('No -ToC- document!')
        }

        setTimeout(() => {
          this.loading = false

          return true
        }, 300)
      } catch (error) {
        this.loading = false

        return false
      }
    },
    deleteSelected () {
      if (this.selected.length === 0) {
        this.$q.dialog({
          title: 'Error',
          message: 'Nothing to remove!'
        })
      } else if (this.selected.length === 1) {
        let deletedRow = this.selected[0]
        let rowId = deletedRow.uuid || deletedRow[this.rowKey]
        this.$q.dialog({
          title: 'Confirmation to Delete',
          message: `Delete ${rowId}${this.formatProperty(deletedRow, this.middleColumn)}?`,
          ok: true,
          cancel: true
        })
          .onOk(async () => {
            this.deleteRow(rowId, deletedRow[this.middleColumn])
            this.selected = []
          })
      } else {
        this.$q.dialog({
          title: 'Confirmation to Delete Row Selection',
          message: `Delete all ${this.selected.length} entries selected?`,
          ok: true,
          cancel: true
        }).onOk(async () => {
          this.selected.forEach(row => {
            this.deleteRow(row.uuid || row[this.rowKey], row[this.middleColumn])
          })
          this.selected = []
        })
      }
    },
    deleteRow: async function (entry, removedMiddleEntry) {
      /**
       * Deletes projects, challenges, or users from the database and stroage;
       * notifies the user of the status when compeleted. Works by getting a reference
       * to the field being deleted then removes (by updating) the field in the document.
       * @param{String} entry: uid of the projects, challenges, or users to be removed
       * @param {String} removedMiddleEntry: The alias or email of the projects, challenges, or users to be removed
       * @return {void}
       */
      if (this.rowList.length < 1) {
        this.$q.dialog({
          title: 'Error',
          message: 'Nothing to remove!'
        })
      } else {
        if (this.uuidList.includes(entry)) {
          try {
            await this.db.collection(`${this.rowType}s`).doc(entry).delete()

            this.$q.notify({
              type: 'positive',
              message: `Deleted sucessfully!`
            })

            let updates = {}
            updates[entry] = firebase.firestore.FieldValue.delete()

            if (typeof removedMiddleEntry !== 'undefined') {
              if (removedMiddleEntry !== '') {
                updates[`${this.middleColumn}.${removedMiddleEntry}`] = firebase.firestore.FieldValue.delete()
              }
            }
            await this.db.collection(`${this.rowType}s`).doc('ToC')
              .update(updates)

            let tmpRowList = []

            this.rowList.forEach(row => {
              if (row[this.rowKey] !== entry && row.uuid !== entry) {
                tmpRowList.push(row)
              }
            })

            this.rowList = tmpRowList

            // delete the storage dir from the storage
            await this.cloudFunctions({ folder: `${this.rowType}s/${entry}` })
          } catch (error) {
          }
        } else {
          this.$q.dialog({
            title: 'Error',
            message: `${this.capitalizeFirst(this.rowType)} does not exist in the database.`
          })
        }
      }
    },
    updateAllRowsAndClose: function () {
      /**
       * helper function to update the list of projects and close the dialog
       * @param {void}
       * @return {void}
       */
      this.updateAllRows()
      this.dialog = false
    },
    updateAllRows: function () {
      /**
       * helper function to refetch row (challenges, projects, or users) list
       * @param {void}
       * @return {void}
       */

      this.loading = true

      this.rowList = []
      this.uuidList = []
      this.emailSet = new Set()

      this.loadAllRows()
    },
    editRow: function (uuid) {
      /**
       * helper function to dialog to invoke 'edit'
       * @param {String} uuid: uid of the row (challenges, projects, or users)
       * @returns {void}
       */
      let uuidAssigned = false
      if (typeof uuid !== 'undefined') {
        this.uuid = uuid
        uuidAssigned = true
      } else if (this.selected.length === 1) {
        let row = this.selected[0]
        this.uuid = row.uuid || row[this.rowKey]
        uuidAssigned = true
      }
      if (uuidAssigned) {
        this.dialogOption = 'edit'
        setTimeout(() => {
          this.dialog = true
        }, 200)
      }
    },
    selectRow (row) {
      /**
       * Adds the row clicked to the list of selected rows.
       * @param {Object} event JS event object
       * @param {Object} row The row clicked
       */
      if (this.selected.length > 0) {
        let i = 0
        const matched = this.selected.find((item, index) => {
          i = index
          return item[this.rowKey] === row[this.rowKey]
        })
        if (matched) {
          this.selected.splice(i, 1)
        } else {
          this.selected.push(row)
        }
      } else {
        this.selected.push(row)
      }
    },
    stringCompare (a, b) {
      /**
       * Used to sort columns.
       * @param {String} a Left string
       * @param {String} b Right string
       * @return {String} If the return value:
       * is less than 0 then sort a to an index lower than b, i.e. a comes first
       * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
       * is greater than 0 then sort b to an index lower than a, i.e. b comes first
       */
      a = a.trim()
      a = a.toLowerCase()
      b = b.trim()
      b = b.toLowerCase()
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1
      } else {
        return 0
      }
    },
    capitalizeFirst (str) {
      /**
       * Capitlizes the first character of a string.
       * Used for rowType for certain imports or labels.
       * @param {String} str The string to be capitlized.
       * @return {String} The captilized string
       */
      if (typeof str !== 'string') return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    formatProperty (row, propertyName) {
      /**
       * Returns the row.propertyName for display if there is one.
       * @param row {Object} The project, challenge, or user with a potential property of propertyName.
       * @return {String} The property value.
       */
      if (row && propertyName && row.hasOwnProperty(propertyName)) {
        return row[propertyName] ? ` (${propertyName}: ${row[propertyName]})` : ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.body-table-row
  cursor: pointer

.left-column
  min-width: 600px

.middle-column
  min-width: 600px

.right-column
  min-width: 300px

.table-header
  font-size: 18px
  font-weight: normal
  position: sticky !important
  top: 0
  z-index: 1
  background: #fff

.keyword-dropdown
  min-width: 100px
.table
  max-height: 74vh
  margin-bottom: 0

</style>
