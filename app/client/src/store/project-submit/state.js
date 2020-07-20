export default function () {
  return {
    project: {
      uuid: null, // <String> Uuid is assigned upon submission in action.
      description: '', // <String> Description of project.
      members: [], // <Array<Object>>: Exact members submitted to the database.
      keywords: [], // <Array<Object>>: Chosen subset of keywordOptions
      timestamp: null, // <Object>: Date object set in submitProject action, not component.
      created: null, // <Object>: Same as 'timestamp'.
      progress: 0, // <Integer>: 0 is uncompleted and higher numbers are closer to completion.
      hidden: false,
      alias: ''
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
      label: '', // <String> A unique text label above the input field when focused
      type: '', // <String> Input type (see HTML input types)
      order: 0 // <Integer> Unique index with lower numbers displayed first.
    }]
  }
}
