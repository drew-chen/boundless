<template>
  <admin-settings
    :keywords="settingProps.keywords"
    type="projects"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.loadProjectConfig"
  />
</template>

<script>
import AdminSettings from '../../../components/AdminSettings.vue'

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
