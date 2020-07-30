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

Name:     components/Dialog/SubmitProject.vue
Purpose:  Wrapper for project submission forms.
Methods:

  Manages the view and submission trigger of multiple child component
  forms. In order to add routing functionality, routing objects accessed in
  the parent's routing guards can be passed to any method using $refs.

## -->

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      persistent
      v-model="dialogOpen"
    >
      <q-card>
        <q-card-section>
          <div class="text-h5">Save changes?</div>
        </q-card-section>
        <q-card-section>
          <p>You are leaving with unsaved changes.</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            no-caps
            @click="saveAndLeave"
            color="secondary"
          >
            Save
          </q-btn>
          <q-btn
            flat no-caps
            @click="leave"
          >
            Don't Save
          </q-btn>
          <q-btn
            flat no-caps
            @click="cancel"
          >
            Cancel
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // Whether this dialog is open or not.
    dialogOpen: {
      type: Boolean,
      required: true
    }
  },
  /** Accessed via refs in parent. */
  methods: {
    /**
     * Sets the action for clicking "save".
     *
     * @param {Function} callback Function to be called.
     * @returns {Object} This component instance (to allow method chaining).
     */
    onSave (callback) {
      this.saveAndLeave = callback
      return this
    },
    /**
     * Sets the action for clicking "don't save".
     *
     * @param {Function} callback Function to be called.
     * @returns {Object} This component instance (to allow method chaining).
     */
    onNoSave (callback) {
      this.leave = callback
      return this
    },
    /**
     * Sets the action for clicking "cancel".
     *
     * @param {Function} callback Funtion to be called.
     * @returns {Object} This component instance (to allow method chaining).
     */
    onCancel (callback) {
      this.cancel = callback
      return this
    },
    /** Method for when the "save" button is clicked. */
    saveAndLeave () {
    },
    /** Method for when the "don't save" button is clicked. */
    leave () {
    },
    /** Method for when the "cancel" button is clicked. */
    cancel () {
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-card__section
  min-width: 500px

</style>
