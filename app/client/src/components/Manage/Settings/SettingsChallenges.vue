<template>
  <admin-settings
    v-if="settingProps.name === 'challenges'"
    :keywords="settingProps.keywords"
    type="challenges"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.setChallengeConfig"
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
