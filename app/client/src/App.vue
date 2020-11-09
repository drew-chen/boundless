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

Name:     App.vue
Purpose:  Main starting code block of the application.
Methods:

  The application global CSS declarations are found here.
  Also initializes Vuex.

##-->

<template>
  <div id="q-app">
    <router-view /> <!-- See ./src/router/routes.js -->
  </div>
</template>

<script>

export default {
  name: 'App',
  /**
   * Initializes Vuex modules.
   * This is done here instead of a boot file so errors can be handled
   * by Vue's errorHandler, which needs the Vue instance. Furthermore, this is
   * useful to pre-load the store before the components are loaded.
   *
   * https://quasar.dev/quasar-cli/prefetch-feature
   *
   * @param {Object} context Exposes the following objects: store, currentRoute,
   * previousRoute, redirect, ssrContext, urlPath, publicPath.
   * @param {Object} context.store The Vuex store instance.
   */
  async preFetch ({ store }) {
    // Payload is null.
    store.dispatch('projectSubmit/initStore', null, { root: true })
    store.dispatch('projectDisplay/initStore', null, { root: true })
  }
}
</script>

<style lang="stylus">

.q-page
  padding 30px 5vw

// https://tobiasahlin.com/blog/how-to-animate-box-shadow/
.hoverable {
  cursor: pointer;
  // position: relative;
  // display: inline-block;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  -webkit-transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hoverable::after {
  content: "";
  border-radius: 5px;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  opacity: 0;
  -webkit-transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hoverable:hover {
  -webkit-transform: scale(1.0, 1.0);
  transform: scale(1.0, 1.0);
}

.hoverable:hover::after {
  opacity: 1;
}
// -----------------------------------------------------------------------------

// Sets mouse hovering background color
.highlight:hover {
  background-color: rgba(236, 233, 233, 0.884);
  border-radius: 3px;
  cursor: pointer;
}

br.small {
  display: block; /* makes it have a width */
  content: "";    /* clears default height */
  margin-top: 0em;  /* change this to whatever height you want it */
}

// Scrollbar width for horizontal and vertical scrollbars
div::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

// Scrollbar track's color and width
div::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 2px;
}

// Scrollbar color
div::-webkit-scrollbar-thumb {
  background: rgb(219, 122, 122);
  border-radius: 3px;
}

textarea {
  cursor: auto;
}

textarea::-webkit-scrollbar {
  width: 6px;
}

// Scrollbar track's color and width
textarea::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 2px;
}

// Scrollbar color
textarea::-webkit-scrollbar-thumb {
  background: rgb(219, 122, 122);
  border-radius: 3px;
}

// Coloring even child of the table
tr:nth-child(even) {
  background-color: #3498db14;
}

td {
  overflow-wrap break-word;
  word-wrap: break-word;
  word-break: break-all;
}

// Center image/elements within div element
.center-img {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
}

// From Quasar
.my-sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th // bg color is important for th; just specify one
    background-color $blue-grey-1 // for the color of display

  thead tr:first-child th
    position sticky
    top 0
    opacity 1
    z-index 1

/* Colors from: https://www.december.com/html/spec/color2.html */
.full-color {
  background-image: linear-gradient(#00EE00, #9AFF9A, #00EE00)
}

/* Colors from: https://www.december.com/html/spec/color1.html */
.half-full-color {
  background-image: linear-gradient(#FFE600, #FFF68F, #FFE600)
}

/* Colors from: https://www.december.com/html/spec/color0.html */
.null-color {
  background-image: linear-gradient(#E0E0E0, #F5F5F5, #E0E0E0)
}

.progress-bar {
  min-width: 150px;
  max-width: 35%
  min-height: 50px;
  height: 30px;
  line-height: 45px;
  text-align: center;
  font-family: Verdana, Arial, sans-serif;
  font-weight: 500;
  border: solid 1.5px;
  border-color: gray;
}

/* Colors from: https://www.december.com/html/spec/color2.html */
.green-priority {
  background-image: linear-gradient(#00EE00, #9AFF9A, #00EE00)
}

/* Colors from: https://www.december.com/html/spec/color1.html */
.yellow-priority {
  background-image: linear-gradient(#FFE600, #FFF68F, #FFE600)
}

/* Colors from: https://www.december.com/html/spec/color1.html */
.red-priority {
  background-image: linear-gradient(#ED0C0C, #ED8C8C, #ED0C0C)
}

/* Colors from: https://www.december.com/html/spec/color0.html */
.null-priority {
  background-image: linear-gradient(#E0E0E0, #F5F5F5, #E0E0E0)
}

hr.newLine2 {
  display: block; height: 1px;
  border: 1; border-top: 1px solid #ccc;
  margin: 0em; padding: 0em;
}

br.small {
  display: block; /* makes it have a width */
  content: "";    /* clears default height */
  margin-top: 0em;  /* change this to whatever height you want it */
}

h4 {
  font-size: 2.0em;
  margin: 10px;
  padding: 10px;
}

h5
  margin 10px

h6
  margin 0

.header {
  font-size: 16px;
  font-weight: bold;
}

ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "\25A0"; // Add content: \25A0 is the CSS Code/unicode for a block bullet
  color: $secondary; // Set the color
  font-weight: bold;
  display: inline-block; // add space between the bullet and the text
  width: 1em; // space between bullet and text
  margin-left: -2em; // space between bullet and margin
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
// Normalize Font Awesome icons to be similar to Material icons.
.fas
  font-size 17px !important
  left 3px

// This styles the notification that appears when input is not valid.
.q-field__bottom
  // Ensures that the error message isn't hidden under other elements.
  z-index 1

</style>
