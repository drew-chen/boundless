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

Name:     components/Forms/Project/ProjectCustomForm.vue
Purpose:

  Custom form designed by the admin in 'ProjectCreateCustomForm.vue'.
  Displays custom questions in order selected by admin.

Methods:

  Displays the template saved in Vuex (if there are any). The user inputs their
  responses which are initially only saved locally. When the user moves onto the
  next form through the parent component and the data is valid, this form is
  saved to Vuex.

## -->

<template>
  <div>
    <div v-if="!questionTemplates || questionTemplates.length === 0">
      There are no additional questions.
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
              :label="question.label ? question.label : 'Untitled'"
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
import cloneDeep from 'lodash/clonedeep'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('projectSubmit')

export default {
  /**
   * Create questions for this project based on questionTemplates then
   * sort questions based on 'order' property.
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
    /** Saves a copy of responses to Vuex. */
    saveToVuex () {
      this.setQuestions(cloneDeep(this.questions))
    },
    /**
     * When all form inputs are valid and when submit button is clicked,
     * save to vuex and tell the parent component to advance the stepper.
     */
    submit () {
      if (Array.isArray(this.questions) && this.questions.length > 0) {
        this.$refs.form.validate().then(success => {
          if (success) {
            this.saveToVuex()
            this.$emit('submittedSuccessfully')
          }
        })
      } else {
        this.$emit('submittedSuccessfully')
      }
    },
    /** Deletes input from each form locally. Does not modify Vuex store. */
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
