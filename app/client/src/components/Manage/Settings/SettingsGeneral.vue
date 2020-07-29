<template>
  <system-settings
    @usersConfigInfo="loadUserConfig"
    @challengesConfigInfo="loadChallengeConfig"
    @projectsConfigInfo="loadProjectConfig"
    @keywords="loadKeywords"
    @submitting="consoleLoading"
  />
</template>

<script>
import SystemSettings from '../../../components/SystemSettings'

export default {
  components: {
    SystemSettings
  }
}
</script>

<style>

</style>
