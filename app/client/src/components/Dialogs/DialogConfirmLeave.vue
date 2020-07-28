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
  forms.

## -->

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      persistent
      v-model="isOpen"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Title</div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
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
    // <Boolean>: Whether this dialog is open or not.
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    /** Accessed via refs. */
    onSave (callback) {

    },
    onNoSave (callback) {

    },
    onCancel (callback) {

    }
  }
}
</script>
