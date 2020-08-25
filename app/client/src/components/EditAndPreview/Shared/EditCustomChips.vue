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

Name:     components/EditAndPreview/Shared/EditCustomChips.vue
Purpose:  A view to edit a custom chip's label, url, and icon.
Methods:

  Works by using v-model. A chip object prop is displayed then copied. This
  copy is edited locally whenever the user inputs. Then, an event is fired telling
  the parent component to update the value of the chip prop.

## -->
<template>
  <q-card class="q-pa-md">
    <div class="row">
      <strong>Custom Chip</strong>
      <hr class="col q-ml-sm">
    </div>
    <!-- Chip label -->
    <div class="row q-col-gutter-sm">
      <div class="col">
        <q-input
          filled clearable
          label="Custom Chip Label"
          placeholder="Please enter the label for the custom chip."
          clear-icon="close"
          :value="chip.label"
          @input="updateLabel($event)"
          :rules="[val => !!val || 'Field is required']"
          :autofocus="addedChip"
          @focus="$emit('focus')"
        />
      </div>
      <!-- Chip icon and label -->
      <div class="col">
        <q-select
          filled
          :value="getIconLabel(chip.icon)"
          @input="updateIcon($event)"
          :options="options"
          label="Chip Type"
        >
          <!-- Show icon with selected value -->
          <template v-slot:selected>
              <div>
                <q-icon :name="chip.icon"/>
                {{ getIconLabel(chip.icon) }}
              </div>
          </template>
          <!-- show icon in selection options -->
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-icon :name="scope.opt.value"/>
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <!-- Chip url -->
    <q-input
      filled dense clearable
      label="Custom Chip URL"
      placeholder="Link to video goes here. (Currently only supports one.)"
      clear-icon="close"
      :value="chip.url"
      @input="updateUrl($event)"
      :rules="[val => !!val || 'Field is required']"
      @focus="$emit('focus')"
    />
  </q-card>
</template>

<script>
export default {
  // Emitting the change event notifies the parent to update chip's value.
  model: {
    prop: 'chip',
    event: 'change'
  },
  props: {
    chip: {
      type: Object,
      required: true,
      validator (val) {
        return val.hasOwnProperty('label') &&
          val.hasOwnProperty('icon') &&
          val.hasOwnProperty('url') &&
          val.hasOwnProperty('type') &&
          val.type === 'CUSTOM'
      }
    },
    options: {
      type: Array,
      required: true
    },
    addedChip: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      inputChip: { // <Object>: The chip being modified by this component.
        label: this.chip.label, // <String> Name of the chip icon.
        icon: this.chip.icon, // <String> Label for this chip.
        url: this.chip.url, // <String> Chip link.
        type: this.chip.type // <String> Type of chip, which must always be 'CUSTOM'.
      }
    }
  },
  methods: {
    /**
     * The icon value is the string used by Quasar to identify a certain icon.
     * The icon label is the name of the icon that we give to it and that is
     * displayed as text beside the icon.
     *
     * Given an icon value, it return's the respective label.
     * For ex: getIconLabel('video') === 'Video'
     * @param {String} iconValue The name/identity of the icon.
     */
    getIconLabel (iconValue) {
      if (!Array.isArray(this.options) || !this.options.length) {
        return ''
      }
      const { label } = this.options.find(option => option.value === iconValue)
      return label
    },
    /**
     * Updates the chip label to the label that was inputted.
     * @param {String} inputLabel The inputted label.
     */
    updateLabel (inputLabel) {
      this.inputChip.label = inputLabel
      this.$emit('change', this.inputChip)
      this.$emit('updated')
    },
    /**
     * Updates the chip url to the value that was inputted.
     * @param {String} inputUrl The inputted url.
     */
    updateUrl (inputUrl) {
      this.inputChip.url = inputUrl
      this.$emit('change', this.inputChip)
      this.$emit('updated')
    },
    /**
     * Updates the chip icon to the value selected.
     * @param option {Object} The option selected from 'options'.
     * @param option.value {String} The name of the icon.
     */
    updateIcon ({ value }) {
      this.inputChip.icon = value
      this.$emit('change', this.inputChip)
      this.$emit('updated')
    }
  }
}
</script>

<style>

</style>
