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

Name:     components/Popups/PopupInputLimitLen.vue
Purpose:  Input popup that limits the length of the input by a custom length.
Methods:  Configurations are done through props and validation through Vuelidate.

## -->

<template>
  <q-popup-edit
    buttons
    :title="title"
    v-model="inputVal"
    :validate="validateInput"
    @save="save"
  >
    <q-input
      dense autofocus filled hide-bottom-space
      clearable
      clear-icon="close"
      :label="label"
      :value="inputVal"
      @input="setInputVal($event)"
      :rules="[
        val => $v.inputVal.required || 'Field is required',
        val => $v.inputVal.maxLength || `Max length is ${lenLimit} characters`
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
      inputVal: this.initialValue // <String>: Temporary value for submission.
    }
  },
  validations () {
    return {
      inputVal: {
        required,
        maxLength: maxLength(this.lenLimit)
      }
    }
  },
  methods: {
    /** Fires an event with the value to be saved. */
    save () {
      this.$emit('save', this.inputVal)
    },
    /**
     * Sets the input value then notifies Vuelidate.
     * @param {String} inputValue New value for this.editName.
     * @return {Boolean}
     */
    setInputVal (inputValue) {
      this.inputVal = inputValue
      this.$v.inputVal.$touch()
    },
    /**
     * Validation for the input value.
     * @param {String} val Dummy, unused variable for the QPopupEdit API
     * @return {Boolean} Whether or not inputVal's validator is falsey.
     */
    validateInput (val) {
      return !this.$v.inputVal.$invalid
    }
  }
}
</script>

<style lang="stylus">

.q-popup-edit
  max-width 200px
</style>
