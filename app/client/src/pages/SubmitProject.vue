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

Name:     pages/SubmitProject.vue
Purpose:  Wrapper for project submission forms.
Methods:

  Manages the view and submission trigger of multiple child component
  forms.

## -->

<template>
  <q-page>
    <q-card class="main">
      <q-stepper
        animated keep-alive
        v-model="step"
        ref="stepper"
        color="primary"
        align="center"
      >
        <q-step
          :name="1"
          title="Main Info"
          icon="settings"
          :done="step > 1"
        >
          <project-main-form
            ref="projectMainForm"
            @submittedSuccessfully="navigateForward"
          />
        </q-step>

        <q-step
          :name="2"
          title="Additional questions"
          icon="assignment"
          :done="step > 2"
        >
          <project-custom-form
            ref="projectCustomForm"
            @submittedSuccessfully="navigateForward"
          />
        </q-step>
        <q-step
          :name="3"
          title="Review"
          icon="pageview"
        >
          <project-review-form
            ref="projectReviewForm"
          />
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              no-caps
              @click="submit"
              color="secondary"
              :label="step === 3 ? 'Submit' : 'Continue'"
            />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm"></q-btn>
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-card>
    <dialog-confirm-leave
      :isOpen="isLeaving"
      ref="dialogConfirmLeave"
    />
  </q-page>
</template>

<script>
import ProjectMainForm from '../components/Forms/Project/ProjectMainForm.vue'
import ProjectCustomForm from '../components/Forms/Project/ProjectCustomForm.vue'
import ProjectReviewForm from '../components/Forms/Project/ProjectReviewForm.vue'
import DialogConfirmLeave from '../components/Dialogs/DialogConfirmLeave.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('projectSubmit')

export default {
  components: {
    ProjectMainForm,
    ProjectCustomForm,
    ProjectReviewForm,
    DialogConfirmLeave
  },
  created () {
    window.addEventListener('beforeunload', this.confirmUnload)
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.confirmUnload)
  },
  computed: {
    ...mapGetters['project']
  },
  data () {
    return {
      step: 1, // <Integer> Progress counter representing current panel.
      isLeaving: false // <Boolean> Flag for whether the user is navigating away.
    }
  },
  /**
   * Block leaving with persistent dialog if changes have been made.
   * View specifics on navigation guards at:
   * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
   *
   * @param {Object} to The target Route Object being navigated to.
   * @param {Object} from The current route being navigated away from.
   * @param {Function} next This function must be called to resolve the hook.
   */
  beforeRouteLeave (to, from, next) {
    this.isLeaving = true
  },
  methods: {
    ...mapActions([
      'submitProject',
      'submitQuestions',
      'resetProject'
    ]),
    /**
     * On the first two pages, submit the form to vuex. On the third and final
     * page, submit the forms to Firestore then return to the first page.
     */
    async submit () {
      switch (this.step) {
        case 1:
          this.$refs.projectMainForm.submit()
          break
        case 2:
          this.$refs.projectCustomForm.submit()
          break
        case 3:
          try {
            await this.submitProject()
            await this.submitQuestions()

            this.resetProject()
            this.$refs.projectMainForm.reset()
            this.$refs.projectCustomForm.reset()

            this.$q.notify({
              type: 'positive',
              message: 'Submitted successfully!'
            })

            this.$refs.stepper.goTo(1)
          } catch (error) {
            this.$q.notify({
              type: 'negative',
              message: 'Unable to submit new project.'
            })
            throw error
          }
          break
      }
    },
    /** Advance the stepper page. */
    navigateForward () {
      this.$refs.stepper.next()
    },
    /**
     * Blocks reloading the webpage or closing the browser if there are
     * unsaved changes. Quasar dialog
     *
     * @param event {Object} The event which has occured: 'beforeunload'.
     */
    confirmUnload (event) {
      if (this.$refs.projectMainForm.modified) {
        // Cancel the event
        event.preventDefault() // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        event.returnValue = 'You should keep this page open.'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-page
  margin-top: 10px

.main
  width: 1000px
  margin: auto

// select child component
/deep/ .container
  max-height: 64vh
  overflow: auto

/deep/ .container > *
  max-width: 80%

/deep/ h5
  margin: 10px 0
</style>
