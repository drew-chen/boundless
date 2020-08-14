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
  forms. Child forms are displayed in a slide and each child form is submitted
  once the form is valid and the user advances to the next form.

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

        <!-- Main Form -->

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

        <!-- Custom Form -->

        <q-step
          v-if="customFormEnabled"
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

        <!-- Review Form -->

        <q-step
          :name="3"
          title="Review"
          icon="pageview"
        >
          <project-review-form
            ref="projectReviewForm"
            :projectName="projectName"
            :projectDescription="projectDescription"
            :projectMembers="projectMembers"
            :keywordOptions="keywordOptions"
            :projectKeywords="projectKeywords"
            :customFormResponse="questions"
            :customFormEnabled="customFormEnabled"
          />
        </q-step>

        <!-- Navigation Buttons -->

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="navigateBackward"
              label="Back"
              class="q-mr-sm"
            />
            <q-btn
              no-caps
              @click="submit"
              color="secondary"
              :label="step === 3 ? 'Submit' : 'Continue'"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
      <q-inner-loading :showing="submitting">
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
import ProjectMainForm from '../components/Forms/Project/ProjectMainForm.vue'
import ProjectCustomForm from '../components/Forms/Project/ProjectCustomForm.vue'
import ProjectReviewForm from '../components/Forms/Project/ProjectReviewForm.vue'

import mixinConfirmUnload from '../mixins/mixinConfirmUnload'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('projectSubmit')

export default {
  components: {
    ProjectMainForm,
    ProjectCustomForm,
    ProjectReviewForm
  },
  mixins: [mixinConfirmUnload],
  computed: {
    ...mapGetters([
      'project',
      'customFormEnabled',
      'projectName',
      'projectDescription',
      'projectMembers',
      'keywordOptions',
      'projectKeywords',
      'questions'
    ]),
    /*
    <Boolean>: Whether or not the first child's form, hence this entire form, has been
    modified in any way. The ref is only available at mount time. Furthermore,
    the form cannot be modified before it is mounted. Used with the mixin.
    */
    updated () {
      return this.mounted && this.$refs.projectMainForm.modified
    }
  },
  mounted () {
    this.mounted = true
  },
  data () {
    return {
      step: 1, // <Integer> Progress counter representing current panel.
      submitting: false, // <Boolean> Whether data is being submitted.
      mounted: false // <Boolean>: Whether this component has been mounted.
    }
  },
  methods: {
    ...mapActions([
      'submitProject',
      'submitQuestions',
      'resetProject'
    ]),
    /**
     * Each case represents which page.
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
            this.submitting = true
            await this.submitProject()
            await this.submitQuestions()

            this.resetProject()
            this.$refs.projectMainForm.reset()
            // If the custom form is not enabled, this ref does not exist.
            if (this.customFormEnabled) {
              this.$refs.projectCustomForm.reset()
            }
            this.submitting = false
            // Notifies when the project is submitted without error.
            this.$q.notify({
              type: 'positive',
              message: 'Submitted successfully!'
            })

            this.$refs.stepper.goTo(1)
          } catch (error) {
            // Notifies if there is an error during project submission.
            this.$q.notify({
              type: 'negative',
              message: 'Unable to submit new project.'
            })
            this.submitting = false
            throw error
          }
          break
      }
    },
    /** Advance the stepper page. */
    navigateForward () {
      if (this.step === 1 && !this.customFormEnabled) {
        this.$refs.stepper.goTo(3)
      } else {
        this.$refs.stepper.next()
      }
    },
    /** Go back to the previous stepper page. */
    navigateBackward () {
      if (this.step === 3 && !this.customFormEnabled) {
        this.$refs.stepper.goTo(1)
      } else {
        this.$refs.stepper.previous()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-page
  margin-top 10px

.main
  width 1000px
  margin auto

// select child component
/deep/ .container
  max-height 64vh
  overflow auto

/deep/ .container > *
  max-width 80%

</style>
