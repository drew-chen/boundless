<template>
  <admin-settings
    :keywords="configs.keywords"
    :type="'projects'"
    :ratio="previewRatio"
    @submitting="consoleLoading"
    @submitted="loadProjectConfig"
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
