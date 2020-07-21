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
  * can display. Questions support CRUD operations and can be reordered through
  * drag and dropping them. This array is saved in vuex and submitted to the
  * db in a vuex action.
## -->

<template>
  <div>
    <div
      v-if="type === 'projects'"
    >
      <div class="text-h4 q-mb-md">
        Project custom form template
      </div>
      <q-separator color="secondary" />
      <q-form>
        <q-btn
          round
          @click="addQuestionTemplate"
          class="q-mr-sm"
          icon="add"
          color="accent"
        />
        <q-btn
          @click="saveQuestionTemplates"
          :disable="!isModified"
        >
          Save
        </q-btn>
        <!-- Native drag and drop API is disabled to prevent flickering issues. -->
        <draggable
          tag="ul"
          v-model="questionTemplates"
          @end="updateQuestionOrder"
          handle=".handle"
          chosen-class="chosen-question"
          :force-fallback="true"
          fallback-class="hide-question-preview"
          animation="175"
        >
          <q-card
            flat
            class="row items-center handle"
            v-for="(questionTemplate, index) in questionTemplates"
            :key="questionTemplate.order"
          >
            <q-icon
              size="sm"
              color="grey"
              name="drag_indicator"
              class="q-ma-xs"
            />
            <q-input
              filled clearable
              clear-icon="close"
              class="q-ma-sm col-6"
              label="Label"
              v-model="questionTemplate.label"
            />
            <q-select
              filled
              v-model="questionTemplate.type"
              :options="options"
              label="Input Type"
              class="q-mx-sm col-2"
            />
            <q-toggle
              v-model="questionTemplate.required"
              color="secondary"
              label="required"
              class="col-2"
            />
            <q-btn
              round flat
              @click="deleteQuestionTemplate(index)"
              icon="delete"
            />
          </q-card>
        </draggable>
      </q-form>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { cloneDeep, isEqual } from 'lodash'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('projectSubmit')

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
  async created () {
    await this.loadFireRefs()
    await this.loadConfig()
    this.questionTemplates = cloneDeep(this.storeQuestionTemplates)
    this.isModified = false
  },
  watch: {
    /**
     * If questionTemplate changes and it's different from the
     * version in the database, then enable the save button.
     */
    questionTemplates: {
      deep: true,
      handler (newVal, oldVal) {
        if (!isEqual(this.storeQuestionTemplates, newVal)) {
          this.isModified = true
        } else {
          this.isModified = false
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      storeQuestionTemplates: 'questionTemplates'
    })
  },
  data () {
    return {
      questionTemplates: [], // <Array<Object> List of question templates.
      newQuestionTemplate: {
        label: '', // <String>: Name of the question.
        type: 'text', // <String>: Question type. See HTML input types.
        required: false, // <String>: Whether a response is necessary
        order: 0 // <Integer>: Index which is only unique within questionTemplates.
      },
      isModified: false, // <Boolean>: Whether questionTemplates has changed.
      options: [ // Array<String>: Possible input template types.
        'text', 'textarea', 'email', 'number', 'date', 'url'
      ] // TODO: rename textarea to 'text box (paragraph)'. text (sentence). Look at google form for exs
      // TODO: Option group
    }
  },
  methods: {
    ...mapActions([
      'submitQuestionTemplates',
      'loadFireRefs',
      'loadConfig'
    ]),
    /** Submits questionTemplates to vuex and to the db. */
    async saveQuestionTemplates () {
      try {
        this.updateQuestionOrder()
        await this.submitQuestionTemplates(cloneDeep(this.questionTemplates))
        this.isModified = false
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
    /** Ensures that a question's order is it's index. Does not affect view. */
    updateQuestionOrder () {
      this.questionTemplates.forEach((question, index) => {
        question.order = index
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-card
  max-width: 900px

.handle
  cursor: move

// The .chosen-question class is used when a row is clicked. During drag
// and drop movement, the .chosen-question class is also used.
.chosen-question
  background: $grey-3
  border 1px

// This is the drag preview that is directly under your mouse. This is
// hidden because this preview covers the chosen question making it harder to
// see the chosen question.
.hide-question-preview
  display: none

</style>
