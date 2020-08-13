// Modifies a local copy then syncs with parent data using v-model.

<template>
  <q-card class="q-pa-md">
    <div class="row" align="left">
       <!-- Remove align left -->
      <strong>Custom Chip</strong>
      <hr class="col q-ml-sm">
    </div>
    <!-- Chip label -->
    <q-input
      filled dense
      class="q-mt-sm" label="Custom Chip Label"
      placeholder="Please enter the label for the custom chip."
      v-model="chip.label"
      :rules="[val => !!val || 'Field is required']"
      :autofocus="addedChip"
      @focus="addedChip = false"
    />
    <!-- Chip url -->
    <q-input
      filled dense
      class="q-mt-sm" label="Custom Chip URL"
      placeholder="Link to video goes here. (Currently only supports one.)"
      v-model="chip.url"
      :rules="[val => !!val || 'Field is required']"
      @focus="addedChip = false"
    />
    <!-- Chip icon and label -->
    <q-select
      filled
      v-model="chip.type"
      :options="options"
      label="Chip Type"
      class="q-mx-sm col-3"
      :disable="!customFormEnabled"
    >
    <!-- show icon -->
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <q-icon :name="scope.opt.icon"/>
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </q-card>
</template>

<script>
export default {
  model: {
    prop: 'chip',
    event: 'change'
  },
  props: {
    chip: {
      type: Object,
      required: true,
      validator (val) {
        return val.hasOwnProperty('icon') &&
          val.hasOwnProperty('label') &&
          val.hasOwnProperty('type') &&
          val.hasOwnProperty('url')
      }
    },
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // <Object>: The chip being modified by this component.
      inputChip: {
        ...this.chip
      }
    }
  },
  methods: {
    /** Updates the chip label. */
    updateLabel (inputLabel) {
      this.inputChip.label = inputLabel
      this.$emit('change', this.inputChip)
    },
    /** Updates the chip url. */
    updateUrl (inputUrl) {
      this.inputChip.label = inputUrl
      this.$emit('change', this.inputChip)
    },
    /** Updates the chip icon. */
    updateIcon (inputIcon) {
      this.inputChip.label = inputIcon
      this.$emit('change', this.inputChip)
    }
  }
}
</script>

<style>

</style>
