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
##

root_dir:=$(shell pwd)

default: help

init:
	@cd app && \
	./setup.sh && \
	./database_setup.sh

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

functions_deploy:
	@cd app/server/firebase && \
	./deploy.sh

clean:
	@rm -rf setup.o && \
	rm -rf dist

help:
	@echo "usage: make [OPTION]" && echo && \
	echo "Help for each options:" && \
	echo "  init      					generate requried files" && \
	echo "  run       					run the software locally" && \
	echo "  build     					build the software" && \
	echo "  functions_deploy    deploy the cloud functions" && \
	echo "  clean     					clear all the cache data"
