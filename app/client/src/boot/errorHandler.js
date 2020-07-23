import DbLoadingException from './../models/dbLoadingException'

/**
 * Handles errors from components. Does not catch non-vue errors.
 * @param  {Object} { Vue } Same object as if we do import Vue from 'vue'.
 */
export default ({ Vue }) => {
  /**
   * err: complete error trace, contains the message and error stack
   * vm: Vue component/instance in which error is occurred
   * info: Vue specific error information such as lifecycle hooks, events etc.
   */
  Vue.config.errorHandler = (error, vm, info) => {
    if (error instanceof DbLoadingException) {
      vm.$q.notify({
        type: 'negative',
        message: 'There was an error loading the database. Some' +
          ' functionality will be limited.'
      })
    }
    // TODO: Perform any custom logic or log to server
    throw error
  }
}
