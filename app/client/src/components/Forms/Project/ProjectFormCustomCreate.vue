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

Name:     components/Forms/Project/ProjectFormCustomCreate.vue
Purpose:  Form configures 'ProjectCustomForm.vue'.
Methods:
  * Admin goes through form which creates an array that 'ProjectCustomForm.vue'
  * can display.
## -->

<template>
  <div>
    <div
      v-if="type === 'projects'"
      class="text-h4 q-mb-md"
    >
      Custom questions
      <q-separator color="secondary" />
      <q-form>
        <draggable
          v-model="questionDetails"
          group="questions"
          @start="drag=true"
          @end="drag=false"
        >
          <q-btn
            slot="header"
            @click="addQuestion">Add
          </q-btn>
          <div
            v-for="question in questionDetails"
            :key="question.id"
          >
            <div>
              <q-icon name="drag_indicator" />
              <q-input
                filled clearable
                clear-icon="close"
                class="q-mt-sm"
                label="Question label"
                v-model="question.label"
              />
              <q-input
                filled clearable
                clear-icon="close"
                class="q-mt-sm"
                label="Question type"
                v-model="question.type"
              />
            </div>

          </div>
        </draggable>
      </q-form>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  created () {
    this.idGenerator = this.makeIdGenerator()
  },
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
      questionDetails: [],
      newQuestion: {
        label: '', // <String>: Name of the question.
        type: 'text', // <String>: Question type. See QInput API.
        required: false, // <String>: Whether a response is necessary
        id: 0 // <Integer>: Id which is only unique within questionDetails.
      },
      idGenerator: null
    }
  },
  methods: {
    /**
     * Returns a generator object. The generate object returns a higher number
     * each time it is called.
     */
    *makeIdGenerator () {
      let index = 1
      while (true) {
        yield index++
      }
    },
    /** Creates another question element with a unique id. */
    addQuestion () {
      this.questionDetails.push(
        this.newQuestion
      )
      this.newQuestion = {
        label: '',
        type: 'text',
        required: false,
        id: this.idGenerator.next().value
      }
    },
    /**
     * Removes an element from 'questionDetails'.
     * @param {Number} Id of element to be removed.
     */
    removeQuestion (id) {
      let index = this.questionDetails.indexOf(element => element.id === id)
      if (index > -1) {
        this.questionDetails.splice(index, 1)
      }
    }
  }
}
</script>

<style>

</style>
