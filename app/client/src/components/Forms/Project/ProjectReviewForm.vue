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
    <!-- -------------------- Page Loader -------------------- -->
  <div>
    <h5>Review</h5>
    <div
      class="container"
    >
      <!-- Main form review. -->
      <q-input
        filled readonly
        label="Project Name"
        :value="projectName"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-project-diagram" />
        </template>
      </q-input>

      <q-input
        filled autogrow readonly
        class="q-my-sm"
        label="Description/Overview"
        type="textarea"
        :value="projectDescription"
      >
        <template v-slot:prepend>
          <q-icon name="far fa-comment-alt" />
        </template>
      </q-input>

      <hr class="newLine2">

      <div class="row q-pa-sm" align="left">
        <p class="col-4 header">Keywords:</p>

        <q-option-group
          dense inline disable
          class="col" type="checkbox"
          :options="keywordOptions"
          :value="projectKeywords"
        />
      </div>

      <hr class="newLine2">

      <div>
        <div class="row">
          <p class="col q-pa-sm header" align="left">
            Team Members:
          </p>
        </div>

        <div
          v-for="(member, index) in projectMembers"
          :key="index"
          class="row q-mb-xs"
        >
          <q-input
            filled readonly
            class="col q-pr-xs"
            label="Contributor's Email" type="email"
            :value="projectMembers[index].email"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            filled readonly
            class="col q-pl-xs"
            label="Contributor's Full Name"
            :value="projectMembers[index].name"
          >
            <template v-slot:prepend>
              <q-icon name="group" />
            </template>
          </q-input>

          <div class="col-1">
            <q-card flat align="center">
              Lead
              <q-toggle
                disable
                color="secondary"
                true-value="lead"
                false-value="member"
                :value="projectMembers[index].role"
              />
            </q-card>
          </div>
        </div>
      </div>

      <!-- Custom form review. -->

      <div v-if="customFormEnabled">
        <div
          v-for="question in questions"
          :key="question.label"
        >
          <q-input
            filled readonly
            class="q-mt-sm"
            placeholder="a"
            :label="question.label"
            :type="question.type.value"
            :value="question.response"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('projectSubmit')

export default {
  computed: {
    ...mapGetters([
      'projectName',
      'projectDescription',
      'projectMembers',
      'keywordOptions',
      'projectKeywords',
      'questions',
      'customFormEnabled'
    ])
  }
}
</script>

<style>

</style>
