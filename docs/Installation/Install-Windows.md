## 1.3) Windows Server and Windows 10 System Build Instuctions
The following are the instructions for setting up the Boundless Portal on Windows

### Download code & Store the Firebase Credentials in init.js
From your **build computer** linux terminal window:
```bash
$ git clone https://github.com/Wind-River/boundless.git && cd boundless
$ echo "" > init.js   ## We need to create file init.js for a later step.
```
Open file **initi.js** in an editor and paste the following firebase credentials into the file. That is:
```js
  var firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..."
  };
```
Next we want to install the firebase cli tools:

```bash
### inside portal root directory: .../boundless
$ npm install -g firebase-tools
```
We want to log into firebase via the command line. It may require you to use chrome web browser for additional input. 
```bash
### 'firebase login' should prompt broswer, please select proper google account since
### this command will be grabbing credentials from the browser
$ firebase login --interactive ## log into the google account which holds the firebase project
```

## Database Build and Server Side Function Loading
From the **terminal** run the following to install firebase functions (you must have **make** installed):
```bash
$ make fb_init
$ make fb_functions_deploy
```
** Congratulations ! ** - you have successfully configured firebase database, storage and server side fucntions. 

YOU ARE READY TO RUN THE SERVER! - Got to [**Part II - Web Hosting**](https://github.com/Wind-River/boundless/blob/master/docs/Installation/Install-main.md#part-ii-running-hosting-the-web-portal)
