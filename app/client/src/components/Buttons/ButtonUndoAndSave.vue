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

Name:     components/Buttons/ButtonUndoAndSave.vue
Purpose:  Groups together undo and submit buttons so that they are consistent.
Methods:  Created like normal buttons except functionality is passed through
          props.

## -->

<template>
  <div class="row">
    <div class="q-ma-xs">
      <q-btn
        no-caps flat
        :disabled="disabled"
        label="Undo"
        :color="disabled ? 'accent' : 'secondary'"
        @click="undo"
      >
        <q-tooltip>
          Reset unsaved changes
        </q-tooltip>
      </q-btn>
    </div>
    <div class="q-ma-xs">
      <q-btn
        no-caps
        :disabled="disabled"
        label="Save"
        :color="disabled ? 'accent' : 'secondary'"
        @click="save"
      >
        <q-tooltip>
          Save changes
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // Whether or not both buttons are disabled or not.
    disabled: {
      type: Boolean,
      required: true
    },
    // Called when undo button is clicked.
    save: {
      type: Function,
      required: true
    },
    // Called when undo button is clicked.
    undo: {
      type: Function,
      required: true
    }
  }
}
</script>

<style>

</style>
