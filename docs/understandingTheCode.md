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
with Vuex. Then, only after the user reaches the last page of the multipage
project submission form and clicks submit, does an action within Vuex sync Vuex
data with Firebase. See `ProjectMainForm.vue`'s comments for more info.
 
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
 
1. Firstly, we need props to reduce repeated code since all the sub-page settings
share some data and callbacks from `ManageSettings.vue`. Thus, we reduce repeated
code by getting what we need once in `ManageSettings.vue` then interacting with 
the same data and callbacks via props.
 
2. Another reason we need props is that both project and challenge settings use `SettingsProjectsAndChallenges.vue`. The only differentiator between project and
challenge settings pages are the props passed in. Prior to the RouteWrapper changes
in pull request [#18](https://github.com/Wind-River/boundless/pull/18), project and challenge
settings were already in the same file. Thus, we need to pass in props
to `SettingsProjectsAndChallenges.vue` in order to use it properly.
 
3. We need to use a route because to check if someone is navigating away
from a setting, the best way to do this is a [navigation guard](https://router.vuejs.org/guide/advanced/navigation-guards.html).
See `mixingSettingNavGuard.js` and the [dialog](#Dialog) section of this markdown
file to see how this navigation guard was done.
 
4. Since we're using a route, we need to use Vue's `<router-view>` component.
However, we also need to pass props to each of the sub-pages. Another problem
is that the props aren't standardized. Some settings use more props and/or
use different ones. Thus RouteWrapper files are used to conveniently pass
the right props to the settings sub-pages.
 
More details can be found in the comments of each of the files mentioned.

## Undoing Settings

RouteWrappers was used to prevent navigating away from settings forms when there
were unsaved changes.

### Dialog

If changes were unsaved and the user navigates away, navigation
is interrupted with a dialog with three options:

1. Save. In this case, the settings are saved and the user continues navigation.

2. Don't save. The user continues navigation and all unsaved changes are discarded.

3. Cancel. Navigation is canceled and the user stays on the settings page. No
changes are saved.

There's a lot of things working behind the scenes to enable this. To detect
changes, updating any savable setting, such as whether or not to enable
custom submission questions, sets an updated flag to be true. We don't compare
saved state with unsaved state to compute a value for the updated flag. Ie,
if original state = 4. We add 1, then subtract 1, then updated is set to true
even though it's the same as the original state. This simplification is just done
just because comparing state of every possible setting is computationally expensive
and potentially complicated if settings get updated in the future.

1. To enable save functionally, we pass in a save callback to `DialogConfirmLeave.vue`.
This save callback is the exact same method used to save to Vuex or the Database
that would be used without the dialog's intervention. Once the save button is
clicked, `DialogConfirmLeave.vue` closes the dialog, awaits the save to be finished,
performs any other cleaning up needed (through the onLeave() callback), then finally
once the save button is clicked, continues the navigation.

2. Not saving follows steps similar to saving. The only difference is that
instead of using a save callback, a reset callback is used. When we don't save,
we want to undo any unsaved changes. Within the settings sub-page, a (deep) copy
of the most recently saved settings data is when the settings page is created or
when the settings page is saved. When the reset callback is called, the settings
state is set using Vue.set() to the older saved copied state.

3. To cancel, the dialog is closed and navigation is cancelled.

### Controlling navigation

How does this dialog control navigation? Within each RouteWrappers, 
`mixinSettingNavguard.js` is used. [Mixins](https://vuejs.org/v2/guide/mixins.html)
 are Vue's way to share code among
components. They have access to local state and callbacks since they are conceptually
inserted into components directly. This callback adds the [beforeRouteLeave()](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards) navigation guard. This callback
has the next() callback which is a function that can control navigation, as in, can
control whether or not to continue or cancel navigation. Since this function is
only accessible within the callback, it can't be passed to the mixin through a prop.
Instead, it's passed whenever `DialogConfirmLeave.vue` is opened.

