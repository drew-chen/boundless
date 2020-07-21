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
      <q-form class="q-ma-lg">
        <div class="q-mb-md">
          <q-btn
            round
            @click="addQuestionTemplate"
            class="q-mr-sm"
            icon="add"
            color="accent"
          >
            <q-tooltip>
              Add question
            </q-tooltip>
          </q-btn>
          <q-btn
            no-caps
            @click="saveQuestionTemplates"
            :disable="!isModified"
            color="accent"
          >
            Save
          </q-btn>
        </div>
        <!-- Native drag and drop API is disabled to prevent flickering issues. -->
        <draggable
          v-model="questionTemplates"
          @end="updateQuestionOrder"
          handle=".handle"
          ghost-class="ghost-question"
          :force-fallback="true"
          fallback-class="hide-question-preview"
          animation="175"
        >
          <transition-group
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <q-card
              flat
              class="row items-center full-height"
              v-for="(questionTemplate, index) in questionTemplates"
              :key="questionTemplate.order"
            >
              <q-icon
                class="handle col-1"
                size="sm"
                color="grey"
                name="drag_indicator"
              />
              <q-input
                @click.stop=""
                filled clearable
                clear-icon="close"
                class="q-mx-sm col-5"
                label="Question Label"
                v-model="questionTemplate.label"
                placeholder="Untitled Question"
              />
              <q-select
                filled
                v-model="questionTemplate.type"
                :options="options"
                label="Response Type"
                class="q-mx-sm col-3"
              >
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section avatar>
                      <q-icon :name="scope.opt.icon"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="scope.opt.label" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-toggle
                v-model="questionTemplate.required"
                color="secondary"
                label="required"
                class="col-2"
              />
              <div class="col-1">
                <q-btn
                  round flat
                  @click="deleteQuestionTemplate(index)"
                  icon="delete"
                />
              </div>
            </q-card>
          </transition-group>
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
      isModified: false, // <Boolean>: Whether questionTemplates has changed.
      options: [ // Array<Object>: Possible input template types.
        {
          value: 'text', // <String> HTML input type.
          icon: 'short_text', // <String>: Icon name.
          label: 'Short Answer' // <String>: Option label viewed by user.
        },
        {
          value: 'textarea',
          icon: 'subject',
          label: 'Paragraph'
        },
        {
          value: 'email',
          icon: 'email',
          label: 'Email'
        },
        {
          value: 'number',
          icon: 'fas fa-hashtag',
          label: 'Number'
        },
        {
          value: 'date',
          icon: 'event',
          label: 'Date'
        },
        {
          type: 'url',
          icon: 'link',
          label: 'Link'
        }
      ],
      questionTemplates: [], // <Array<Object> List of question templates.
      newQuestionTemplate: {
        label: '', // <String>: Name of the question.
        type: { // <Object>: Question type which is same as an element of 'options'.
          value: 'text',
          icon: 'short_text',
          label: 'Short Answer'
        },
        required: false, // <String>: Whether a response is necessary
        /**
         * <Integer>: Index which is only unique within an individual
         * 'questionTemplates' instance.
         */
        order: 0
      }
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
        type: {
          value: 'text',
          icon: 'short_text',
          label: 'Short Answer'
        },
        label: '',
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
  max-width: 1050px

/*
Handle also define row height. This is done so the cursor can stay
consistent near the handle, instead of swapping back and forth.
*/
.handle
  cursor: move
  height: 80px
  width: 40px

// During drag and drop movement, this class is used.
.ghost-question
  background: $grey-3
/*
This is the drag preview that is directly under your mouse. This is
hidden because this preview covers the chosen question making it harder to
see the chosen question.
*/
.hide-question-preview
  display: none

</style>
