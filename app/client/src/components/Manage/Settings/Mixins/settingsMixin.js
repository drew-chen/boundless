/**
 * Creates a mixin which holds reusable functionality across settings.
 */
export default {
  mounted () {
    window.addEventListener('beforeunload', this.confirmUnload)
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.confirmUnload)
  },
  methods: {
    /**
     * Blocks reloading or closing the webpage if there are
     * unsaved changes.
     *
     * @param event The event which has occurred: 'beforeunload'.
     */
    confirmUnload (event) {
      // Defined in mixed-in component.
      if (this.updated) {
        // Cancel the event.
        // If you prevent default behavior in Mozilla Firefox prompt will always be shown.
        event.preventDefault()
        // Chrome requires returnValue to be set.
        event.returnValue = 'You should keep this page open.'
      }
    }
  }
}
