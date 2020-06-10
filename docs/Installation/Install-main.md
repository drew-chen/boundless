# Installation Guide

The current system utilizes google's firebase database, storage and serverless functions (to manage the data and storage). We will refer to these as the three core firebase components. We plan to support other server-side databases in the future (e.g., mongodb). The installation is broken into major parts: **Part I** – configuring the firebase components which should take approximately 45 minutes. Running the portal (**Part II**) could take as little as 5 minutes if you want to test it out using your local computer (localhost).

# Part I - Setting up Firebase Database and Storage 

## I.1) Prerequisites
Here are the require prerequisites: 
  * Create a dedeciate Google gmail account (we will enable Google's Firebase database and storage)
  * Use google chrome to manage access to Firebase (will inherit browser credentials during the installation)
  * A computer to build and configure the the portal (**build computer**)
    * will need access to a **unix/bash terminal** with **GNU make**. [Git Bash](https://gitforwindows.org/) is often used on Windows with a Windows version of make [here](https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058#make).
  * a **server computer** to host the web portal in production. For the server computer you could also use firebase hosting, the build computer or another dedicated server (e.g., running Apache server)
  
## I.2) Firebase Project Creation and Credentials
In this section we need to create the firebase database, storage and server side functions. At the end you will need to make a copy of the database credentials to securely configure the web portal in **Part II**. This should take about 30 minutes. Because there are a number of steps - we created a document dedicated to setting up Firebase which can be found here: [Firebase Installation](Install-Firebase.md).

## I.3) System Build 
Instructions for the following platforms:
  * Windows Server and Windins 10: [Instructions](Install-Windows.md)
  * Linux Server (tested on Ubuntu 18): [Instructions](Install-Ubuntu.md)

Once you completed the Firebase Installation instructions, which concludes with the coping of your database credentials into **init.js**, proceed to the next section.

## I.4) Database Build and Server Side Function Loading
From the **terminal** run the following to install firebase functions (you must have **make** installed):
```bash
$ make fb_init
$ make fb_functions_deploy
```
** Congratulations ! ** - you have successfully configured firebase database, storage and server side fucntions. 

YOU ARE READY TO RUN THE SERVER!

# Part II Running (Hosting) The Web Portal 
You have four options on how you can run the web portal:
  1. **Run on your local (development) computer** - this option is what contributors (project developers) will need to use to develop and test. If you are an admin installing firebase for the first time try starting there to test it out. Even though it is on your local host the data you enter will reside in the production database and will be available to the other three hosting methods.
  1. **Web Server Hosting** (e.g., Apache server) - This is a common way to host the web portal internally behind an organization firewall.
  1. **Container Hosting** (e.g., docker) - This is an easy way if you are comforable working with docker and container images. You will need to take a few steps to add the database credentials but the actual build is automated. 
  1. **Firebase Hosting** - available with your firebase account. More details will be provide at a later date.
  
## II.1) Run on your development computer
To run locally (e.g. from localhost:8080), call the make command from the root directory:
```bash
$ make run
```
This could take ~ 5 minutes the first time while it performs a complete build. 
Your portal is now reafdy (at least on your local computer) - go to local browser and enter:
   http://localhost:8080/
   
You should log in as admin and change the admin password. The default settings are:
    user: admin
    password: nimda


## II.2) Web Server Hosting (Apache server example)

From the root directory
Once the Firebase credentials are stored in 'system.yml' proceed with the following:

```bash
$ make build
```

To run locally (ex. localhost:8080), call
```bash
# if running locally (ex. localhost:8080), call
$ make run
```

After running 'make build' above the application is ready to be hosted on webserver.
The following example will be showing on how to host it on an Apache web server:

### Apache server example
On the **server computer**: 
```bash
# check the status of apache2
$ sudo systemctl status apache2

# if not available, please install via package-manager
# if apache2 is not runnig, please run the following command
$ sudo systemctl start apache2

# copy the files inside spa folder into var/www/html
$ sudo cp -r ./spa/. /var/www/html/
```

You should log in as admin and change the admin password. The default settings are:
    user: admin
    password: nimda


This should allow the user to visit port 80 of the **server computer** and enjoy the
application.

## II.3) Container Server Hosting

**Note:** Docker compose is required and must support version 3.7+
<br />
Please fill in Firebase configuration inside docker-compose.yml file.
```yaml
 6|      args:
 7|        apiKey: "[VALUE]"
 8|        authDomain: "[VALUE]"
 9|        databaseURL: "[VALUE]"
10|        projectId: "[VALUE]"
11|        storageBucket: "[VALUE]"
12|        messagingSenderId: "[VALUE]"
13|        appId: "[VALUE]"
```

_Tip:_ Making sure docker-compose is installed.

```bash
$ docker-compose -v
docker-compose version 1.25.0, build b42d419
```

**Note:** If docker-compose version does not work, please either reinstall
docker-compose or try the non-dockerized hosting mentioned previously.

Given docker-compose worked, the user may follow the following instructions to
finish hosting.

```bash
$ docker-compose build
$ docker-compose up
```

**Note:** It is possible that PORT 80 is already in use. If it was the case, 
please run ```$ sudo systemctl stop apache2 ``` to stop apache2. If the user is 
familiar with the TCP enabling, the user may also do so.

Once the docker-compose up is up and running, you may connect to the IP via
browser and explore the software.

**Note:** Currently, Firebase-functions are not automated.

Now, the application is fully ready to be used.

You should log in as admin and change the admin password. The default settings are:
    user: admin
    password: nimda


## II.4) Firebase Hosting 
  TBD - see Firebase Web Hosting (part of your firebase account). We will provide more details about this option at a later date. 
  
