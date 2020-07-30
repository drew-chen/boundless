<template>
  <system-settings
    @usersConfigInfo="settingProps.setUserConfig"
    @challengesConfigInfo="settingProps.setChallengeConfig"
    @projectsConfigInfo="settingProps.setProjectConfig"
    @keywords="settingProps.setKeywords"
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
      required: true,
      validator (prop) {
        return prop.hasOwnProperty('name') && prop.name === 'general'
      }
    }
  },
  components: {
    SystemSettings
  }
}
</script>

<style>

</style>
