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
      v-model="value"
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
            @click="onSave"
            color="secondary"
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
            @click="onCancel"
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
    // Whether this dialog is open or not. Used with v-model.
    value: {
      type: Boolean,
      required: true
    }
  },
  /** Accessed via refs in parent. */
  methods: {
    /**
     * Initializes the methods run when a button is clicked.
     *
     * @param {Function} save Function to be called to handle saving the page.
     * @param {Function} next This function must be called to resolve the hook.
     *  This is the exact same object as beforeRouteLeave's 'next' method.
     * @param {Function} onLeave Additonal method to be run during leaving.
     * @returns {Object} This component instance (to allow method chaining).
     */
    constructMethods (save, next, onLeave) {
      this.save = save
      this.next = next
      this.leave = () => {
        onLeave()
        this.next()
      }
    },
    /** Method for when the "Save" button is clicked. */
    onSave () {
      this.save()
      this.leave()
      // Sets the dialogOpen flag in parent to false.
      this.$emit('input', false)
    },
    /** Method for when the "Don't Save" button is clicked */
    onNoSave () {
      this.leave()
      this.$emit('input', false)
    },
    /** Method for when the "Cancel" button is clicked */
    onCancel () {
      this.next(false)
      this.$emit('input', false)
    },
    /** Method using for saving. */
    save () {
    },
    /** Method ran for leaving. */
    leave () {
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-card__section
  min-width: 500px

</style>
