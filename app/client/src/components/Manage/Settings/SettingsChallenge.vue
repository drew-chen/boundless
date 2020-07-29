<template>
  <admin-settings
    :keywords="configs.keywords"
    :type="'challenges'"
    :ratio="previewRatio"
    @submitting="consoleLoading"
    @submitted="loadChallengeConfig"
  />
</template>

<script>
import AdminSettings from '../../../components/AdminSettings.vue'

export default {
  components: {
    AdminSettings
  }
}
</script>

<style>

</style>
