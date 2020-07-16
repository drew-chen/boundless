<template>
  <div>
    <div v-if="questionDetails.length === 0">
      There are no additional details
    </div>
    <div v-else>
      <h5>Additional Details</h5>
      <q-form
        class="q-pd-md"
        ref="form"
      >
        <div class="container">
          <div v-for="question in questions" :key="question.label">
            <q-input
              filled clearable
              clear-icon="close"
              class="q-mt-sm"
              :placeholder="`Enter optional response (${question.type})`"
              :label="question.label"
              :type="question.type"
              v-model="question.response"
            />
          </div>
        </div>
      </q-form>
    </div>

  </div>

</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('projectSubmit')

export default {
  props: {
    questionDetails: {
      type: Array,
      required: true
    }
  },
  created () {
    this.questionDetails.forEach(questionDetail => {
      this.questions.push({
        label: questionDetail.label,
        type: questionDetail.type,
        response: ''
      })
    })
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
