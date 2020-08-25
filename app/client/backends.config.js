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

Name:     backends.config.js
Purpose:  Defines backend types and the type of the current backend.

## */

export const backendEnum = Object.freeze({
  FIREBASE: 'firebase',
  CUSTOM: 'custom'
})

export const CURRENT_BACKEND = backendEnum.FIREBASE
