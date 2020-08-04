## I.2) Firebase Project Creation and Credentials
In this section we need to create the firebase database, storage and server side functions. At the end you will need to make a copy of the database credentials to securely configure the web portal in **Part II**. This should take about 30 minutes. 

Log into firebase console via the following link: https://firebase.google.com/

* On upper right corner, please select <**Go to console**>
* **Create Firebase Project:**
  1. Click on [**Create a project**] (You may reuse your old projects).
  1. Enter project name 
  1. Configure Google Analytics (not required)
    1. select Default Account for Firebase
  1. select "_Create a project_"
  1. Once done, click "[**Continue**]"
* **Create Database:**
  1. Select "**Develop**" tab on left menu
  1. Select "**Database**" 
  1. Click on [**Create database**]
  1. Select "**Start in production mode**"
  1. **Select region** (any region will do) then Click [**Done**]
  1. Choose "Rules" menu tab (below "**Database**") and change it to the following:
  ```js
  // rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
  Click [**Publish**]
  
* **Set Up the Firebase Storage:**
  1. Select "**Storage**" tab on left menu under "**Develop**"
  1. Choose [**Get started**]
  1. You will see message about edit another rule - click [**Next**]
  1. **Select region** (region will do) then click [**Done**]
  1. Choose "Rules" menu tab (below "**Storage**") and change it to the following:
      ```js
      // rules_version = '2';
      service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read, write: if true;
          }
        }
      }
      ```
  Click [**Publish**]
  
Next we need to set the server side functions. In order to config Firebase functions you will need to install firebase-tools
Although we provide instructions here, a more details installation guide can be found here:
https://firebase.google.com/docs/functions/get-started

* **Set Up the Firebase Server Side Functions:**
  1. Select "**Functions**" tab on left menu under "**Develop**"
  1. Choose [**Get started**] and complete
  1. you will be asked to install on your server: **$ npm install -g firebase-tools** - IGNORE this and click [**Continue**]
  1. You can ALSO IGNORE the following and just click [Finsh]:
    * Initiate your project: **$ firebase init**
    * Deploy your functions: **$ firebase deploy**
 
* **Ready to grab the database credentials:**
Next you will need to grab and save a copy of your firebase credentials tolater  add to your web portal build
  1. On the upper left menu near top (**Project Overview**) select the "**Settings Cog**" icon on the upper left corner
  1. Select "**Project settings**"
  1. Scroll down and click on "**</>**" icon
  1. Enter app nickname - give it a name easy to remember. 
  1. (Firebase Hosting not required)
  1. Select [**Register app**]
  1. COPY & SAVE the following Firebase crendentials in a file (for a later step):
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
We will need to paste this data into a file named **init.js** when you build the web portal. The data is your **web portal** Firebase log in credentials. Please store in a SECURE PLACE. Do not share these credentials with other untrusted parties. You will need it to obtain secure access to your Firebase database and storage.

### Done
**Woohoo!** - You are done configuring the database and server side storage.

In addition to securely saving your Firebase credentials, you will also want to STORE GOOGLE ACCOUNT **LOG IN CREDENTIALS (email, passsword)** IN A SAFE PLACE. This is your **personel** Firebnase Console login credentials you will need to manage the database and storage. Do not share these credentials with other untrusted parties. 

Return to the main [Installation Guide](https://github.com/Wind-River/boundless/blob/master/docs/Installation/Install-main.md#i3-system-build) and proceed to preform the system build. 

