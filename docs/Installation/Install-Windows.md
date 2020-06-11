## 1.3) Windows Server and Windows 10 System Build Instuctions
The following are the instructions for setting up the Boundless Portal on Windows. PLEASE FOLLOW THEM IN THE ORDER PROVIDED. 
  * Install chrome browser and make default browser (this is important for several google log ins)
  * Install git/gitbash
    * https://git-scm.com/download/win
  * Install node - Click on the download, run and follow the instructions
    * [node download](https://nodejs.org/en/download/) (including additional build tools)
    * this should install python 3
  * Install python 3 (if NOT installed above w/node)
  * Install gCloud - Click on the download link, run and follow the instructions
    * [gCloud installer download](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe)
    * [FYI: Documentation](https://cloud.google.com/storage/docs/gsutil_install)


### Download Code & Save the Firebase Credentials
From your linux bash terminal window (git bash) perform the following:
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
Make sure **make** is installed. One of he easiest ways is to grab a copy:
```bash
    ## If you are using git bash then you can 
    From: 
      tools/bin/make.exe
    To:
      C:\Program Files\Git\mingw64\bin  ## Our similar dir, depending on where git is installed
```
Alternatively, you can obtain instructions on how to install **make** from here: [link](https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058#make)

## Database Build and Server Side Function Loading
From the **terminal** run the following to install firebase functions (you must have **make** installed):
```bash
$ make fb_init
$ make fb_functions_deploy
$ exit ## exit the terminal shell and then resart the shell to allow gcloud init
```
After exiting invoke a new terminal shell and return to the <top directory>. This should allow the shell to obtain the latest installations. Next proceed to enable user/browser download permissions (CORS).

```bash
$ gcloud init ## and follow the instructions
$ cd app/server/firebase/storage
##
## <storageBucket> is a parameter you can obtain from file <top dir>/init.js
$ gsutil.cmd cors set cors.json gs://<storageBucket>
##
## now return to the top directory
$  cd ../../../..
```
## Done, Now set the Admin password
** Congratulations ! ** - you have successfully configured firebase database, storage and server side fucntions. 

You can run it locally on your machine. From the <top dir>
```bash
$ make run
```
Once it comes up you can go to the following local url:
  * [http://localhost:8080](http://localhost:8080)

Login in with the following credentials:
```bash
  User: admin
  Password: nimda
```

CHANGE ADMIN PASSWORD - After logging in go to Settings, at the botton you will see 

YOU ARE READY TO RUN THE SERVER! - Got to [**Part II - Web Hosting**](https://github.com/Wind-River/boundless/blob/master/docs/Installation/Install-main.md#part-ii-running-hosting-the-web-portal)
