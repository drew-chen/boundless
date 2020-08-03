<template>
  <system-settings
    v-if="settingProps.name === 'general'"
    @usersConfigInfo="settingProps.setUserConfig"
    @challengesConfigInfo="settingProps.setChallengeConfig"
    @projectsConfigInfo="settingProps.setProjectConfig"
    @keywords="settingProps.setKeywords"
    @submitting="settingProps.consoleLoading"
    ref="systemSettings"
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
        return prop.hasOwnProperty('name')
      }
    }
  },
  /**
   * Block leaving with persistent dialog if changes have been made. Since this
   * function needs access to '$refs', it isn't placed in 'routes.js'.
   * View specifics on navigation guards at:
   * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
   *
   * @param {Object} to The target Route Object being navigated to.
   * @param {Object} from The current route being navigated away from.
   * @param {Function} next This function must be called to resolve the hook.
   */
  beforeRouteLeave (to, from, next) {
    if (this.settingProps.name === 'general') {
      this.$refs.systemSettings.openConfirmLeaveDialog(next)
    } else {
      next()
    }
  },
  components: {
    SystemSettings
  }
}
</script>

<style>

</style>
