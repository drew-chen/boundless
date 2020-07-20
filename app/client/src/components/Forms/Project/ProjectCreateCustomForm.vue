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
            :disable="!isModified"
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
                class="q-ma-sm col-xs-4 col-lg-2"
                label="Question label"
                v-model="questionTemplate.label"
              />
              <q-select
                filled
                v-model="questionTemplate.type"
                :options="options"
                label="Standard"
                class="q-ma-sm col-xs-2 col-lg-1"
              />
              <q-toggle
                v-model="questionTemplate.required"
                color="secondary"
                label="required"
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
        'text', 'textarea', 'email', 'number', 'date', 'time', 'tel'
      ]
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
