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

Name:     errors/isFirebaseError.js
Purpose:  Defines an error identifier method to use throughout the app.
Methods:  See function's JS doc for the method used.

## */

/**
 * Checks if a given error is an instance of 'FirebaseError' and optionally,
 * if that error also has the given error code. Since 'FirebaseError'
 * instances are defined as TypeScript interfaces instead of JS classes, they
 * cannot be directly checked using 'instanceof'.
 *
 * Error codes can be found here:
 * https://firebase.google.com/docs/storage/web/handle-errors
 * @param  {Error} error The instance being checked.
 * @param  {String} errorCode Optional error code to also check for.
 * @returns {Boolean} Whether or not the error is the specified Firebase error.
 */
export default function isFirebaseError (error, errorCode) {
  if (error.code && error.name && error.name === 'FirebaseError') {
    if (errorCode !== undefined) {
      return error.code === errorCode
    }
    return true
  }
  return false
}
