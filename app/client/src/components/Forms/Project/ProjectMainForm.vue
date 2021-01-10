q<!-- ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     components/Forms/Project/ProjectMainForm.vue
Purpose:

  Form to allow the users to submit projects which are
  either addressing certain challenge or personally hobby projects
  that the user wishes to show off. Data here does not mutate
  Vuex store until form is submitted.

Methods:

  First, some initial data, such as keyword options, are loaded from Vuex. Then,
  the user fills out the project form. Unlike 'ProjectCustomForm.vue',
  some of the input fields here are always mandatory. Input is first stored
  locally and does not immediately sync with Vuex. Only when validated and
  submitted, is a copy of the data synced to Vuex. The forms don't have a
  two-way binding with Vuex state to prevent mutations that were not
  caused by Vuex. Submission is triggered in the parent component via a ref.

## -->

<template>
  <div>
    <h5>New Project</h5>
    <q-form
      ref="form"
      class="q-pd-md"
    >
      <div class="container">
        <p class="q-mb-xl">
          Submit a problem or challenge (an itch)  you would like solve or explore (scratch).
        </p>
        <q-separator color="grey-5" />
        <!-- -------------------- Project Name -------------------- -->
        <q-input
          filled lazy-rules clearable
          clear-icon="close"
          class="q-mt-sm"
          ref="projectName"
          placeholder="ie. Raspberry Pi BSP for VxWorks7"
          label="Project Name"
          v-model="projectName"
          :rules="[
            val => $v.projectName.required || 'Field is required',
            val => $v.projectName.maxLength || 'Max length is 60 characters'
          ]"
          @input="$v.projectName.$touch()"
          @keydown.ctrl.shift.65="activateAdmin"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-project-diagram" />
          </template>
        </q-input>
          <!-- -------------------- Project Description -------------------- -->
        <q-input
          filled autogrow lazy-rules clearable
          clear-icon="close"
          class="q-my-sm"
          ref="projectDescription"
          v-model="projectDescription"
          placeholder="Please give 2-5 sentences overview of the project. (Grows automatically.)"
          label="Description/Overview"
          type="textarea"
          @input="$v.projectDescription.$touch()"
          :rules="[val => $v.projectDescription.required || 'Field is required']"
        >
          <template v-slot:prepend>
            <q-icon name="far fa-comment-alt" />
          </template>
        </q-input>

        <q-separator color="grey-5" />

        <!--  -------------------- Keywords -------------------- -->
        <div class="row q-pa-sm" align="left">
          <p class="col-4 header">Keywords:</p>

          <q-option-group
            dense inline
            class="col" type="checkbox"
            :options="keywordOptions"
            v-model="chosenKeywords"
          />
        </div>

        <q-separator color="grey-5" />

        <!-- -------------------- Team Member -------------------- -->
        <div>
          <div class="row">
            <p class="col q-pa-sm header" align="left">
              Team Members:
            </p>

            <span class="col-1 q-mt-sm" >
              <q-btn
                dense round
                color="accent" icon="add"
                @click="addContributor"
              />
            </span>
          </div>

          <div
            v-for="(member, index) in projectMembers"
            :key="index"
            class="row q-mb-xs"
          >
            <q-input
              :autofocus="index > 0"
              filled lazy-rules clearable
              clear-icon="close"
              class="col q-pr-xs"
              placeholder="ie. john.doe@gmail.com"
              label="Contributor's Email" type="email"
              v-model="projectMembers[index].email"
              :ref="`memberEmail${index}`"
              :rules="[val => !!val || 'Field is required']"
              @blur="emailDomainCheck(projectMembers[index].email, index)"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input
              :disable="projectMembers[index].email in emailToUuidMap"
              filled lazy-rules clearable
              clear-icon="close"
              class="col q-pl-xs"
              placeholder="ie. John Doe"
              label="Contributor's Full Name"
              v-model="projectMembers[index].name"
              :ref="`memberName${index}`"
              :rules="[val => !!val || 'Field is required']"
              @blur="capitalizeFirstChar(index)"
            >
              <template v-slot:prepend>
                <q-icon name="group" />
              </template>
            </q-input>

            <div class="col-1">
              <q-card flat align="center">
                Lead
                <q-toggle
                  color="secondary"
                  true-value="lead"
                  false-value="member"
                  v-model="projectMembers[index].role"
                />
              </q-card>
            </div>

            <div class="col-1 q-mt-sm">
              <q-btn
                :hidden="index < 1"
                round flat
                icon="delete"
                @click="projectMembers.splice(index, 1)"
              />
            </div>
          </div>
        </div>

        <!-- -------------------- Admin Mode -------------------- -->
        <div :hidden="!adminMode">
          <q-separator color="grey-5" />
          <!-- -------------------- Chips -------------------- -->
          <div>
            <div class="row" align="left">
              <p class="col q-pa-sm header">
                Add Chips:
              </p>

              <q-select
                dense outlined options-dense
                class="col-3" label="Chip Type"
                style="overflow: auto;"
                :options="chipTypeOptions"
                v-model="chipType"
              />

              <div class="col-1 q-mt-sm" align="center" >
                <q-btn
                  dense round
                  color="accent" icon="add"
                  :disable="chipType === ''"
                  @click="addChip(); addedChip = true"
                />
              </div>
            </div>

            <div
              v-for="(chipContent, chipInd) in webpage.chips"
              :key="chipInd"
              class="row q-mt-sm q-mb-sm"
            >
              <!-- ------------------- Chip Type SOURCE -------------------- -->
              <div
                v-if="chipContent.content.type === 'SOURCE'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Source Chip</strong>
                    <q-separator color="grey-5" class="col q-ml-sm" />
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm" label="Source"
                    placeholder="Link to source code goes here."
                    v-model="chipContent.content.url"
                    :autofocus="addedChip"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedChip = false"
                  />
                </q-card>
              </div>

              <!-- -------------------- Chip Type VIDEO -------------------- -->
              <div
                v-if="chipContent.content.type === 'VIDEO'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Video Chip</strong>
                    <q-separator color="grey-5" class="col q-ml-sm" />
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm" label="Video"
                    placeholder="Link to video goes here. (Currently only supports one.)"
                    v-model="chipContent.content.url"
                    :autofocus="addedChip"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedChip = false"
                  />
                </q-card>
              </div>

              <!-- ------------------ Chip Index & Delete ------------------ -->
              <div class="col-1" style="margin: auto;" >
                <q-checkbox
                  dense
                  class="q-pa-sm q-mb-sm" label="Hide"
                  v-model="webpage.chips[chipInd].hidden"
                />

                <q-input
                  dense filled
                  class="q-pa-xs q-mb-sm" label="Index" type="number"
                  v-model="webpage.chips[chipInd].index"
                  @blur="webpage.chips[chipInd].index = webpage.chips[chipInd].index < 1 ?  1 : parseInt(webpage.chips[chipInd].index)"
                />

                <q-btn
                  dense round
                  class="bottom" color="accent" icon="delete"
                  @click="webpage.chips.splice(chipInd, 1)"
                />
              </div>
            </div>
          </div>

          <!-- -------------------- Custom Field -------------------- -->
          <div>
            <div class="row" align="left">
              <p class="col q-pa-sm header">
                Add Content:
              </p>

              <q-select
                dense outlined options-dense
                class="col-3" label="Content Type"
                style="overflow: auto;"
                v-model="bodyType"
                :options="bodyTypeOptions"
              />

              <div class="col-1 q-mt-sm" align="center" >
                <q-btn
                  dense round
                  color="accent" icon="add"
                  :disable="bodyType === ''"
                  @click="addCustomField(); addedContent = true"
                />
              </div>
            </div>

            <div
              v-for="(bodyContent, ind) in webpage.body"
              :key="ind"
              class="row q-mt-sm q-mb-sm"
            >

              <!-- ----------------- Custom Type TEXT_BOX ----------------- -->
              <div
                v-if="bodyContent.content.type === 'TEXT_BOX'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Text Box</strong>
                    <q-separator color="grey-5" class="col q-ml-sm" />
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm" label="Label" placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <q-input
                    filled autogrow
                    class="q-mt-sm" label="Body/Text Description"
                    placeholder="Please enter the body for the respective label."
                    v-model="bodyContent.content.text"
                    :rules="[val => !!val || 'Field is required']"
                  />
                </q-card>
              </div>

              <!-- -------------- Custom Type UNORDERED_LIST -------------- -->
              <div
                v-else-if="bodyContent.content.type === 'UNORDERED_LIST'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Unordered List</strong>
                    <q-separator color="grey-5" class="col q-ml-sm" />
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm" label="Label" placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <div class="row inline full-width q-pa-md">
                    <strong>List</strong>
                    <q-separator color="grey-5" class="col q-ml-sm q-mr-sm" />
                    <div>
                      <q-btn
                        dense round
                        color="accent" icon="add"
                        @click="bodyContent.content.list.push({})"
                      />
                    </div>
                  </div>

                  <ul>
                    <li
                      v-for="(link, ulIndex) in bodyContent.content.list"
                      :key="ulIndex"
                      align="left"
                    >
                      <div class="row inline full-width q-gutter-xs q-mb-sm">
                        <q-input
                          dense filled
                          class="col" label="URL Name"
                          placeholder="Please enter the alias for the URL."
                          v-model="link.item"
                          :rules="[val => !!val || 'Field is required']"
                        />

                        <q-input
                          dense filled
                          class="col" label="URL" placeholder="https://www.google.com"
                          v-model="link.url"
                          :rules="[val => true]"
                        />

                        <q-btn
                          :disable="bodyContent.content.list.length === 1"
                          dense flat round
                          icon="delete"
                          @click="bodyContent.content.list.splice(ulIndex, 1)"
                        />
                      </div>
                    </li>
                  </ul>
                </q-card>
              </div>

              <!-- --------------- Custom Type ORDERED_LIST --------------- -->
              <div
                v-else-if="bodyContent.content.type === 'ORDERED_LIST'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Ordered List</strong>
                    <q-separator color="grey-5" class="col q-ml-sm" />
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm" label="Label"
                    placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <div class="row inline full-width q-pa-md">
                    <strong>List</strong>
                    <q-separator color="grey-5" class="col q-ml-sm q-mr-sm" />
                    <div>
                      <q-btn
                        dense round
                        color="accent" icon="add"
                        @click="bodyContent.content.list.push({index: bodyContent.content.list.length + 1})"
                      />
                    </div>
                  </div>

                  <ul>
                    <li
                      v-for="(link, olIndex) in bodyContent.content.list"
                      :key="olIndex"
                      align="left"
                    >
                      <div class="row inline full-width q-gutter-xs q-mb-sm">
                        <q-input
                          dense filled
                          class="col-1" type="number" label="Index"
                          v-model="link.index"
                          :rules="[val => !!val]"
                          @blur="link.index = link.index > 0 ? parseInt(link.index) : 1"
                        />

                        <q-input
                          dense filled
                          class="col" label="URL Name"
                          placeholder="Please enter the alias for the URL."
                          v-model="link.item"
                          :rules="[val => !!val || 'Field is required']"
                        />

                        <q-input
                          dense filled
                          class="col" label="URL"
                          placeholder="https://www.google.com"
                          v-model="link.url"
                          :rules="[val => true]"
                        />

                        <q-btn
                          :disable="bodyContent.content.list.length === 1"
                          dense flat round
                          icon="delete"
                          @click="bodyContent.content.list.splice(olIndex, 1)"
                        />
                      </div>
                    </li>
                  </ul>
                </q-card>
              </div>

              <!-- ---------------- Custom Type EVENT_LIST ---------------- -->
              <div
                v-else
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Event List</strong>
                    <q-separator color="grey-5" class="col q-ml-sm" />
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm" label="Label" placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <div class="row inline full-width q-pa-md">
                    <strong>List</strong>
                    <q-separator color="grey-5" class="col q-ml-sm q-mr-sm" />
                    <div>
                      <q-btn
                        dense round
                        color="accent" icon="add"
                        @click="bodyContent.content.list.push({})"
                      />
                    </div>
                  </div>

                  <ul>
                    <li
                      v-for="(link, evIndex) in bodyContent.content.list"
                      :key="evIndex"
                      align="left"
                    >
                      <div class="row inline full-width">
                        <div class="row inline full-width q-gutter-xs">
                          <q-input
                            dense filled
                            class="col" label="Subject"
                            placeholder="Please enter the subject matter here."
                            v-model="link.subject"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-input
                            dense filled
                            class="col" label="Date and Time"
                            placeholder="2019:06:02.00:00"
                            v-model="link.date"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-btn
                            disable dense flat round
                            @click="bodyContent.content.list.splice(evIndex, 1)"
                          />
                        </div>
                        <div class="row inline full-width q-gutter-xs">
                          <q-input
                            dense filled
                            class="col" label="Body"
                            placeholder="Please enter the details regarding the subject matter."
                            v-model="link.body"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-input
                            dense filled
                            class="col" label="URL"
                            placeholder="https://www.google.com"
                            v-model="link.url"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-btn
                            :disable="bodyContent.content.list.length === 1"
                            dense flat round
                            icon="delete"
                            @click="bodyContent.content.list.splice(evIndex, 1)"
                          />
                        </div>
                      </div>
                    </li>
                  </ul>

                </q-card>
              </div>

              <!-- ------------- Custom Field Index & Delete --------------- -->
              <div class="col-1" style="margin: auto;" >
                <q-checkbox
                  dense
                  class="q-pa-sm q-mb-sm" label='Hide'
                  v-model="webpage.body[ind].hidden"
                />

                <q-input
                  dense filled
                  class="q-pa-xs q-mb-md" label="Index" type="number"
                  v-model="webpage.body[ind].index"
                  @blur="webpage.body[ind].index = webpage.body[ind].index < 1 ?  1 : parseInt(webpage.body[ind].index)"
                />

                <q-btn
                  dense round
                  class="bottom" color="accent" icon="delete"
                  @click="webpage.body.splice(ind, 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-form>

  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('projectSubmit')
