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

Name:     store/project-display/state.js
Purpose:  Centralized database references for project displaying.
Methods:  References to the database ie, Firebase, are stored here.

## */

export default function () {
  return {
    projectTocPromise: null, // <Promise>: Resolving this yields the project ToC document.
    userTocPromise: null, // <Promise>: Resolving this yields the user ToC document.
    projectConfigPromise: null // <Promise>: Resolving gives project config document.
  }
}
