<template>
  <admin-settings
    v-if="settingProps.name === 'challenges'"
    :keywords="settingProps.keywords"
    type="challenges"
    :ratio="settingProps.previewRatio"
    @submitting="settingProps.consoleLoading"
    @submitted="settingProps.setChallengeConfig"
    ref="adminSettings"
  />
</template>

<script>
import AdminSettings from './Components/AdminSettings.vue'

export default {
  props: {
    // Object containing all custom props. See structure in 'ManageSettings.vue'.
    settingProps: {
      type: Object,
      required: true
    }
  },
  /**
   * Block leaving with persistent dialog if changes have been made.
   * View specifics on navigation guards at:
   * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
   *
   * @param {Object} to The target Route Object being navigated to.
   * @param {Object} from The current route being navigated away from.
   * @param {Function} next This function must be called to resolve the hook.
   */
  beforeRouteLeave (to, from, next) {
    if (this.settingProps.name === 'challenges') {
      this.$refs.adminSettings.openConfirmLeaveDialog(next)
    } else {
      next()
    }
  },
  components: {
    AdminSettings
  }
}
</script>

<style>

</style>
