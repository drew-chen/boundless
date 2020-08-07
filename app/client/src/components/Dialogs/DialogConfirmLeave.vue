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

Name:     components/Dialog/DialogConfirmLeave.vue
Purpose:

  When a user leaves a page with unsaved changes, this dialog asks the
  user whether or not to save or don't save the changes before leaving.
  Additionally, this dialog gives the option to cancel leaving the page.

Methods:

  To function, the component calls the appropriate saving and/or
  routing methods that are either given as props, or function parameters.

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
    // Additional method to be run while leaving.
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
     * Main method of interaction. Opens the dialog and initializes methods.
     * @param {Function} next This function must be called to resolve the hook.
     *  In other words, this is the function controlling routing. See
     *  https://router.vuejs.org/guide/advanced/navigation-guards.html.
     */
    open (next) {
      this.leave = () => {
        this.onLeave()
        next()
      }
      this.onCancel = () => {
        this.dialogOpen = false
        next(false)
      }
      this.dialogOpen = true
    },
    /** Method for when the "Save" button is clicked. */
    async onSave () {
      this.dialogOpen = false
      await this.save()
      // Sets the dialogOpen flag in parent to false.
      this.leave()
    },
    /** Method for when the "Don't Save" button is clicked. */
    onNoSave () {
      this.dialogOpen = false
      this.undo()
      this.leave()
    },
    /**
     * Method for when the "Cancel" button is clicked. Note: when cancelling,
     * the page is not left. Initialized when dialog is opened.
     */
    onCancel () {
    },
    /** Method run for leaving. Initialized when dialog is opened. */
    leave () {
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-card__section
  min-width: 500px

</style>
