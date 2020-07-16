<template>
  <q-page>
    <q-card class="absolute-center">
      <q-stepper
        animated keep-alive
        v-model="step"
        ref="stepper"
        color="primary"
        class="main"
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
          title="Additional details"
          caption="Optional"
          icon="assignment"
          :done="step > 2"
        >
          <project-custom-form
            ref="projectCustomForm"
            :questionDetails="questionDetails"
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
  </q-page>
</template>

<script>
import ProjectMainForm from '../components/Forms/Project/ProjectMainForm.vue'
import ProjectCustomForm from '../components/Forms/Project/ProjectCustomForm.vue'
import ProjectReviewForm from '../components/Forms/Project/ProjectReviewForm.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('projectSubmit')

export default {
  components: {
    ProjectMainForm,
    ProjectCustomForm,
    ProjectReviewForm
  },
  data () {
    return {
      step: 1, // <Integer> Progress counter representing current panel.
      questionDetails: [
        {
          label: 'What was this project\'s inspiration?',
          type: 'text'
        },
        {
          label: 'Extended Details',
          type: 'textarea'
        },
        {
          label: 'Installlation',
          type: 'textarea'
        },
        {
          label: 'Source code link',
          type: 'url'
        },
        {
          label: 'What is your favorite number?',
          type: 'number'
        }
      ]
    }
  },
  async mounted () {
    try {
      // fetches the required data rom the db
      await this.loadFireRefs()
      await this.loadUserList()
      await this.loadConfig()
    } catch (error) {
      throw new Error(error)
    }
  },
  methods: {
    ...mapActions([
      'loadFireRefs',
      'loadUserList',
      'loadConfig',
      'submitProject',
      'submitQuestions',
      'resetProject'
    ]),
    async submit () {
      /**
       * On the first two pages, submit the form to vuex. On the third and final
       * page, submit the forms to Firestore then return to the first page.
       */
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
              message: 'Unable to submit.'
            })
            throw new Error(error)
          }
          break
      }
    },
    navigateForward () {
      /** Advance the stepper page. */
      this.$refs.stepper.next()
    }
  }
}
</script>

<style lang="stylus" scoped>

.main
  width: 1000px
  align: center

// select child component
/deep/ .container
  max-height: 65vh
  overflow: auto

/deep/ .container > *
  max-width: 80%

/deep/ h5
  margin: 10px 0
</style>
