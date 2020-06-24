## Ubuntu/Linux System Build Instuctions
The following are the instructions for setting up the Boundless Portal on Ubuntu/Linux. PLEASE FOLLOW THEM IN THE ORDER PROVIDED. 
From your **build computer** bash/shell terminal window:
```bash
$ git clone https://github.com/Wind-River/boundless.git && cd boundless
$ echo "" > init.js   ## We need to create file init.js for a later step.
```
Open file **initi.js** in an editor and paste the following firebase credentials into the file you save from a previous step. That is:
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
* Install Node.js and npm - run each command and follow the instructions:
```bash
$ sudo apt update
$ sudo apt install nodejs  ## and follow the instructions
$ sudo apt install npm     ## and follow the instructions
$ sudo  npm i -g npm@latest
$ sudo npm i -g n
$ sudo n stable (sudo n latest)
$ exit  ## exit the terminal shell and then resart the shell to allow registion of the above utilities
```
After exiting the shell window - invoke a new shell window and return to the <top directory>. This should allow the shell to obtain the latest installations just completed. Next we want to install the firebase cli and tools. 


TBD: Install gCloud - Click on the download link, run and follow the instructions
  * [gCloud installer download](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe)
  * [FYI: Documentation](https://cloud.google.com/storage/docs/gsutil_install)

```bash
### inside portal root directory: .../boundless
$ sudo npm install -g firebase-tools
```

            ### this could take several minutes since this will be installing dozens of dependencies
            $ cd app/server/firebase/functions 
            $ sudo npm i 
            $ cd ../../..  ## go to the root/app directory to execute the next command
            ```
We want to log into firebase via the command line. It may pop up the chrome browser for additional input. 
```bash
### 'firebase login' should prompt broswer, please select proper google account since
### this command will be grabbing credentials from the browser
$ sudo firebase login --no-localhost ## ... and following the instructions - you may need the chrome browser on another device
```
Let's run make to configure Firebase
```bash
$ sudo make fb_init
$ sudo make fb_functions_deploy
$ exit ## exit the terminal shell and then resart the shell to allow gcloud init
```
After exiting invoke a new terminal shell and return to the <top directory>. This should allow the shell to obtain the latest installations. Next proceed to enable user/browser download permissions (CORS).

```bash
$ gcloud init ## and follow the instructions
##
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
$ sudo make run
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
