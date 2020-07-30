<template>
  <admin-settings
    :keywords="settingProps.keywords"
    type="projects"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.setProjectConfig"
  />
</template>

<script>
import AdminSettings from '../../../components/AdminSettings.vue'

export default {
  props: {
    // Object containing all custom props. See structure in 'ManageSettings.vue'.
    settingProps: {
      type: Object,
      required: true,
      validator (prop) {
        return prop.hasOwnProperty('name') && prop.name === 'projects'
      }
    }
  },
  components: {
    AdminSettings
  }
}
</script>

<style>

</style>
