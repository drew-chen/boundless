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

Name:     store/project-submit/state.js
Purpose:  Centralized source data related to project submission.
Methods:

  Data is stored as an object tree. A field is chosen to be stored here if:
    1) This field will be used in multiple components, and/or
    2) This field needs to be synced with Firebase, and
    3) This field is related to project submission.

  To access or modify state, us getters, actions, or mutations. Do not modify
  directly when using Vuex. To avoid unwanted mutations, make non-primitive
  types are copied when accessed and copied when set.

## */

/*
Note: empty fields are shown here just for documentation. Some of these fields
will change as soon as data is fetched from the database (see 'actions.js').
*/
export default function () {
  return {
    project: {
      uuid: null, // <String>: Uuid is assigned upon submission in action.
      project: '', // <String>: The name of the project.
      description: '', // <String>: Description of project.
      members: [], // <Array<Object>>: Exact members submitted to the database.
      keywords: [], // <Array<Object>>: Chosen subset of keywordOptions
      timestamp: null, // <Object>: Date object set in submitProject action, not component.
      created: null, // <Object>: Same as 'timestamp'.
      progress: 0, // <Integer>: 0 is uncompleted and higher numbers are closer to completion.
      hidden: false, // <Boolean>: Whether this project is visible.
      alias: '' // <String>: Project nickname.
    },
    isTestingDb: true, // <Boolean> Whether the db is for testing or production.
    keywordOptions: [], // <Array<Object>>: list of keywords from database
    allowedDomain: [], // <Array<String>>: list of allowed domain for users
    bodyTypeOptions: [], // <Array<Object>>: list of body types from db
    chipTypeOptions: [], // <Array<Object>>: list of chip types from db
    emailToUuidMap: {}, // <Map>: dictionary of emails to uuid
    emailToNameMap: {}, // <Map>: dictionary of emails to names
    projectMembers: [ // <Array<Object>>: list of project member/s. For form input purposes.
      {
        name: '', // <String>: name of the member
        email: '', // <String>: email of the member
        role: 'lead' // <String>: role of the member
      }
    ],
    webpage: { // <Object>: Record of extra information for the webpage
      imgURL: '', // <String>: url of the main image
      chips: [], // <Array<Object>>: list of chips for the webpage
      body: [] // <Array<Object>>: list of body contents for the webpage
    },
    questions: [{ // <Array<Object>> Custom questions and their responses.
      label: '', // <String> A unique text label above the input field when focused
      type: '', // <String> Input type (see HTML input types)
      response: '' // <String> User input
    }],
    questionTemplates: [{ // <Array<Object>> Defines the custom questions for new projects.
      label: '', // <String>: Name of the question.
      type: { // <Object>: Question type which is same as an element of 'options'.
        value: 'text', // <String>: HTML input type.
        icon: 'short_text', // <String>: Icon name.
        label: 'Short Answer' // <String>: Question type label displayed.
      },
      required: false, // <String>: Whether a response is necessary
      /*
      <Integer>: Index which is only unique within an individual
      'questionTemplates' instance.
       */
      order: 0
    }],
    /*
    <Boolean>: Whether custom forms are used during project creation.
    This also disables the editing of custom forms.
    */
    customFormEnabled: false
  }
}
