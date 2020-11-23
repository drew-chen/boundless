# Understanding the Code.

This doc covers complicated parts of the code.

## Vuex

Vuex store is under `app/client/src/store`.

Each page has it's own state. In order to change state across multiple pages, 
events and callbacks need to be used to communicate between pages. To
conveniently propagate state changes and also keep data organized in a central
location, Vuex can be used.

Vuex is a centralized source of data. Change data in Vuex, and any other page
which uses Vuex will have the data be updated. Vuex can also be split into
modules for organization. Modules are [created by the Quasar CLI](https://quasar.dev/quasar-cli/vuex-store).

In order to use and modify Vuex state, actions, getters, and mutation are used.
You shouldn't modify state directly and must use these helpers. Furthermore,
to be sure state is not mutated by accident, it's a safe choice to deep clone
the data in the state before modifying it locally within a page. If you want
to sync the mutated clone, use an action or mutation to set the state.

### project-submit

The project submit module stores data related to project submission.

Data is stored as an object tree. A field is chosen to be stored here if:
  
  1. This field will be used in multiple components for project submission, and/or
  2. This field needs to be synced with Firebase, and
  3. This field is related to project submission.

Pull request [#18](https://github.com/Wind-River/boundless/pull/18) details why Vuex was used for project submission. For details on implementation, read comments for files in 
the directory `store/project-submit`. In essence, it made data syncing between
pages more organized.

Note that not all data needed for project submission needs to be stored into
Vuex and not all data changes need to be stored immediately. In
`ProjectMainForm.vue`, the user input data only modifies local page data. It is
only until the form is validated and finally submitted, that local data syncs
with Vuex, and an action within Vuex syncs Vuex data with Firebase. See
`ProjectMainForm.vue`'s comments for more info.

### project-display

Used to store the database references (like Firebase related to displaying all
the projects, ie, `DisplayProjects.vue`. Unlike the project-submit module, this
module doesn't store the data fields directly. To get the data, call the
relevant Firebase methods. This was done since the `DisplayProjects.vue` page
didn't originally use Vuex so dramatically changing how data was accessed
would require a large refactor of the file.

The purpose of using Vuex here, other than organization, was basically to
help speed up the page. Vuex can be used with Quasar's Quasar's [PreFetch ](https://quasar.dev/quasar-cli/prefetch-feature) to pre-load data.

For more info about the speed up, read pull request [#27](https://github.com/Wind-River/boundless/pull/27).
For details on Vuex implementation, read comments for files in the directory 
`store/project-submit`.

## RouteWrappers

Under src/components/Manage/RouteWrappers

