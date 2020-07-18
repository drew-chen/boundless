<template>
    <!-- -------------------- Page Loader -------------------- -->
  <div>
    <h5>Review</h5>
    <div
      class="container"
    >
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
      <div v-for="question in questions" :key="question.label">
        <q-input
          filled readonly
          class="q-mt-sm"
          placeholder="a"
          :label="question.label"
          :type="question.type"
          :value="question.response"
        />
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
      'questions'
    ])
  }
}
</script>

<style>

</style>
