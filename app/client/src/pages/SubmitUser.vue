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

Name:     pages/SubmitUser.vue
Purpose:  Form to allow the users to submit users for the protal
Methods:
  * Allow the users to submit new users
  * Instantiates the user profile for the newly created users

## -->

<template>
  <q-page>
    <!-- -------------------- Page Loader -------------------- -->
    <div v-if="loading" class="absolute-center">
      <q-spinner
        color="primary"
        size="8em"
      />
    </div>

    <!-- -------------------- Main Content -------------------- -->
    <q-card
      v-else
      align="center"
      style="margin: auto; max-width: 1000px"
    >
      <br class="small">
      <h4>New User</h4>

      <q-form
        @submit="onSubmit"
        class="q-pd-md"
        style="max-width: 80%;"
      >
        <hr>

        <!-- -------------------- User Name -------------------- -->
        <q-input
          filled lazy-rules
          ref="userName"
          class="q-mt-sm"
          v-model="user.name"
          placeholder="ie. John Doe" label="Full Name"
          :rules="[val => !!val || 'Field is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <!-- -------------------- User Email -------------------- -->
        <q-input
          filled lazy-rules
          class="q-mt-sm"
          ref="eMail"
          v-model="user.email"
          label="Email" type="email"
          placeholder="ie. john.doe@gmail.com"
          :rules="[val => !!val || 'Field is required']"
          @blur="checkEmail(user.email)"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <!-- -------------------- MIGHT NEED IN FUTURE -------------------- -->
        <!-- <div class="row q-mt-sm">
          <div class="col-1">Optional</div>
          <hr class="col">
        </div>

        <q-input
          filled
          class="q-mt-sm"
          v-model="webpage.socialNetwork.github"
          label="GitHub Username" type="text"
          placeholder="ie. johndoe"
          @blur="webpage.socialNetwork.github = webpage.socialNetwork.github.toLowerCase()"
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-github" />
          </template>
        </q-input>

        <q-input
          filled
          class="q-mt-sm"
          v-model="webpage.socialNetwork.jive"
          label="Jive Username" type="text"
          placeholder="ie. johndoe"
          @blur="webpage.socialNetwork.jive = webpage.socialNetwork.jive.toLowerCase()"
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-github" />
          </template>
        </q-input> -->

        <hr>

        <q-btn
          no-caps
          label="Submit User" type="submit" color="secondary"
          class="half-width"
        />

      </q-form>
      <br><br><br>
    </q-card>
  </q-page>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

export default {
  async created () {
    try {
      // fetch the required data for the component from the db
      await this.loadFireRefs()
      await this.loadUserList()
      await this.loadAllowedDomain()
    } catch (error) {
      throw error
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase firestore credentials
      emailList: [], // <Array<String>>: list of emails which are in use
      allowedDomain: [], // <Array<String>>: list of allowed domain for users
      user: {}, // <Object>: user information to be submitted
      webpage: {}, // <Object>: default user webpage information
      loading: false // <Boolean>: flag for loading animation
    }
  },
  methods: {
    onSubmit: async function () {
      /**
       * submits the new user to the user database and
       * instantiate a webpage for the new user
       * @param {void}
       * @return {Promise<Boolean>}
       */

      this.checkEmail(this.user.email)

      if (this.user.email) {
        this.loading = true

        let timeOfSubmit = new Date(Date.now()).toISOString()
        let firestore = this.db.collection('users').doc()
        let key = firestore.id

        this.user = {
          ...this.user,
          timestamp: timeOfSubmit,
          created: timeOfSubmit,
          uuid: key,
          imgURL: '',
          title: ''
        }

        this.webpage = {
          ...this.webpage,
          socialNetwork: {},
          projects: [],
          achievements: {}
        }

        try {
          await firestore.set(this.webpage)
          await this.db.collection('users').doc('ToC').set({
            [key]: this.user
          }, { merge: true })

          this.onReset()

          return true
        } catch (error) {
          return false
        }
      }
      return false
    },
    onReset: function () {
      /**
       * helper function which resets the input fields of the form and
       * emits 'added' event when the component is a child component
       * @param {void}
       * @return {void}
       */

      let createdUser = this.user
      this.user = {}
      this.webpage = {}

      this.$q.notify({
        type: 'positive',
        message: 'Submitted successfully!'
      })

      this.loading = false
      this.$emit('added', createdUser)
      createdUser = {}
    },
    checkEmail: function (entry) {
      /**
       * naive email check for the email
       * @param {String} entry: email of the new user
       * @return {void}
       */

      if (!this.emailList.includes(entry) && entry.includes('@')) {
        this.emailDomainCheck(entry)
      } else if (this.emailList.includes(entry)) {
        this.user.email = ''
        this.$q.notify({
          type: 'negative',
          message: 'The email is already in use!',
          timeout: 500
        })
      } else {
        this.user.email = ''
      }
    },
    emailDomainCheck: function (email) {
      /**
       * check allowed domain for the new users and
       * notifies the user if the domain is not allowed
       * @param {String} email: email to be registered
       * @return {void}
       */

      let validEmail = false
      email = email.toLowerCase()

      if (!this.allowedDomain || this.allowedDomain.length < 1) {
        validEmail = true
      } else {
        this.allowedDomain.forEach(entry => {
          if (email.includes(entry)) {
            validEmail = true
          }
        })
      }

      if (!validEmail) {
        this.$q.notify({
          color: 'negative',
          message: `Only [${this.allowedDomain.join(', ')}] are allowed!`,
          icon: 'warning'
        })

        this.user.email = ''
      } else {
        this.user.email = email
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
          } else {
            let msg = '"/config/project" path does not exists!'
            throw new Error(msg)
          }

          return true
        } catch (error) {
          this.db = productionDb
          this.$q.localStorage.set('boundless_db', 'production')

          return false
        }
      }
    },
    loadAllowedDomain: async function () {
      /**
       * load the config from the db
       * TODO: this should be replaced since config/project is cached in session
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection('config').doc('project').get()

        if (doc.exists) {
          this.allowedDomain = doc.data()['allowedDomain']
        } else {
          throw new Error('config/project is not available!')
        }

        return true
      } catch (error) {
        return false
      }
    },
    loadUserList: async function () {
      /**
       * load the user list from the db and store the data into component state
       * @param {void}
       * @return {Promise<Boolean>}
       */

      try {
        let doc = await this.db.collection('users').doc('ToC').get()

        if (doc.exists) {
          let tocUserData = doc.data()

          for (let user in tocUserData) {
            this.emailList.push(tocUserData[user].email)
          }
        } else {
          throw new Error('users/ToC is not available!')
        }

        return true
      } catch (error) {
        return false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
