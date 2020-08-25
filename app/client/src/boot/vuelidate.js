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
Name:     boot/errorHandler.js
Purpose:  Import the validation library to enable the functionality globally.
Methods:

  Imports globally as a Vue plugin. Vuelidate docs can be found here:
  https://vuelidate.js.org/#getting-started.

## */

import Vuelidate from 'vuelidate'

export default ({ Vue }) => {
  Vue.use(Vuelidate)
}
