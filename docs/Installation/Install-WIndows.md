## Windows Server and Windows 10 Installation Instuctions
The following are the instructions for setting up the Boundless Portal on Windows

From your **build computer** linux terminal window:
```bash
$ git clone https://github.com/Wind-River/boundless.git && cd boundless
$ echo "" > init.js   ## We need to create file init.js for a later step.
```
Next we want to install the firebase cli tools:

```bash
### inside portal root directory: .../boundless
$ npm install -g firebase-tools

### this could take several minutes since this will be installing dozens of dependencies
$ cd app/server/firebase/functions 
$ npm i 
$ cd ../../..  ## go to the root/app directory to execute the next command
```
We want to log into firebase via the command line. It may pop up the chrome browser for additional input. 
```bash
### 'firebase login' should prompt broswer, please select proper google account since
### this command will be grabbing credentials from the browser
$ firebase login --interactive ## log into the google account which holds the firebase project
```
