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
# Purpose: To generate database.cred.js for the software and
#          and copy the generated file into the correct repo
################################################################################

baseCmpHelper () {
  local result=$1
  if [ ${#result} -gt 0 ]; then
    cp config/system.yml ../setup.o/system.yml
  else
    echo "Please update 'system.yml' with firebase database credientials."
    exit 1
  fi
}

if [ -r config/system.yml ]; then
  echo "Comparing against cache..."
  cmpBaseResult=""
  cmpResult=""

  if [ -r ../setup.o/system.yml ]; then
    # compare against both base and default
    cmpBaseResult=$(cmp ../setup.o/system.base.yml config/system.yml)
    cmpResult=$(cmp ../setup.o/system.yml config/system.yml)

    if [ ${#cmpBaseResult} -gt 0 ] && [ ${#cmpResult} -gt 0 ]; then
      echo "Changes detected, proceeding to generate dependencies before building."
      cp config/system.yml ../setup.o/system.yml
    elif ! [ ${#cmpBaseResult} -gt 0 ]; then
      echo "Please update 'system.yml' with firebase database credientials."
      exit 1
    else
      echo "No changes detected, proceeding to build."
      exit 0
    fi

  else
    echo "No cache found!"
    echo "Rebuilding cache..."
    # no system.yml file in setup.o, then check of system.base.yml exists
    if ! [ -d "../setup.o" ]; then
      mkdir ../setup.o
    fi

    if ! [ -r ../setup.o/system.base.yml ]; then
      cp config/system.template ../setup.o/system.base.yml
    fi

    # compare against base
    cmpBaseResult=$(cmp ../setup.o/system.base.yml config/system.yml)
    baseCmpHelper ${cmpBaseResult}
  fi

  node config/setup.js
  sleep 2
  echo "The file is being moved into the client directory..."
  cp config/system.js client/database.cred.js
  sleep 2

  exit 0
elif [ -f config/system.js ]; then
  echo "The file 'system.js' exists but is not readable to the script."
  exit 1
else
  echo "ERROR: Failed since 'system.js' file does not exists within the 'config' folder..."
  echo "In order to create the required file 'system.yml', please execute './setup.sh' in the root..."
  sleep 3
  exit 1
fi
