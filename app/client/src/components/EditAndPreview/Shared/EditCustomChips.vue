// Modifies a local copy then syncs with parent data using v-model.
// TODO: rename to EditCustomChip instead of Chips
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
      label="Custom Chip Label"
      placeholder="Please enter the label for the custom chip."
      :value="chip.label"
      @input="updateLabel($event)"
      :rules="[val => !!val || 'Field is required']"
      :autofocus="addedChip"
      @focus="$emit('focus')"
    />
    <!-- Chip url -->
    <q-input
      filled dense
      label="Custom Chip URL"
      placeholder="Link to video goes here. (Currently only supports one.)"
      :value="chip.url"
      @input="updateUrl($event)"
      :rules="[val => !!val || 'Field is required']"
      @focus="$emit('focus')"
    />
    <!-- Chip icon and label -->
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
  </q-card>
</template>

<script>
export default {
  // The change event notifies the parent to update chip's value.
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
      // <Object>: The chip being modified by this component.
      inputChip: {
        label: this.chip.label, // <String> Name of the chip icon.
        icon: this.chip.icon, // <String> Label for this chip.
        url: this.chip.url, // <String> Chip link.
        type: this.chip.type // <String> Type of chip, which must always be 'CUSTOM'.
      }
    }
  },
  methods: {
    getIconLabel (iconValue) {
      if (!Array.isArray(this.options) || !this.options.length) {
        return ''
      }
      const { label } = this.options.find(option => option.value === iconValue)
      return label
    },
    // May need to use vue.set
    /** Updates the chip label. */
    updateLabel (inputLabel) {
      this.inputChip.label = inputLabel
      this.$emit('change', this.inputChip)
      this.$emit('updated')
    },
    /** Updates the chip url. */
    updateUrl (inputUrl) {
      this.inputChip.url = inputUrl
      this.$emit('change', this.inputChip)
      this.$emit('updated')
    },
    /** Updates the chip icon. */
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
