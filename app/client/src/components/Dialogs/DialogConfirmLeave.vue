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
    // Function to be called to handle saving the page.
    save: {
      type: Function,
      required: true
    },
    // Additonal method to be run while leaving.
    onLeave: {
      type: Function,
      default: () => {}
    },
    // Resets unsaved changes if possible.
    undo: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
    // <Boolean>: Whether this dialog is open or not.
      dialogOpen: this.value
    }
  },
  /** Accessed via refs in parent. */
  methods: {
    /**
     * Opens the dialog and initializes 'leave'.
     * @param {Function} next This function must be called to resolve the hook.
     */
    open (next) {
      this.leave = () => {
        this.onLeave()
        next()
      }
      this.dialogOpen = true
    },
    /** Method for when the "Save" button is clicked. */
    onSave () {
      this.save()
      // Sets the dialogOpen flag in parent to false.
      this.dialogOpen = false
      this.leave()
    },
    /** Method for when the "Don't Save" button is clicked. */
    onNoSave () {
      this.undo()
      this.dialogOpen = false
      this.leave()
    },
    /**
     * Method for when the "Cancel" button is clicked. Note: when cancelling,
     * the page is not left.
     */
    onCancel () {
      this.dialogOpen = false
      this.next(false)
    },
    /** Method run for leaving. Initialized in created hook. */
    leave () {
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-card__section
  min-width: 500px

</style>
