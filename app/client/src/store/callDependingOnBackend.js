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

Name:     store/callDependingOnBackend.js
Purpose:  Helper for Vuex actions so that the backend can be abstracted away.
Methods:

  Pass in multiple methods, each representing a different backend. Based on the
  CURRENT_BACKEND constant, a certain method is called.

## */

import { backendEnum, CURRENT_BACKEND } from '../../backends.config'
import DbException from '../errors/dbException'

/**
 * Calls the appropriate action depending on the backend type. Can be extended to
 * handle more backends by adding more cases and passing in more actions.
 *
 * Note: if the function wrapping 'callDependingOnBackend' is expected to
 * be awaited, then make sure the call to 'callDependingOnBackend' is also
 * awaited.
 *
 * @param {Object} context Exposes the same set of methods/properties as the
 *   store instance.
 *   For all the properties of the context object, see:
 *   https://vuex.vuejs.org/api/#actions.
 * @param {...Function} action An action which needs a context that will be called
 *   depending on the backend type. The order of the provided actions matters.
 *   Each action can only accept one parameter: context.
 */
export default async function callDependingOnBackend (context, ...action) {
  switch (CURRENT_BACKEND) {
    case backendEnum.FIREBASE:
      if (action[0]) {
        await action[0](context)
      } else {
        throw DbException('Method for this backend is not given.')
      }
      break
    case backendEnum.CUSTOM:
      if (action[1]) {
        await action[1](context)
      } else {
        throw DbException('Method for this backend is not given.')
      }
      break
    default:
      throw DbException('No matching backend type.')
  }
}
