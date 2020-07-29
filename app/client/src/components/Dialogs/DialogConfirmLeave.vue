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
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Save your changes to settings?</div>
        </q-card-section>

        <q-card-section>
          You have unsaved changes.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            no-caps
            @click="onSave"
          >
            Save
          </q-btn>
          <q-btn
            flat no-caps
            @click="onNoSave"
          >
            Don't Save
          </q-btn>
          <q-btn
            flat no-caps
            @click="onNoSave"
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
     * When the "save" button is clicked, call the given callback.
     *
     * @param {Function} callback Function to be called.
     * @returns {Object} This component instance (to allow method chaining).
     */
    onSave (callback) {
      callback()
      return this
    },
    /**
     * When the "don't save" button is clicked, call the given callback.
     *
     * @param {Function} callback Function to be called.
     * @returns {Object} This component instance (to allow method chaining).
     */
    onNoSave (callback) {
      callback()
      return this
    },
    /**
     * When the "cancel" button is clicked, call the given callback.
     *
     * @param {Function} callback Funtion to be called.
     * @returns {Object} This component instance (to allow method chaining).
     */
    onCancel (callback) {
      callback()
      return this
    }
  }
}
</script>
