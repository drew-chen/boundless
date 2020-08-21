#!/bin/bash

################################################################################
# Copyright (c) 2020 Wind River Systems, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at:
#       http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software  distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
# OR CONDITIONS OF ANY KIND, either express or implied.
#
# Purpose: To import Firebase Storage into local machine by automatically
#          extracting credentials from dependent files
################################################################################

## Retrive the name of the firebase storage repository
if [ -r .firebaserc ]; then
  storage_target=$(cat .firebaserc)
elif [ -f .firebaserc ]; then
  echo "The file '.firebaserc' exists but is not readable to the script."
  exit 1
else
  echo ERROR: Failed since .firebaserc file does not exists...
  exit 1
fi
## Grab the full file path of the .zip containing the storage content
storage_content_file=$1
firebase_default=`node -pe 'JSON.parse(process.argv[1]).projects.default' "$storage_target"`

echo "Preparing to import into firebase storage: gs://${firebase_default}.appspot.com"

## make sure content file exists and then proceed to load storage via fbm.py util
if [ -r $storage_content_file ]; then
    cd ../../../tools/fbm/
    echo 'Importing Files ...'
    echo "This make take several minutes to complete..."
    python fbm.py import $storage_content_file gs://${firebase_default}.appspot.com
else 
    echo ERROR "($0): could not access file: '$storage_content_file'"
    echo "   Make sure to include FULL PATH for file"
    exit 1
fi

exit 0

###echo "variable is: $1" 
###ls $1
###exit 2

###echo "This make take several minutes to complete..."

##firebase_default=`node -pe 'JSON.parse(process.argv[1]).projects.default' "$content"`
#######firebase_testing=`node -pe 'JSON.parse(process.argv[1]).projects.testing' "$content"`

# cd ../../../tools/fbm/
# echo 'Importing into  database'
# python fbm.py import $1 gs://${firebase_default}.appspot.com

# if [[ $1 == 'testing' ]]; then
#   echo 'Exporting testing'
#   python fbm.py export gs://${firebase_testing}.appspot.com
# else
#   echo 'Exporting production'
#   python fbm.py export gs://${firebase_default}.appspot.com
# fi
##
## exit 0
