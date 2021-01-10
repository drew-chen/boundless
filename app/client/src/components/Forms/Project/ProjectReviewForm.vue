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

Name:     components/Forms/Proejct/ProjectReviewForm.vue
Purpose:

  Read only view that allows user to review their input and decide
  whether or not to submit.

Methods:

  Accesses input from Vuex getters. Final project submission is handled
  by the parent component: 'SubmitProject.vue'.

## -->

<template>
  <div>
    <h5>Review</h5>
    <div
      class="container"
    >
      <!-- -------------------- Main form review -------------------- -->

      <h6>Main info</h6>

      <q-input
        borderless readonly stack-label
        label="Project Name"
        :value="projectName"
      >
        <template v-slot:prepend>
          <q-icon class="q-mr-sm" name="fas fa-project-diagram" />
        </template>
      </q-input>

      <q-input
        borderless autogrow readonly stack-label
        class="q-my-sm"
        label="Description/Overview"
        type="textarea"
        :value="projectDescription"
      >
        <template v-slot:prepend>
          <q-icon name="far fa-comment-alt" />
        </template>
      </q-input>

      <q-separator color="grey-5" />

      <div class="row q-pa-sm" align="left">
        <p class="col-4 header">Keywords:</p>

        <q-option-group
          dense inline disable stack-label
          class="col" type="checkbox"
          :options="keywordOptions"
          :value="projectKeywords"
        />
      </div>

      <q-separator color="grey-5" />

      <div>
        <div class="row">
          <p class="col q-pa-sm header" align="left">
            Team Members:
          </p>
        </div>

        <div
          v-for="(member, index) in projectMembers"
          :key="index"
          class="row q-col-gutter-y-sm items-center"
        >
          <q-input
            borderless readonly stack-label
            class="col-5 q-pr-xs"
            label="Contributor's Email" type="email"
            :value="projectMembers[index].email"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            borderless readonly stack-label
            class="col-3 q-pl-xs"
            label="Contributor's Full Name"
            :value="projectMembers[index].name"
          >
            <template v-slot:prepend>
              <q-icon name="group" />
            </template>
          </q-input>

          <div class="col"
              v-if="projectMembers[index].role == 'lead'"
          >
              Lead
          </div>
        </div>
      </div>

      <!-- -------------------- Custom form review -------------------- -->

      <div v-if="customFormEnabled">

        <h6>Additional questions</h6>

        <div v-if="customFormResponse && customFormResponse.length > 0">
          <div
            v-for="question in customFormResponse"
            :key="question.label"
          >
            <q-separator color="grey-5" />

            <q-input
              borderless readonly stack-label
              class="q-mt-sm"
              :label="question.label"
              :type="question.type.value"
              :value="question.response"
            />
          </div>

          <q-separator color="grey-5" />

        </div>
        <div v-else>
          <p>(no custom form questions for this project)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    // The name of the project.
    projectName: {
      type: String,
      required: true
    },
    // Description of project.
    projectDescription: {
      type: String,
      required: true
    },
    //  List of project member/s.
    projectMembers: {
      type: Array,
      required: true
    },
    // List of keywords from database.
    keywordOptions: {
      type: Array,
      required: true
    },
    // Chosen subset of keywordOptions for the project.
    projectKeywords: {
      type: Array,
      required: true
    },
    // Each element is an object with a custom question and its response.
    customFormResponse: {
      type: Array,
      required: true
    },
    // Whether or not the custom form should be displayed or not.
    customFormEnabled: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>

h6
  margin 0 !important

</style>
