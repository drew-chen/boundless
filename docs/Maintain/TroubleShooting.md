# Trouble Shooting



## Install/Build

####  When you see an error similar to:

```bash
$ make fb_functions_deploy
This make take several minutes to complete...
ERROR: Default project does not exists...
make: *** [makefile:43: fb_functions_deploy] Error 1
```

**Solution 1**: Sometimes special characters accidentally get added to the init.js file when using certain editors. This file is used to generate  app/client/database.cred.js which contains the different database credentials of the different databases used (e.g., production, testing).

To see if this is a problem run:

```bash
$ make fb_init
$ cat app/client/database.cred.js
```

Which should output something like:

```bash
export const databaseConfig = {
  production: {
    apiKey: 'ZIaaVyAMQspPYDis0YmdaPC49JB02IavzPlq8Gh',
    authDomain: 'mycompany-portal-db.firebaseapp.com',
    databaseURL: 'https://mycompany-portal-db.firebaseio.com',
    projectId: 'mycompany-portal-db',
    storageBucket: 'mycompany-portal-db.appspot.com',
    messagingSenderId: '7363909214314',
    appId: '1:7363909214314:web:943909ee82436d5f40e143'
  },
  testing: { ...},
  dev: {}
}
```

You should try recreating **init.js** using a different to remove the special characters that are causing the problem.

**Solution 2**: You need to check that your google login credentials are properly set. The you need to log out of google, chrome and log back in.



### When you see an error similar to:

```bash
boundless $ make fb_functions_deploy
This make take several minutes to complete...

Error: Invalid project selection, please verify project default exists and you have access.

Error: No project active, but project aliases are available.

Run firebase use <alias> with one of these options:

  default (boundless-e2c9a)
  testing (boundless-e2c9a)
```

**Solution 1**: You have likely not logged into firebase with the correct credentials. Try:

```bash
$ firebase logout
+  Logged out from <goole account name>

$ firebase login -- interacrtive
       :
       :
 < you will be prompted to use the chrome browser to select the correct loggin account>
	   :
	   :
+  Success! Logged in as boundless.inv@gmail.com
```

## Firebase Storage

### When you see an error similar to:

```bash
boundless $ make fb_export_storage
This make take several minutes to complete...
Exporting production
AccessDeniedException: 403 avitechx360@gmail.com does not have storage.objects.list access to the GCloud Storage bucket.
CommandException: 1 file/object could not be transferred.
intiating export...
generating: boundless-d7c8e.storage.06.24.2020_22_28_48
starting the zipping process...
deleting the content...

Export completed successfully
The zipped file is available inside ~/tools/fbm folder!
```

**Solution 1**: You have go to the glcould SDK and initialize or re-initialize. In the SDK Try:

```bash
C:\Users\mgisi\AppData\Local\Google\Cloud SDK>gcloud init
Welcome! This command will take you through the configuration of gcloud.

Settings from your current configuration [default] are:
core:
  account: avitechx360@gmail.com
  disable_usage_reporting: 'True'
  project: avitech4-a7739

Pick configuration to use:
 [1] Re-initialize this configuration [default] with new settings
 [2] Create a new configuration
Please enter your numeric choice:  1

Your current configuration has been set to: [default]

You can skip diagnostics next time by using the following flag:
  gcloud init --skip-diagnostics

Network diagnostic detects and fixes local network connection issues.
Checking network connection...done.
Reachability Check passed.
Network diagnostic passed (1/1 checks passed).

Choose the account you would like to use to perform operations for
this configuration:
 [1] avitechx360@gmail.com
 [2] boundless.inv@gmail.com
 [3] Log in with a new account
Please enter your numeric choice:  2

You are logged in as: [boundless.inv@gmail.com].

Pick cloud project to use:
 [1] boundless-d7c8e
 [2] boundless1-c52f8
 [3] Create a new project
Please enter numeric choice or text value (must exactly match list
item):  1

Your current project has been set to: [boundless-d7c8e].
```


