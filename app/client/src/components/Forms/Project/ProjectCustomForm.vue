<template>
  <div>
    <div v-if="!questionTemplates || questionTemplates.length === 0">
      There are no additional details
    </div>
    <div v-else>
      <h5>Additional Questions</h5>
      <q-form
        class="q-pd-md"
        ref="form"
      >
        <div class="container">
          <div v-for="question in questions" :key="question.label">
            <q-input
              filled clearable stack-label
              clear-icon="close"
              class="q-mt-sm"
              :placeholder="`${question.type.label} Response`"
              :label="question.label"
              :type="question.type.value"
              v-model="question.response"
              :rules="[val => (!question.required || !!val) || '* Required']"
            >
              <template v-slot:prepend>
                <q-icon :name="question.type.icon" />
              </template>
              <template
                v-if="question.required"
                v-slot:hint
              >
                * Required
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </div>

  </div>

</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('projectSubmit')

export default {
  /**
   * Create questions for this project based on questionTemplates then
  *  sort questions based on 'order' property.
   */
  created () {
    if (!this.questionTemplates || this.questionTemplates.length === 0) {
      this.questions = []
    } else {
      this.questionTemplates.forEach(questionTemplate => {
        this.questions.push({
          ...questionTemplate,
          response: ''
        })
      })
      this.questions.sort((q1, q2) => {
        if (q1.order > q2.order) {
          return 1
        } else if (q1.order > q2.order) {
          return -1
        } else {
          return 0
        }
      })
    }
  },
  computed: {
    ...mapGetters(['questionTemplates'])
  },
  data () {
    return {
      questions: []// <Array<Object>>: Custom questions and their responses.
    }
  },
  methods: {
    ...mapMutations(['setQuestions']),
    saveToVuex () {
      const cloneDeep = require('lodash.clonedeep')
      this.setQuestions(cloneDeep(this.questions))
    },
    submit () {
      /**
       * When all form inputs are valid and when submit button is clicked,
       * save to vuex and tell the parent component to advance the stepper.
       */
      this.$refs.form.validate().then(success => {
        if (success) {
          this.saveToVuex()
          this.$emit('submittedSuccessfully')
        }
      })
    },
    reset () {
      this.questions.forEach(question => {
        question.response = ''
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
