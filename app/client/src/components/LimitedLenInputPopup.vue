<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     components/GetDataFromFirestore.vue
Purpose:  To allow the user to export data from firestore and import data
          into firestore
Methods:
  * Allows user to edit a string, usually a name. Defers two way binding until
  * validated and submitted.

## -->

<template>
  <q-popup-edit
    buttons
    :title="title"
    v-model="editedName"
    :validate="validateName"
    @save="save"
  >
    <q-input
      dense autofocus filled hide-bottom-space
      :label="label"
      :value="editedName"
      @input="updateEditedName($event)"
      :rules="[
        val => $v.editedName.required || 'Field is required',
        val => $v.editedName.maxLength || 'Max length is 60 characters'
      ]"
    />
  </q-popup-edit>
</template>

<script>

import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  props: {
    initialValue: {
      type: String,
      required: true
    },
    lenLimit: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editedName: this.initialValue // <String>: Temporary name for submission
    }
  },
  validations () {
    return {
      editedName: {
        required,
        maxLength: maxLength(this.lenLimit)
      }
    }
  },
  methods: {
    save () {
      this.$emit('save', this.editedName)
    },
    updateEditedName (inputValue) {
      /**
       * Sets this.editName then notifies Vuelidate.
       * @param {String} inputValue New value for this.editName.
       * @return {Promise<Boolean>}
      */
      this.editedName = inputValue
      this.$v.editedName.$touch()
    },
    validateName (val) {
      /**
       * Validation for the challenge name: editedName.
       * @param {String} val Dummy, unused variable for the QPopupEdit API
       * @return {Promise<Boolean>}
       */
      return !this.$v.editedName.$invalid
    }
  }
}
</script>

<style>

</style>
