<template>
  <admin-settings
    v-if="settingProps.name === 'projects'"
    :keywords="settingProps.keywords"
    type="projects"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.setProjectConfig"
  />
</template>

<script>
import AdminSettings from './Shared/AdminSettings.vue'

export default {
  props: {
    // Object containing all custom props. See structure in 'ManageSettings.vue'.
    settingProps: {
      type: Object,
      required: true
    }
  },
  components: {
    AdminSettings
  }
}
</script>

<style>

</style>
