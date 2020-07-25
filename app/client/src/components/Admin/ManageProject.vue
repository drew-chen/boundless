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

Name:     components/Admin/ManageProject.vue
Purpose:  Display, edit, add, and delete project from the admin console
Methods:
  * Allows the project to be added
  * Allows the project to be deleted
  * Allows the project to be edited
  * Display the list of chanllenges in a table

## -->

<template>
  <admin-table
    rowType="project"
    middleColumn="alias"
 />
</template>

<script>
import AdminTable from '../Admin/Shared/AdminTable'

export default {
  components: {
    AdminTable
  }
}

</script>

<style lang="stylus">

</style>
