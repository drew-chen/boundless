#!/bin/bash

################################################################################
# Copyright (c) 2019 Wind River Systems, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at:
#       http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software  distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
# OR CONDITIONS OF ANY KIND, either express or implied.
#
# Purpose: To instruct CLI related installation processes to the user
################################################################################

if [ -r ../init.js ]; then
  echo "Proceeding to caching..."
else
  echo "init.js is missing..."
  exit 1
fi

if [ -r config/system.yml ]; then
  exit 0
elif [ -f config/system.yml ]; then
  echo "The file 'system.yml' exists but is not readable to the script!"
  exit 1
else
  echo "The required file is being generated."
  echo "Please wait a moment..."

  cp config/system.template config/system.yml
  sleep 3

  echo "Please go into './app/config' folder and edit 'system.yml' with your firebase credentials."

  if ! [ -d "../setup.o" ]; then
    mkdir ../setup.o
  fi
  cp config/system.yml ../setup.o/system.base.yml

  sleep 1

  exit 1
fi
