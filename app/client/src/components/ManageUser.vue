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

Name:     components/ManageUser.vue
Purpose:  Display, edit, add, and delete user from the admin console
Methods:
  * Allows the user to be added
  * Allows the user to be deleted
  * Allows the user to be edited
  * Display the list of users in a table

## -->

<template>
  <q-page flat class="">
    <!-- ------------------ Main Content ------------------ -->
    <q-table
      flat wrap-cells binary-state-sort
      color="secondary"
      row-key="email"
      :data="userList"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      :pagination.sync="pagination"
    >
      <template v-slot:top-left>
        <q-btn
          round
          icon="add" color="accent"
          @click="dialog = true; dialogOption = 'add'"
        />
      </template>

      <template v-slot:top-right>
        <q-toolbar>
          <q-space />

          <q-input
            dense
            debounce="300" color="primary"
            placeholder="Search"
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

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td
            key="keywords"
            :props="props"
          >
            <div
              hidden
              align="left"
            >
            </div>
          </q-td>

          <q-td
            key="email"
            :props="props"
            style="width: 300px;"
          >
            <div align="left">
              {{ props.row.email }}
            </div>
          </q-td>

          <q-td
            key="uuid"
            :props="props"
          >
            <div>
              {{ props.row.uuid }}
            </div>
          </q-td>

          <q-td
            key="name"
            :props="props"
          >
            <div>
              {{ props.row.name }}
            </div>
          </q-td>

          <q-td
            key="icons"
            :props="props"
            style="width: 100px;"
          >
            <q-btn
              dense round flat
              color="secondary" icon="edit"
              @click="editUser(props.row.uuid || props.row.email)"
            />

            <q-btn
              dense round flat
              color="secondary" icon="delete"
              @click="deleteUser(props.row.uuid || props.row.email)"
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
        <q-card-section v-if="dialogOption === 'add'" >
          <AddUser
            @added="updateUsers"
            @close="dialog = false"
          />
        </q-card-section>

        <q-card-section v-if="dialogOption === 'edit'" >
          <br>
          <EditUser
            :userId="userId"
            :emailList="emailList"
            @added="updateUsers"
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

import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import AddUser from '../components/SubmitUserAdminConsole'
import EditUser from '../components/EditUser'

export default {
  components: {
    AddUser,
    EditUser
  },
  async created () {
    try {
      // fetch all the users after loading the references
      await this.loadFireRefs()
      await this.loadUsers()

      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

        this.pagination.rowsPerPage = cachedConfig.pagination
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase object referencing the database
      userId: '', // <String>: uid of the user to be edited
      dialog: false, // <Boolean>: flag to invoke dialog
      dialogOption: '', // <String>: mode of the dialog
      userList: [], // <Array<Object>>: list of users from ToC
      uuidList: [], // <Array<String>>: list of user uid
      emailList: [], // <Array<String>>: list of user email
      filter: '', // <String>: value of the search
      loading: true, // <Boolean>: flag for page loading
      pagination: { // <Object>: pagination object for the table
        sortBy: 'email', // <String>: name of the column to be sorted
        rowsPerPage: 50 // <Integer>: number of items to be listed per page
      },
      // columns <Array<Object>>: column layout of the display table
      columns: [
        {
          name: 'keywords',
          label: ''
        },
        {
          name: 'email',
          required: true,
          align: 'center',
          label: 'Email',
          field: row => row.email,
          format: val => `${val}`,
          sort: (a, b) => {
            if (a.trim() < b.trim()) {
              return -1
            } else if (a.trim() > b.trim()) {
              return 1
            } else {
              return 0
            }
          },
          sortable: true
        },
        {
          name: 'uuid',
          label: 'UUID',
          align: 'center',
          field: row => row.uuid,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'center',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
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
    editUser: function (entry) {
      /**
       * helper function to help invoke the editable dialog
       * @param {String} entry: uid of the user
       * @return {void}
       */

      this.dialogOption = 'edit'
      this.userId = entry

      setTimeout(() => {
        this.dialog = true
      }, 200)
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
        } else {
          this.db = productionDb
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
    loadUsers: async function () {
      /**
       * load the user list from the ToC
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection('users').doc('ToC').get()

        if (doc.exists) {
          let tocUserData = doc.data()

          for (let user in tocUserData) {
            this.userList.push(tocUserData[user])
            this.emailList.push(tocUserData[user].email)
            this.uuidList.push(user)
          }
        } else {
          throw new Error('ToC not found!')
        }

        setTimeout(() => {
          this.loading = false

          return true
        }, 300)
      } catch (error) {
        return false
      }
    },
    deleteUser: async function (entry) {
      /**
       * delete the user from the db and notify the user that the user
       * has been deleted
       * @param {String} entry: uid of the user
       * @return {void}
       */

      this.$q.dialog({
        title: 'Confirmation to Delete',
        message: 'Delete ' + entry + '?',
        ok: true,
        cancel: true
      })
        .onOk(async () => {
          if (this.userList.length < 1) {
            this.$q.dialog({
              title: 'Error',
              message: 'Nothing to remove!'
            })
          } else {
            if (this.uuidList.includes(entry)) {
              try {
                await this.db.collection('users').doc(entry).delete()

                this.$q.notify({
                  icon: 'done',
                  color: 'positive',
                  message: 'Deleted sucessfully!',
                  closeBtn: 'OK'
                })

                await this.db.collection('users').doc('ToC').set({
                  [entry]: firebase.firestore.FieldValue.delete()
                }, { merge: true })

                let tmpUserList = []

                this.userList.forEach(user => {
                  if (user.email !== entry && user.uuid !== entry) {
                    tmpUserList.push(user)
                  }
                })

                this.userList = tmpUserList
              } catch (error) {
              }
            } else {
              this.$q.dialog({
                title: 'Error',
                message: 'Email does not exist in the database.'
              })
            }
          }
        })
    },
    updateUsers: function () {
      /**
       * a helper function to refactor the users as the user was updated
       * @param {void}
       * @return {void}
       */

      this.loading = true

      this.userList = []
      this.uuidList = []
      this.emailList = []

      this.loadUsers()

      this.dialog = false
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
