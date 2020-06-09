# Trouble Shooting



## Install/Build

####  When you see an error similar to:

```bash
$ make fb_functions_deploy
This make take several minutes to complete...
ERROR: Default project does not exists...
make: *** [makefile:43: fb_functions_deploy] Error 1
```

**Solution 1**: Sometimes special characters accidently get added to the init.js file when using certain editors. This file is used to generate  app/client/database.cred.js which contains the different database credentials of the different databases used (e.g., production, testing).

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





