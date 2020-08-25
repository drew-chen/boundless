<!-- ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     pages/NotFound.vue
Purpose:  Page shown when the route is either hidden or does not exist.
Methods:  See route.js or other views in /pages for usage.

## -->

<template>
  <q-page>
    <div class="fixed-center text-center">
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>
      <p class="text-faded">Or forbidden...<strong>(403)</strong></p>
      <q-btn
        color="secondary"
        style="width:200px;"
        @click="$router.push('/')"
      >Go back</q-btn>
    </div>
  </q-page>
</template>

<script>
</script>
