# Fixing Vulnerable Dependencies

It's a good idea to periodically update dependencies. This way updates are in
small steps instead of large jumps.

In this project, there are two package.json's: one in app/server/firebase/functions and one in app/client/package.json.

When Dependabot notifies that this repository has vulnerabilities, instead of
fixing them one by one, try having npm automatically fix things for you in a test branch.
```bash
$ npm audit fix
```
If there are no breaking changes you are done and you can pull request with your test
branch,

Otherwise, run the following command to see breaking changes that need to be solved manually.

```bash
$ npm audit
```

In each *potentially* breaking change, read the changelog. You can find the
changelog by searching up the module being upgraded or clicking on the update
commit links on Dependabot alerts. From the changelog, you can learn how to work
around the breaking changes or if the changes are even applicable to this repo.

Sometimes a breaking change can be removing some functions from a library which
this project never uses. In cases like this, it's safe to upgrade. Finally, force
the upgrade to make run some tests.
```bash
$ npm audit fix --force
```

Note, it's possible that the dependency that needs to be updated isn't in
package.json but rather in package-lock.json. In this case, a dependency of a
dependency needs to be updated. Read [this](https://stackoverflow.com/questions/50328324/how-do-i-fix-a-vulnerable-npm-package-in-my-package-lock-json-that-isnt-listed)
StackOverflow post for the next few steps. In summary, if `npm audit fix` or
`npm audit fix --force` doesn't work, you need to update manually. Try updating
the parent dependency since it's possible that the parent dependency fixed the
vulnerability issue.


Next, test related parts of the code that could be affected. For instance, if the
dependency upgrade is related to Firebase try creating, viewing, and deleting
projects and try adding attachments then removing attachments. Check if attachments
are deleted when a project is deleted (go to the Firebase console and check the
storage section).

If all your tests pass, the next step is to check if you fixed the Dependabot
warnings. To do this, push your test branch to your fork's remote repository.
Make your test branch the default branch. By default, Dependabot checks the
dependencies of your default branch and should update its alerts to reflect your
changes. If the alerts clear, you're free to make a pull request on the project
to submit your changes for review. Also, make sure to revert your default branch
back to what you original had in case you changed it.

Finally, if somewhere along the process, the vulnerability fix makes some breaking
change that is unavoidable, try fixing or removing the dependant code, consider
using another module, or create an issue/pull request to fix the module with the
vulnerability.
