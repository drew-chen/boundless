/* ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     mixins/mixinConfirmUnload.js
Purpose:

 Reusable mixin which asks to confirm leaving or exiting if there are any unsaved
 changes

Methods:

  To confirm leaving or exiting, the default behavior is blocked. This relies on
  the mixed-in component having 'this.updated' and it being set to true.

## */

export default {
  mounted () {
    window.addEventListener('beforeunload', this.confirmUnload)
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.confirmUnload)
  },
  methods: {
    /**
     * Blocks reloading or closing the webpage only if there are
     * unsaved changes. If 'this.updated' is undefined, then this method does
     * nothing. Quasar components/plugins aren't used here since they don't
     * block reloading and the default dialog is clear enough.
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
