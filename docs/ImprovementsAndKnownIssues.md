# Possible Improvements


### Features

* Introduce more viewing modes for projects, similar to compact and comfortable
modes in gmail.
* For all search bars, include names in the search index. For example, in the
same search bar for project names you could look for projects by contributor name.
* When searching, highlight text that matches the query.
* Accounts for each user, so they can edit their own submissions.
* Auto-save settings
* When a user submits a new project, redirect the user to the page for that project.

### Behind the scenes

* Add support for a custom backend instead of Firebase
* Add user, groups, and permissions
* When supported by Quasar, switch to Vue 3 with Typescript.
* Reduce code repetition. For example, the same 'loadFireRefs' method is present
in 19 files, with little change between them. Solutions include:
  * Use more Vuex modules and Vue mixins.
  * Divide components to be smaller and more modular.
  * Use more general components to define similar components.
* Use Vuelidate in existing complex validations (ie, 'emailDomainCheck' func).
* Validate email format, not just domain.
* Use more session caching.
* Improve error handling.

<ins>Examples of error handling that can be improved:</ins>


```JavaScript
// 1. Error hiding!
try {
  /* code */
  return true
} catch (error) {
  return false
}

// 2. Unnecessary try and catch.
try {
  /* code */
} catch (error) {
  /*
  Catching and immediately throwing errors (without error handling) is the same as not
  using try and catch.
  */
  throw error
}

// 3. Bad error messages.
try {
  /* code */
} catch (error) {
  // Produces a not very useful error message of '[object Object]'.
  throw Error(error)
}

// 4. Assuming specific errors.

try {
  /* code that affects the database */
} catch (error) {
  handleDbError(error)
}
```
<ins>How to do error handling.</ins>

0. Avoid the examples of bad error handling above.
1. Add error identifiers, error classes, and other error utilities in app/client/src/errors.
2. Add global error handling in app/client/src/boot/errorHandler.js.
3. If possible, be specific about which errors are caught by using your error utilities.
4. To handle errors, either do so at the component level or through the global
error handler depending on your needs. Thus, try to avoid putting error handling
in the vuex store. Errors themselves can be thrown anywhere.


### Appearance

(subjective)

* Use HTML5 History Mode (get rid of hashtag in url).
* Remove gradient on progress bar.
* Currently the 'please enter the email' again prompt is jarring. Use a smoother
method of confirming a new email.
* Put main content in a thinner container. Currently, the main content pages are
very wide. Making pages slimmer will make it easier to read and navigate since
your eyes and mouse will need to move less.
* Use icons with transparent backgrounds in the admin console. Some animations change the
button color from white the gray, revealing that the icons have a white square
background.
* Move advanced project, challenge, and user settings to their own sub-page
instead of a dialog.
* use animation when deleting
limit length 
* When editing a project, have the attachment button on the setting page instead of
 the top right popup.

# Known Issues

* When navigating away from a settings page with unsaved changes, a dialog appears
asking to confirm the navigation. If you press the cancel button, the navigation
is correctly canceled but the tab focus is not correctly reset. Several solutions
were attempted but currently none work. A possible solution and some demos can
be found [here](https://forum.vuejs.org/t/how-do-you-prevent-router-link-from-being-focused-when-navigation-is-cancelled/101030/5).
* A contributor to a project or challenge can be added to the same project or challenge
more than once.
* When first booting up app, the same switch database error always occurs
