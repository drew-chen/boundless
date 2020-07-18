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

Name:     components/Forms/Project/projectCreateCustomForm.vue
Purpose:  Form configures 'ProjectCustomForm.vue'.
Methods:
  * Admin goes through form which creates an array that 'ProjectCustomForm.vue'
  * can display. This array is saved in vuex and submitted to the db in a
  * vuex action.
## -->

<template>
  <div>
    <div
      v-if="type === 'projects'"
      class="text-h4 q-mb-md"
    >
      Project custom form template
      <q-separator color="secondary" />
      <q-form>
        <draggable
          tag="ul"
          v-model="questionTemplates"
          group="questions"
          @end="updateQuestionOrder"
        >
          <q-btn
            slot="header"
            @click="addQuestionTemplate"
          >
            Add
          </q-btn>
          <q-btn
            slot="header"
            @click="saveQuestionTemplates"
          >
            Save
          </q-btn>
          <!-- TODO: Add transition -->
          <!-- <transition-group> -->
            <div
              class="row items-center q-ma-sm"
              v-for="(questionTemplate, index) in questionTemplates"
              :key="questionTemplate.order"
            >
              <q-icon class="drag-icon" name="drag_indicator"/>
              <q-input
                filled clearable
                clear-icon="close"
                class="q-ma-sm col-2"
                label="Question label"
                v-model="questionTemplate.label"
              />
              <!-- TODO: Use option group -->
              <q-input
                filled clearable
                clear-icon="close"
                class="q-ma-sm col-1"
                label="Question type"
                v-model="questionTemplate.type"
              />
              <q-btn
                slot="header"
                @click="deleteQuestionTemplate(index)"
                icon="delete"
              />
            </div>
          <!-- </transition-group> -->
        </draggable>
      </q-form>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import cloneDeep from 'lodash.clonedeep'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('projectSubmit')

export default {
  components: {
    draggable
  },
  props: {
    type: {
      type: String,
      required: true,
      validator (value) {
        // The value must match one of these strings (can be expanded later).
        return ['projects'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      questionTemplates: [],
      newQuestionTemplate: {
        label: '', // <String>: Name of the question.
        type: 'text', // <String>: Question type. See QInput API.
        required: false, // <String>: Whether a response is necessary
        order: 0 // <Integer>: Index which is only unique within questionTemplates.
      }
    }
  },
  methods: {
    ...mapActions(['submitQuestionTemplates']),
    /** Submits questionTemplates to vuex and to the db. */
    async saveQuestionTemplates () {
      try {
        await this.submitQuestionTemplates(cloneDeep(this.questionTemplates))
        this.$q.notify({
          type: 'positive',
          message: 'Saved custom question templates.'
        })
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Unable to submit question templates.'
        })
        throw new Error(error)
      }
    },
    /** Creates another question. */
    addQuestionTemplate () {
      this.questionTemplates.push(
        this.newQuestionTemplate
      )
      this.newQuestionTemplate = {
        label: '',
        type: 'text',
        required: false,
        order: this.questionTemplates.length
      }
    },
    /**
     * Removes an element from 'questionTemplates'.
     * @param {Number} index The index of element to be removed.
     */
    deleteQuestionTemplate (index) {
      if (index > -1) {
        this.questionTemplates.splice(index, 1)
      }
    },
    /** Ensures that a question's order is it's index. */
    updateQuestionOrder () {
      this.questionTemplates.forEach((question, index) => {
        question.order = index
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

.drag-icon
  cursor: move

</style>
