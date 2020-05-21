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
# Purpose: To export Firebase Storage into local machine by automatically
#          extracting credentials from dependent files
################################################################################

if [ -r .firebaserc ]; then
  content=$(cat .firebaserc)
elif [ -f .firebaserc ]; then
  echo "The file '.firebaserc' exists but is not readable to the script."
  exit 1
else
  echo ERROR: Failed since .firebaserc file does not exists...
  exit 1
fi

echo "This make take several minutes to complete..."

firebase_default=`node -pe 'JSON.parse(process.argv[1]).projects.default' "$content"`
firebase_testing=`node -pe 'JSON.parse(process.argv[1]).projects.testing' "$content"`

cd ../../../tools/fbm/

if [[ $1 == 'testing' ]]; then
  echo 'Exporting testing'
  python fbm.py export gs://${firebase_testing}.appspot.com
else
  echo 'Exporting production'
  python fbm.py export gs://${firebase_default}.appspot.com
fi

exit 0
