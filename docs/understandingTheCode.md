# Understanding the Code.
 
This doc covers complicated parts of the code.
 
## Vuex
 
Vuex store is under `app/client/src/store` and first used in pull request [#18](https://github.com/Wind-River/boundless/pull/18).
 
Each page has its own state. In order to change state across multiple pages, 
events and callbacks need to be used to communicate between pages. To
conveniently propagate state changes and also keep data organized in a central
location, Vuex can be used. Currently, Vuex isn't yet used everywhere where it can
be.
 
Vuex is a centralized source of data. Change data in Vuex, and any other page
which uses Vuex will have the data be updated. Vuex can also be split into
modules for organization. Modules are [created by the Quasar CLI](https://quasar.dev/quasar-cli/vuex-store).
 
In order to use and modify Vuex state, actions, getters, and mutation are used.
You shouldn't modify state directly and must use these helpers. Furthermore,
to be sure state is not mutated by accident, it's a safe choice to deep clone
the data in the state before modifying it locally within a page. If you want
to sync the mutated clone, use an action or mutation to set the state.
 
### project-submit
 
The project submit Vuex module stores data related to project submission. Specifically,
`ProjectCreateCustomFrom.vue` is used by the admin to choose and modify what
custom fields or questions a project submission form asks. The rest of the files
within the `Forms/Project` directory and `SubmitProject.vue` are for the user
to fill out a project submission form.
 
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
 
This module is used to store the database references (like Firebase related to displaying all
the projects, ie, `DisplayProjects.vue`. Unlike the project-submit module, this
module doesn't store the data fields directly. To get the data, call the
relevant Firebase methods. This was done since the `DisplayProjects.vue` page
didn't originally use Vuex so dramatically changing how data was accessed
would require a large refactor of the file.
 
The purpose of using Vuex here, other than organization, was basically to
help speed up the page. Vuex can be used with Quasar's Quasar's [PreFetch ](https://quasar.dev/quasar-cli/prefetch-feature) to pre-load data. The preFetch hook is called in
`App.vue`.
 
For more info about the speed up, read pull request [#27](https://github.com/Wind-River/boundless/pull/27).
For details on Vuex implementation, read comments for files in the directory 
`store/project-submit`.
 
### Abstracting the database
 
Parts of this project are tightly coupled with Firebase's Cloud Firestore. Within
Vuex, some room is given so that future backends/databases can be swapped in.
The goal is that the backend/database can be changed without pages using Vuex
 caring. Work on abstracting the database began with pull request
[#20](https://github.com/Wind-River/boundless/pull/20). Some work needs to be
done with the project-display module and `DisplayProjects.vue` to make them less 
dependent on Firestore. Furthermore, methods outside of Vuex don't have this
abstraction.
 
Since pull request [#27](https://github.com/Wind-River/boundless/pull/27), abstraction
is done with `callDependingOnBackend.js` in combination with constants defined in `backends.config.js`.
For Firebase, this means `export const CURRENT_BACKEND = backendEnum.FIREBASE`.
 
Example usage for a Vuex action:
 
```JavaScript
async function loadConfig (context) {
  await callDependingOnBackend(context, loadConfigFirebase, loadConfigExpress)
}
```
Outside Vuex, a page can call `loadConfig(context)` and the proper helper
function will be called depending on the backend.
 
Note: `backends.config.js` and `callDependingOnBackend.js` need to be modified
(copy and paste more if statements for new constants) to handle more than two
different backends in the future. More documentation can be found in these files.
 
## RouteWrappers
 
RouteWrappers are introduced in pull request [#18](https://github.com/Wind-River/boundless/pull/18).
 
Under `src/components/Manage/RouteWrappers`, you'll notice four very similar
files. These files, combined with some others (which will be explained),
prevent the user from navigating away from a form (in this case, the admin settings)
before changes are saved. Instead, the form user will be asked to either to save,
discard their changes, or cancel navigating away. These options are defined by
`DialogConfirmLeave.vue`.
 
Here's how it works. Firstly, the relevant settings are defined in
`ManageSettings.vue`. Settings are divided into four sub-pages: general settings,
database settings, project settings, and challenge settings. These routes
are defined in `routes.js`.
 
`ManageSettings.vue` being the parent component of all these sub-pages, has data
of which, the sub-pages each use a part of. In order to pass the correct
data to these sub-pages, props are passed dynamically to a `<router-view>`,
depending on the browser route. Ie, the props for general settings are passed to
the view when the route is "/admin/settings/general".
 
These props are sent to the relevant route wrapper, for example,
`RouteWrapperSettingsGeneral.vue`. If the proper setting is passed, then the RouteWrapper renders the proper setting page, such as `SettingsGeneral.vue`.
 
Why use RouteWrappers? Why do props need to be passed dynamically depending on the route, when child
components can be instead conditionally rendered with `v-if` without needing
a RouteWrapper file? Basically, we need to use RouterWrappers because we need
settings to use both props and routes.
 
1. Firstly, we need props to reduce repeated code. Since all the sub-page settings
share some data and callbacks from `ManageSettings.vue`, they don't need to be
recalculated. Thus, we reduce repeated code by getting what we need once in
`ManageSettings.vue` then interacting with the same data and callbacks via props.
 
2. Another reason we need props is that both project and challenge settings use `SettingsProjectsAndChallenges.vue`. The only differentiator between project and
challenge settings pages are the props passed in. Prior to the RouteWrapper changes
in pull request [#18](https://github.com/Wind-River/boundless/pull/18), project and challenge
settings were already in the same file. Thus, we need to pass in props
to `SettingsProjectsAndChallenges.vue` in order to use it properly.
 
3. We need to use a route because to check if someone is navigating away
from a setting, the best way to do this is a navigation guard. See 
`mixingSettingNavGuard.js` to see how this navigation guard was done.
 
4. Since we're using a route, we need to use Vue's `<router-view>` component.
However, we also need to pass props to each of the sub-pages. Another problem
is that the props aren't standardized. Some settings use more props and/or
use different ones. Thus RouteWrapper files are used to conveniently pass
the right props.
 
More details can be found in the comments of each of the files mentioned.