import cloneDeep from 'lodash/clonedeep'

export default {
  validations: {
    projectName: {
      required,
      maxLength: maxLength(60)
    },
    projectDescription: {
      required
    },
    projectMembers: {
      $each: {
        name: {
          required,
          maxLength: maxLength(60)
        },
        email: {
          required
        }
      }
    }
  },
  // Computed properties from Vuex should not be modified in this component.
  computed: {
    ...mapGetters([
      'db',
      'keywordOptions',
      'allowedDomain',
      'bodyTypeOptions',
      'chipTypeOptions',
      'emailToUuidMap',
      'emailToNameMap'
    ]),
    // <Boolean>: Whether any input field has been modified (checks explicitly).
    modified () {
      return !!(this.projectName !== '' || this.projectDescription !== '' ||
        (this.projectMembers.length > 1 || this.projectMembers[0].email !== '') ||
        this.chosenKeywords.length > 0)
    }
  },
  // Data should be unique from computed.
  data () {
    return {
      projectName: '', // <String>: name of the new project
      projectDescription: '', // <String>: description of the new project
      projectMembers: [ // <Array<Object>>: list of project member/s
        {
          name: '', // <String>: name of the member
          email: '', // <String>: email of the member
          role: 'lead' // <String>: role of the member
        }
      ],
      webpage: { // <Object>: record of extra information for the webpage
        imgURL: '', // <String>: url of the main image
        chips: [], // <Array<Object>>: list of chips for the webpage
        body: [] // <Array<Object>>: list of body contents for the webpage
      },
      bodyType: '', // <String>: type of body content
      chipType: '', // <String>: type of chip
      chosenKeywords: [], // <Array<String>>: associated keywords of the project
      addedChip: false, // <Boolean>: flag to check if chip type is selected
      // addedContent <Boolean>: flag to check if content type is selected
      addedContent: false,
      adminMode: false // <Boolean>: flag for activating admin mode
    }
  },
  methods: {
    ...mapMutations([
      'setProject',
      'setProjectMembers',
      'setWebpage'
    ]),
    /**
     * Submits the project once all the required fields are checked,
     * creates the new users who are not in the db, and notifies
     * the user on both success and failure.
     */
    saveToVuex () {
      const newProject = {
        uuid: null,
        project: this.projectName,
        description: this.projectDescription,
        members: [],
        keywords: this.chosenKeywords,
        timestamp: null,
        created: null,
        progress: 0,
        hidden: false,
        alias: ''
      }
      // Copies variables to avoid mutating values in Vuex.
      this.setProjectMembers(cloneDeep(this.projectMembers))
      this.setWebpage(cloneDeep(this.webpage))
      this.setProject(cloneDeep(newProject))
    },
    /**
      * When all form inputs are valid and when submit button is clicked,
      * save to vuex and tell the parent component to advance the stepper.
      */
    submit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.saveToVuex()
          this.$emit('submittedSuccessfully')
        }
      })
    },
    /**
     * Check allowed domain for the new users and
     * notifies the user if the domain is not allowed
     * @param {String} indexEmail: email at the index
     * @param {Integer} index: index of the email
     */
    emailDomainCheck: function (indexEmail, index) {
      let validEmail = false
      indexEmail = indexEmail.toLowerCase()
      if (this.allowedDomain.length > 0) {
        this.allowedDomain.forEach(entry => {
          if (indexEmail.includes(entry)) {
            validEmail = true
          }
        })
      } else {
        validEmail = true
      }

      if (!validEmail) {
        this.$q.notify({
          color: 'negative',
          message: 'Only [' + this.allowedDomain.join(', ') + '] are allowed!',
          icon: 'warning'
        })

        this.projectMembers[index].email = ''
      } else {
        this.projectMembers[index].email = indexEmail
      }

      if (indexEmail in this.emailToNameMap) {
        this.projectMembers[index].name = this.emailToNameMap[indexEmail]

        this.$q.notify({
          message: 'Existing user data was pulled from database',
          timeout: 500,
          type: 'positive'
        })
      } else {
        if (indexEmail !== '') {
          this.$q.dialog({
            dark: true,
            title: 'Prompt',
            message: 'Please enter the email again.',
            persistent: true,
            prompt: {
              model: '',
              type: 'text'
            }
          }).onOk(data => {
            data = data.toLowerCase()
            if (data !== indexEmail) {
              this.$q.notify({
                message: 'The emails must be identical.',
                color: 'negative'
              })
              this.projectMembers[index].email = ''
            } else {
              this.$q.notify({
                message: 'The user will be registered during project submit.',
                color: 'positive'
              })
            }
          })
        }
      }
    },
    /**
     * Helper function to help capitalize first character of
     * the input at a given index and notifies the user on fail
     * @param {Integer} index: index of the input DOM
     */
    capitalizeFirstChar: function (index) {
      const nameToken = this.projectMembers[index].name.split(' ')

      if (nameToken.length < 2 && nameToken[0] !== '') {
        this.$q.notify({
          position: 'top',
          color: 'negative',
          message: 'Please enter "{First Name} {Last Name}" and thank you!'
        })
        this.projectMembers[index].name = ''
      } else if (nameToken.length >= 2) {
        if (nameToken.includes('')) {
          this.$q.notify({
            position: 'top',
            color: 'negative',
            message: 'Invalid name!'
          })
          this.projectMembers[index].name = ''
        } else {
          for (let i = 0; i < nameToken.length; i++) {
            nameToken[i] = nameToken[i].charAt(0).toUpperCase() + nameToken[i].substr(1)
          }
          this.projectMembers[index].name = nameToken.join(' ')
        }
      }
    },
    /**
     * Adds sponsors with the instantiated values.
     */
    addContributor: function () {
      this.projectMembers.push({
        name: '',
        email: '',
        role: 'member'
      })
    },
    /**
     * Allow the user to add custom content on the body section
     * which will be displayed on their individual webpage.
     */
    addCustomField: function () {
      let tmpBody = {}

      if (this.bodyType.value === 'TEXT_BOX') {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value
          }
        }
      } else if (this.bodyType.value === 'UNORDERED_LIST') {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {}
            ]
          }
        }
      } else if (this.bodyType.value === 'ORDERED_LIST') {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {
                index: 1
              }
            ]
          }
        }
      } else {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {}
            ]
          }
        }
      }
      tmpBody['hidden'] = false
      this.webpage.body.push(tmpBody)
    },
    /**
     * Allow the user to add custom chip for the chips section
     * which will be displayed on their individual webpage.
     */
    addChip: function () {
      let tmpChip = {}

      if (this.chipType.value === 'SOURCE') {
        tmpChip = {
          index: this.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'code'
          }
        }
      } else if (this.chipType.value === 'VIDEO') {
        tmpChip = {
          index: this.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'movie'
          }
        }
      } else {
        tmpChip = {
          index: this.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value
          }
        }
      }
      tmpChip['hidden'] = false
      this.webpage.chips.push(tmpChip)
    },
    /**
     * Allows the user to see body content and chips on the Add Challenge page
     * and notifies the user on success.
     * TODO: will be deprecated later
     */
    activateAdmin: function () {
      this.adminMode = true
      this.$q.notify({
        message: 'Admin mode activated! Enjoy.',
        color: 'positive'
      })
    },
    /**
     * Basically sets values as if the page were first loaded.
     * Helper function which resets the input fields of the form and
     * emits 'added' event when the component is a child component.
     */
    reset () {
      this.$refs.form.resetValidation()
      this.projectName = ''
      this.projectDescription = ''
      this.projectMembers = [{
        name: '',
        email: '',
        role: 'lead'
      }]
      this.webpage = {
        imgURL: '',
        chips: [],
        body: []
      }
      this.bodyType = ''
      this.chipType = ''
      this.chosenKeywords = []
      this.$emit('added')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
