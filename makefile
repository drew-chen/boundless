##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing,
## software  distributed under the License is distributed on an
## "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
## express or implied.
##
## Name:     makefile
## Purpose:  Helps automate the build of the project
## Methods:
##   * Builds the project
## 	 * Cleans the project
##   * import and export file storage
##

root_dir:=$(shell pwd)

default: help

fb_init: init.js
	@node app/config/system_init.js && cd app && \
	chmod 777 setup.sh && ./setup.sh && \
	chmod 777 database_setup.sh && ./database_setup.sh && \
	chmod 777 demo.sh && chmod 777 build.sh && \
	cd server/firebase && chmod 777 deploy.sh && \
	chmod 777 export.sh && cd functions && npm i

run:
	@cd app && \
	./setup.sh && \
	./database_setup.sh && \
	./demo.sh

build:
	@cd app && \
	./setup.sh && \
	./database_setup.sh && \
	./build.sh

fb_functions_deploy:
	@cd app/server/firebase/functions && npm i && cd .. && \
	./deploy.sh

export_storage:
	@cd app/server/firebase && \
	./export.sh

export_storage_testing:
	@cd app/server/firebase && \
	./export.sh testing

import_storage:
	@cd app/server/firebase && \
	./import.sh $(file)

clean:
	@rm -rf setup.o && \
	rm -rf dist

help:
	@echo "usage: make [OPTION]" && echo && \
	echo "Help for each options:" && \
	echo "  fb_init				generate requried files" && \
	echo "  run					run the software locally" && \
	echo "  build					build the software" && \
	echo "  fb_functions_deploy			deploys the cloud functions" && \
	echo "  export_storage			exports the storage from cloud" && \
	echo "  import_storage file=<file fullpath>   imports the storage from .zip to to firebase storage" && \
	echo "  clean					clear all the cache data"
