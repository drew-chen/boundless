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

Name:     components/Forms/Project/ProjectCreateCustomForm.vue
Purpose:  Form configures 'ProjectCustomForm.vue'.
Methods:

  Admin goes through this form which creates an array that
  'ProjectCustomForm.vue' can display. Questions support CRUD operations
  and can be reordered through drag and dropping them. This array is
  saved in Vuex and submitted to the db in a Vuex action. Submission is
  triggered in the parent component via a ref.

## -->

<template>
  <div>
    <div
      v-if="type === 'projects'"
    >
      <div class="text-h4 q-mb-md">
        Project Custom Questions Form
      </div>
      <q-separator color="secondary" />
      <p class="q-ma-sm">
        This allows the admin to create an additional set of questions to be answered upon project submission.
      </p>
      <q-card
        flat bordered
        class="q-ma-sm"
      >
        <q-form
          class="q-ma-lg"
          ref="form"
        >
          <!-- -------------------- Form controls -------------------- -->

          <div class="q-mb-md">
            <q-toggle
              v-model="customFormEnabled"
              color="green"
              label="Enable"
            />
            <q-btn
              round
              @click="addQuestionTemplate"
              class="q-mr-md float-right"
              icon="add"
              color="accent"
              size="md"
              :disable="!customFormEnabled"
            >
              <q-tooltip>
                Add question
              </q-tooltip>
            </q-btn>
          </div>
          <q-separator
            inset
            class="q-my-sm"
          />
          <div v-if="!Array.isArray(questionTemplates) || !questionTemplates.length">
            No custom questions configured.
          </div>
          <!-- -------------------- List of question templates -------------------- -->

          <!-- Native drag and drop API is disabled to prevent flickering issues (force-fallback). -->
          <draggable
            v-else
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
                class="row q-col-gutter-x-sm items-center full-height"
                v-for="(questionTemplate, index) in questionTemplates"
                :key="questionTemplate.order"
              >
                <!-- Drag handle -->
                <q-icon
                  class="handle col-1"
                  size="sm"
                  color="grey"
                  name="drag_indicator"
                  :disabled="!customFormEnabled"
                />
                <!-- Question label -->
                <q-input
                  filled clearable
                  clear-icon="close"
                  class="col-3 col-md-5 question-template-label-centering"
                  label="Question Label"
                  v-model="questionTemplate.label"
                  placeholder="Untitled Question"
                  :disable="!customFormEnabled"
                  :rules="[val => !!val || 'Question labels cannot be blank.']"
                />
                <!-- Response type -->
                <q-select
                  filled
                  v-model="questionTemplate.type"
                  :options="options"
                  label="Response Type"
                  class="col-3"
                  :disable="!customFormEnabled"
                >
                  <!-- Display option's icon and label. -->
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
                  class="col-2 col-sm-auto"
                  :disable="!customFormEnabled"
                />
                <div class="col-1">
                  <q-btn
                    round flat
                    @click="deleteQuestionTemplate(index)"
                    icon="delete"
                    :disable="!customFormEnabled"
                  />
                </div>
              </q-card>
            </transition-group>
          </draggable>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import cloneDeep from 'lodash/clonedeep'
import { createNamespacedHelpers } from 'vuex'
// Ensures mapActions and mapGetters can only use the 'store/project-submit' module.
const { mapActions, mapGetters } = createNamespacedHelpers('projectSubmit')

