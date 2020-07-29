<template>
  <system-settings
    @usersConfigInfo="settingProps.loadUserConfig"
    @challengesConfigInfo="settingProps.loadChallengeConfig"
    @projectsConfigInfo="settingProps.loadProjectConfig"
    @keywords="settingProps.loadKeywords"
    @submitting="settingProps.consoleLoading"
  />
</template>

<script>
import SystemSettings from '../../../components/SystemSettings'

export default {
  props: {
    // Object containing all custom props. See structure in 'ManageSettings.vue'.
    settingProps: {
      type: Object,
      required: true
    }
  },
  components: {
    SystemSettings
  }
}
</script>

<style>

</style>
