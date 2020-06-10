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
  1. Once done, press "**Continue**"
* **Create Database:**
  1. Select "**Develop**" tab on left menu
  1. Select "**Database**" 
  1. Click on [**Create database**]
  1. Select "**Start in production mode**"
  1. Select region
  1. Click on [**Done**]
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
* **Set Up the Firebase Storage:**
  1. Select "**Storage**" tab on left menu under "**Develop**"
  1. Choose [**Get started**]
  1. You will see message about edit another rule - click **Next**
  1. Select region, click **Done**
  1. 
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
We need to set the server side functions. In order to config Firebase functions you will need to install firebase-tools
Although we provide instructions here, a more details installation guide can be found here:
https://firebase.google.com/docs/functions/get-started

* **Set Up the Firebase Server Side Functions:**
  1. Select "**Functions**" tab on left menu under "**Develop**"
  1. Choose [**Get started**] and complete
  1. you will be asked to install on your server: $ npm install -g firebase-tools - you did this already above - click **Continue**
  1. You can also ignore the following (just click [Finsh]):
  
* **Ready to grab the database credentials:**
  1. On left menu near top (**Project Overview**) select the "**Settings Cog**" icon on the upper left corner
  1. Select "**Project settings**"
  1. Scroll down and select "**</>**" icon
  1. Enter app nickname 
  1. (Firebase Hosting not required)
  1. Select [**Register app**]
  1. Copy the following for a later step from var firebaseConfigs = { ... };
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
Select [**Continue to console**]
<br />

## Copy db creditals into init.js
From the root directory
Back to the build computer terminal - open <root>/initi.js in an editor and paste the following firebase credentials into the file. That is:
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
### Done
**Woohoo!** - we are done configuring the database and server side storage.

STORE THE **init.js** FILE IN A SECURE PLACE. This is your login credentials. Do not share these credentials with other untrusted parties.  You will need it to obtain access to your firebase database and storage.

STORE GOOGLE ACCOUNT **LOG IN CREDENTIALS (email, passsword)** IN A SECURE PLACE. This is your Firebnase login credentials you will need to manage the database and storage (poosibly the .  Do not share these credentials with other untrusted parties. 

Return to the main [Installation Guide](INSTALLATION.md#part-ii-running-hosting-the-web-portal) and proceed with **Part II: Web Hosting** to launch the web portal. 