export default {
  components: {
    draggable
  },
  props: {
    // Represents whether the parent component is handling projects or challenges.
    type: {
      type: String,
      required: true,
      validator (value) {
        // The value must match one of these strings.
        return ['projects', 'challenges'].indexOf(value) !== -1
      }
    }
  },
  /**
   * Initialize data from the store. Cloning is needed for non-primitive types
   * so that Vuex store isn't modified unintentionally.
   */
  async created () {
    this.questionTemplates = cloneDeep(this.storeQuestionTemplates)
    this.customFormEnabled = this.storeCustomFormEnabled
    this.modified = false
  },
  mounted () {
    // Skip the first change so that the watcher isn't triggered by initialization.
    this.$nextTick(() => {
      this.dataLoaded = true
    })
  },
  watch: {
    /**
     * If 'questionTemplate' changes, even if it's the same as the
     * version in the database, then it is marked as modified. This is to
     * keep change detection simple and consistent with the rest of the
     * settings. The initialization does not count as a change.
     */
    questionTemplates: {
      deep: true,
      handler (newArr, oldArr) {
        this.modified = this.dataLoaded
        if (this.modified) {
          this.$emit('modified')
        }
      }
    },
    /**
     * If 'customFormEnabled' changes then there are changes to be saved.
     */
    customFormEnabled (val) {
      this.modified = this.dataLoaded
      if (this.modified) {
        this.$emit('modified')
      }
    }
  },
  computed: {
    ...mapGetters({
      storeQuestionTemplates: 'questionTemplates',
      storeCustomFormEnabled: 'customFormEnabled'
    })
  },
  data () {
    return {
      /*
      <Boolean>: Whether custom forms are used during project creation.
      This also disables the editing of custom forms.
      */
      customFormEnabled: true,
      modified: false, // <Boolean>: Whether questionTemplates has changed.
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
      newQuestionTemplate: { // <Object>: Question to be added to question templates.
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
      },
      /*
      <Boolean>: Whether local state has been set to the db state.
      Used with watchers to avoid checking for changes when initializing.
      */
      dataLoaded: false
    }
  },
  methods: {
    ...mapActions([
      'submitQuestionTemplates',
      'submitCustomFormEnabled'
    ]),
    /** Submits questionTemplates with non-empty labels to vuex and to the db. */
    async submit () {
      if (this.modified) {
        this.$refs.form.validate()
          .then(async success => {
            await this.submitCustomFormEnabled(this.customFormEnabled)
            if (success) {
              this.updateQuestionOrder()
              await this.submitQuestionTemplates(cloneDeep(this.questionTemplates))
              this.modified = false
            } else {
              const titledQuestions = this.questionTemplates.filter(question => {
                return question.label && question.label !== ''
              })
              await this.submitQuestionTemplates(cloneDeep(titledQuestions))
              this.modified = false
              this.$q.notify({
                type: 'negative',
                message: 'Saved all questions except untitled questions.'
              })
            }
          }).catch(error => {
            this.$q.notify({
              type: 'negative',
              message: 'Error: unable to submit question templates.'
            })
            throw error
          })
      }
    },
    /** Creates another question. */
    addQuestionTemplate () {
      this.newQuestionTemplate.order = this.questionTemplates.length
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
      this.updateQuestionOrder()
    },
    /** Ensures that a question's order is it's index. Does not affect view. */
    updateQuestionOrder () {
      this.questionTemplates.forEach((question, index) => {
        question.order = index
      })
    },
    /**
     * Reactively sets local questionTemplates to same state in Vuex store.
     */
    reset () {
      this.dataLoaded = false
      Vue.set(this.$data, 'questionTemplates', cloneDeep(this.storeQuestionTemplates))
      Vue.set(this.$data, 'customFormEnabled', this.storeCustomFormEnabled)
      this.modified = false
      this.$nextTick(() => {
        this.dataLoaded = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-card
  max-width 1050px

/*
Handle also defines row height, since it is currently the tallest element in the
row. This means the handle is 100% of the row height. This is done so the cursor
can stay consistent near the handle, instead of swapping back and forth.
*/
.handle
  cursor move
  height 80px
  width 40px

/*
This input has an extra element underneath it where form validation messages
are shown. This raises the input box above other input boxes on the same row.
In order to align this input with others, it is pushed down.
*/
.question-template-label-centering
  top 10px
  position relative

// During drag and drop movement, this class is used.
.ghost-question
  background $grey-3

/*
This is the drag preview that is directly under your mouse. This is
hidden because this preview covers the chosen question making it harder to
see the chosen question.
*/
.hide-question-preview
  display none

</style>
