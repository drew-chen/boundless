<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     components/EditAndPreview/EditAndPreviewProject.vue
Purpose:  The user interface to allow the admin to edit and preview the
          resulting edits of the project before submitting
Methods:
  * Allows the admin to edit project
  * Allows the admin to preview projects

## -->

<template>
  <div class="q-pa-lg">
    <q-layout>
      <!-- -------------------- Header -------------------- -->
      <q-header reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center" >
              <strong v-if="childMode === 'edit'">Edit Mode</strong>
              <strong v-else>Preview Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <!-- -------------------- Footer -------------------- -->
      <q-footer reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center">
              <strong v-if="childMode === 'edit'">Edit Mode</strong>
              <strong v-else>Preview Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <!-- -------------------- Loading Spinner -------------------- -->
      <div
        v-if="loading"
        class="absolute-center"
        style="bottom: 15vh;"
      >
        <q-spinner color="primary" size="8em" />
      </div>

      <!-- -------------------- Main Content -------------------- -->
      <q-form
        v-else
        @submit="onSubmit"
      >
        <q-splitter
          v-model="splitterModel"
          disable
        >

          <template v-slot:before>
            <q-tabs
              vertical inline-label stretch
              class="text-primary"
              v-model="pageTab"
            >
              <q-tab
                no-caps
                name="main" icon="view_stream" label="Main"
              />

              <q-separator />

              <!-- <q-tab
                no-caps
                name="logs" icon="forum" label="Logs"
              />

              <q-separator /> -->

              <q-tab
                no-caps
                name="attachments" icon="attachment" label="Attachments"
              />

              <q-separator />

              <q-tab
                no-caps
                name="formResponse" icon="list" label="Form Response"
              />

              <q-separator />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="pageTab"
              animated
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <!-- -------------------- Main -------------------- -->
              <q-tab-panel name="main">
                <div
                  v-if="curData"
                  class="tab-content shadow-2"
                >
                  <!-- ----------------- Preview Project ----------------- -->
                  <div v-if="childMode === 'preview'">
                    <br class="small">

                    <!-- ----------------- Project Page ----------------- -->
                    <div class="q-pa-md" align="left">

                      <!-- ---------------- Project Title ---------------- -->
                      <div class="q-pa-md text-h4 text-primary text-center">
                        {{ curData.project }}
                        <q-separator />
                      </div>

                      <!-- -------------- Project Overview -------------- -->
                      <div
                        class="q-pa-sm q-col-gutter-md row items-start"
                        style="height: 320px;"
                      >

                        <div class="col-9">
                          <div class="text-h5">
                            Overview
                            <q-separator color="secondary" />
                          </div>

                          <div
                            class="row q-mt-sm q-mb-sm"
                            style="max-height: 240px;"
                          >
                            <div class="col-5 q-mt-sm">
                              <!-- -------------- Main Image ------------- -->
                              <q-img
                                contain
                                class="project-img"
                                :src="mainImage.cur"
                                :style="
                                  `background: ${
                                    mainImage.color ? mainImage.color : 'black'
                                  }`
                                "
                                :ratio="4/3"
                              />
                            </div>

                            <!-- -------------- Description -------------- -->
                            <div class="col overview">

                              <div class="q-pa-sm">
                                <pre>{{ curData.description }}</pre>
                              </div>

                            </div>
                          </div>
                        </div>

                        <div class="col-3" >

                          <div class="text-h5">
                            Team
                            <q-separator color="secondary" />
                          </div>

                          <div class="overview">
                            <q-list dense>
                              <q-item
                                v-for="(teamMember, index) in curData.members"
                                :key="index"
                                clickable v-ripple
                                class="q-my-sm"
                              >
                                <q-item-section avatar>
                                  <q-avatar color="primary" text-color="secondary"  >
                                    {{ teamMember.name[0] }}
                                  </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                  <q-item-label v-if="teamMember.role === 'lead'">
                                    {{ teamMember.name }}: ({{ teamMember.role }})
                                  </q-item-label>
                                  <q-item-label v-else>
                                    {{ teamMember.name }}
                                  </q-item-label>
                                  <q-item-label caption lines="1">
                                    {{ teamMember.email }}
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </div>

                        </div>

                      </div>

                      <q-separator inset />

                      <!-- ---------------- Progress Bar ----------------- -->
                      <div class="q-pa-md text-h7" align="center">
                        <div class="text-h5">
                          Progress
                        </div>

                        <ProgressBar
                          class="q-mt-sm progress-bar"
                          :progressBar="progressBar"
                          :progress="curData.progress"
                        />
                      </div>

                      <q-separator inset />

                      <!-- ---------------- Project Chips ---------------- -->
                      <div class="q-pa-md" align="center">

                        <q-chip
                          disable clickable
                          color="secondary"
                          text-color="white" icon="far fa-clipboard"
                        >
                          Copy URL
                        </q-chip>

                        <span
                          v-for="(chipContent, chipInd) in curData.webpage.chips"
                          :key="chipInd"
                        >
                          <q-chip
                            v-if="!chipContent.hidden"
                            clickable
                            color="secondary" text-color="white"
                            :icon="chipContent.content.icon"
                            @click="openNewTab(chipContent.content.url)"
                          >
                            {{ chipContent.content.label }}
                          </q-chip>
                        </span>

                        <q-chip
                          clickable
                          @click="popDialog('keywords')"
                          color="secondary" text-color="white" icon="vpn_key"
                        >
                          Keywords
                        </q-chip>

                      </div>

                      <!-- ------------------- Body ------------------- -->
                      <div class="q-pa-md">
                        <div
                          v-for="(bodyContent, bodyInd) in curData.webpage.body"
                          :key="bodyInd"
                        >
                          <div :hidden="bodyContent.hidden === true">
                            <div class="text-h5 q-mt-sm">
                              {{ bodyContent.content.label }}
                            </div>

                            <q-separator color="secondary" />

                            <div>
                              <div
                                v-if="bodyContent.content.type === 'TEXT_BOX'"
                              >
                                <div class="q-pa-sm">
                                  <pre>{{ bodyContent.content.text }}</pre>
                                </div>
                              </div>

                              <div
                                v-else-if="
                                  bodyContent.content.type === 'MARKDOWN'
                                "
                              >
                                <div class="q-pa-sm">
                                  <MarkdownTranslator
                                    :storage="storage"
                                    :data="bodyContent.content.text"
                                  />
                                </div>
                              </div>

                              <div v-else>
                                <ul>
                                  <li
                                    v-for="(link, ulIndex) in bodyContent.content.list"
                                    :key="ulIndex"
                                  >
                                    <div
                                      v-if="(
                                        bodyContent.content.type ===
                                        'EVENT_LIST'
                                      )"
                                      style="
                                          display: inline; padding-left: 12px;
                                        "
                                    >
                                      {{ link.subject }}
                                      <hr>
                                      Description: {{ link.body }} <br>
                                      Date and Time: {{ link.date }} <br>
                                      <a v-if="link.url !== ''" :href="link.url">More...</a>
                                    </div>
                                    <span v-else>
                                      <em v-if="link.url === ''">
                                        {{ link.item }}
                                      </em>
                                      <a
                                        v-else
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        :href="link.url"
                                      >
                                        {{ link.item }}
                                      </a>
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <br>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br><br>

                  </div>

                  <!-- ------------------ Edit Project ------------------- -->
                  <div v-else-if="childMode === 'edit'">
                    <br class="small">

                    <!-- ----------------- Project Page ------------------ -->
                    <div class="q-pa-md" align="left">

                      <!-- --------------- Project Title ----------------- -->
                      <div class="q-pa-md text-h4 text-primary text-center">
                        <a class="cursor-pointer">{{ curData.project }} </a>

                        <q-icon
                          class="cursor-pointer"
                          name="edit" size=".8em" color="accent"
                        />

                        <popup-input-limit-len
                          title="Edit Project Name"
                          :lenLimit="60"
                          :initialValue="curData.project"
                          @save="saveEditedName($event)"
                        />

                        <q-separator />
                      </div>

                      <!-- -------------- Project Overview --------------- -->
                      <div
                        class="q-pa-sm q-col-gutter-md row items-start"
                        style="height: 320px;"
                      >
                        <!-- -------------- Overview Panel --------------- -->
                        <div class="col-9">
                          <!-- ----------------- Title ------------------ -->
                          <div class="text-h5">
                            Overview
                            <q-separator color="secondary" />
                          </div>

                          <!-- ---------------- Content ------------------ -->
                          <div
                            class="row q-mt-sm q-mb-sm"
                            style="max-height: 240px;"
                          >
                            <!-- ------------- Main Image ---------------- -->
                            <div class="col-5 q-mt-sm">
                              <div align="center">
                                <q-btn
                                  outline
                                  label="Image Background Color"
                                  @click="updated = true"
                                >
                                  <q-popup-proxy
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-color flat v-model="mainImage.color" />

                                    <q-btn flat v-close-popup>
                                      Done
                                    </q-btn>
                                  </q-popup-proxy>
                                </q-btn>
                              </div>
                              <div
                                class="cursor-pointer"
                                @click="invokeFilePicker"
                              >
                                <q-img
                                  contain
                                  class="project-img"
                                  :src="mainImage.cur"
                                  :style="
                                    `background: ${
                                      mainImage.color ? mainImage.color : 'black'
                                    }`
                                  "
                                  :ratio="4/3"
                                />

                                <q-icon
                                  dense flat
                                  size="xs" color="accent" name="collections"
                                  class="full-width"
                                />

                                <input
                                  hidden
                                  type="file" ref="imageInput"
                                  accept="image/*"
                                  @change="filePickerOnChange"
                                />

                                <q-tooltip
                                  anchor="bottom middle"
                                  self="top middle"
                                  :offset="[10, 10]"
                                >
                                  Choose your image file...
                                </q-tooltip>
                              </div>
                            </div>

                            <!-- ------------- Description --------------- -->
                            <div class="col overview">

                              <q-input
                                filled autogrow
                                class="q-pa-sm"
                                v-model="curData.description"
                                :rules="[val => !!val || notifyError()]"
                                @focus="updated = true"
                              />

                            </div>
                          </div>

                        </div>

                        <!-- --------------- Team Panel ----------------- -->
                        <div class="col">

                          <div class="text-h5">
                            <div class="row">
                              Team
                              <q-space/>

                              <!-- Adding Member/s to Project -->
                              <div>
                                <q-btn
                                  dense round
                                  size="sm" color="accent" icon="add"
                                  @click="addProjectMember"
                                />
                              </div>
                            </div>

                            <q-separator class="q-mb-sm" color="secondary" />
                          </div>

                          <div
                            class="overview q-mt-sm"
                            style="overflow-x: hidden; padding: 2px 2px;"
                          >
                            <q-list dense>
                              <q-item
                                v-for="(teamMember, index) in curData.members"
                                :key="index"
                                clickable v-ripple
                                style="border-radius: 3px;"
                              >
                                <q-item-section avatar>
                                  <q-avatar color="primary" text-color="secondary"  >
                                    {{ teamMember.name[0] }}
                                  </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                  <q-item-label v-if="teamMember.role === 'lead'">
                                    {{ teamMember.name }}: ({{ teamMember.role }})
                                  </q-item-label>
                                  <q-item-label v-else>
                                    {{ teamMember.name }}
                                  </q-item-label>
                                  <q-item-label caption lines="1">
                                    {{ teamMember.email }}
                                  </q-item-label>
                                </q-item-section>

                                <div class="column q-pl-sm items-end">
                                  <div class="col">
                                    <q-toggle
                                      dense
                                      color="accent" true-value="lead"
                                      false-value="member"
                                      v-model="curData.members[index].role"
                                      @input="updated = true"
                                    />
                                  </div>

                                  <div class="col">
                                    <q-btn
                                      :disable="curData.members.length === 1"
                                      dense round
                                      color="accent" size="sm" icon="delete"
                                      @click="
                                        curData.members.splice(index, 1);
                                        updated = true
                                      "
                                    />
                                  </div>
                                </div>
                              </q-item>
                            </q-list>

                          </div>

                        </div>
                      </div>

                      <q-separator inset />
                      <!-- --------------- Progress Bar ------------------ -->
                      <div class="q-pa-md text-h7" align="center">
                        <div class="text-h5">
                          Progress
                        </div>

                        <div class="row q-mt-sm">
                          <div class="col">
                            <!-- Col filler -->
                          </div>

                          <ProgressBar
                            class="col progress-bar"
                            :progressBar="progressBar"
                            :progress="curData.progress"
                          />

                          <div class="col q-ml-sm" align="left">
                            <div v-if="mode === 'edit'">
                              <div class="row">
                                <q-btn
                                  dense
                                  size="sm" color="accent"
                                  icon="keyboard_arrow_up"
                                  @click="progressCountUp"
                                />
                              </div>
                              <div class="row" style="margin-top: 1px;">
                                <q-btn
                                  dense
                                  size="sm" color="accent"
                                  icon="keyboard_arrow_down"
                                  @click="progressCountDown"
                                />
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                      <hr>
                      <!-- ------------------ Keywords ------------------ -->
                      <div class="row q-pa-sm" align="left">
                        <p class="col-4 header">Keywords:</p>

                        <q-option-group
                          dense inline
                          class="col" type="checkbox"
                          v-model="curData.keywords"
                          :options="keywordOptions"
                          @input="updated = true"
                        />
                      </div>

                      <hr>
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
                            v-model="chipType"
                            :options="configData.chipContentType"
                          />

                          <div class="col-1 q-mt-sm" align="center" >
                            <q-btn
                              :disable="chipType === ''"
                              dense round
                              color="accent" icon="add"
                              @click="addChip(); addedChip = true"
                            />
                          </div>
                        </div>

                        <div
                          v-for="(chipContent, chipInd) in curData.webpage.chips"
                          :key="chipInd"
                          class="row q-mt-sm q-mb-sm"
                        >
                          <!-- ----------- Chip Type SOURCE -------------- -->
                          <div
                            v-if="chipContent.content.type === 'SOURCE'"
                            class="col q-mb-xs q-pa-sm"
                          >
                            <q-card class="q-pa-md">
                              <div class="row" align="left">
                                <strong>Source Chip</strong>
                                <hr class="col q-ml-sm">
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

                          <!-- ------------- Chip Type VIDEO ------------- -->
                          <div
                            v-if="chipContent.content.type === 'VIDEO'"
                            class="col q-mb-xs q-pa-sm"
                          >
                            <q-card class="q-pa-md">
                              <div class="row" align="left">
                                <strong>Video Chip</strong>
                                <hr class="col q-ml-sm">
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

                          <!-- ------------ Chip Type CUSTOM ------------- -->
                          <div
                            v-if="chipContent.content.type === 'CUSTOM'"
                            class="col q-mb-xs q-pa-sm"
                          >
                            <edit-custom-chips
                              v-model="chipContent.content"
                              :options="configData.customChips || []"
                              :addedChip="addedChip"
                              @focus="addedChip = false"
                              @updated="updated = true"
                            />
                          </div>

                          <!-- ----------- Chip Index & Delete ----------- -->
                          <div
                            class="col-1" align="center"
                            style="margin: .7vh auto;"
                          >
                            <q-checkbox
                              dense
                              class="q-pa-sm q-mb-sm" label="Hide"
                              v-model="curData.webpage.chips[chipInd].hidden"
                            />

                            <q-input
                              dense filled
                              class="q-pa-xs q-mb-sm"
                              label="Index" type="number"
                              v-model="curData.webpage.chips[chipInd].index"
                              @blur="curData.webpage.chips[chipInd].index = curData.webpage.chips[chipInd].index < 1 ?  1 : parseInt(curData.webpage.chips[chipInd].index)"
                            />

                            <q-btn
                              dense round
                              class="bottom" color="accent" icon="delete"
                              @click="
                                curData.webpage.chips.splice(chipInd, 1)
                              "
                            />
                          </div>
                        </div>
                      </div>

                      <hr>

                      <!-- ---------------- Custom Field ----------------- -->
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
                            :options="configData.bodyContentType"
                          />

                          <div class="col-1 q-mt-sm" align="center" >
                            <q-btn
                              :disable="bodyType === ''"
                              dense round
                              color="accent" icon="add"
                              @click="addCustomField(); addedContent = true"
                            />
                          </div>
                        </div>

                        <div
                          v-for="(bodyContent, ind) in curData.webpage.body"
                          :key="ind"
                          class="row q-mt-sm q-mb-sm"
                        >

                          <!-- ---------- Custom Type TEXT_BOX ----------- -->
                          <div
                            v-if="bodyContent.content.type === 'TEXT_BOX'"
                            class="col q-mb-xs q-pa-sm"
                          >
                            <q-card class="q-pa-md">
                              <div class="row" align="left">
                                <strong>Text Box</strong>
                                <hr class="col q-ml-sm">
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

                              <q-input
                                filled autogrow
                                class="q-mt-sm" label="Body/Text Description"
                                placeholder="Please enter the body for the respective label."
                                v-model="bodyContent.content.text"
                                :rules="[val => !!val || 'Field is required']"
                              />
                            </q-card>
                          </div>

                          <!-- ---------- Custom Type MARKDOWN ----------- -->
                          <div
                            v-else-if="
                              bodyContent.content.type === 'MARKDOWN'
                            "
                            class="col q-mb-xs q-pa-sm"
                          >
                            <q-card class="q-pa-md">
                              <q-tabs
                                dense
                                class="text-grey" align="left"
                                active-color="secondary"
                                indicator-color="primary"
                                v-model="bodyContent.content.view"
                              >
                                <q-tab name="edit" label="Edit" />

                                <q-separator vertical />

                                <q-tab name="preview" label="Preview" />

                                <q-space />

                                <q-btn-dropdown
                                  v-if="
                                    curData.files &&
                                    Object.entries(curData.files).length
                                  "
                                  stretch flat
                                  label="Attachments"
                                >
                                  <q-list>
                                    <q-item
                                      v-for="(val, key, ind) in curData.files"
                                      :key="ind"
                                      dense
                                    >
                                      <q-item-section>
                                        {{ key }}
                                      </q-item-section>

                                      <q-item-section side avatar>
                                        <q-btn
                                          round flat dense
                                          icon="far fa-clipboard"
                                          @click="
                                            fetchAttachmentURL(
                                              val, 'projects'
                                            )
                                          "
                                        />
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-btn-dropdown>
                              </q-tabs>

                              <q-separator />

                              <q-tab-panels
                                animated
                                v-model="bodyContent.content.view"
                              >
                                <q-tab-panel name="edit">
                                  <div class="row" align="left">
                                    <strong>Markdown/HTML</strong>
                                    <hr class="col q-ml-sm">
                                  </div>

                                  <q-input
                                    filled
                                    class="q-mt-sm" label="Label"
                                    placeholder="Title"
                                    v-model="bodyContent.content.label"
                                    :autofocus="addedContent"
                                    @focus="
                                      addedContent = false; updated  = true
                                    "
                                  /><br />
                                    <!-- :rules="
                                      [val => !!val || 'Field is required']
                                    " -->

                                  <q-input
                                    filled autogrow
                                    class="q-mt-sm"
                                    label="Body/Text Description"
                                    placeholder="Please enter the body for the respective label."
                                    v-model="bodyContent.content.text"
                                    :rules="
                                      [val => !!val || 'Field is required']
                                    "
                                    @focus="updated = true"
                                  />
                                </q-tab-panel>

                                <q-tab-panel name="preview">
                                  <div
                                    v-if="bodyContent.content.label"
                                    class="text-h5 q-mt-sm"
                                  >
                                    {{ bodyContent.content.label }}
                                    <q-separator color="secondary" />
                                  </div>

                                  <p
                                    v-if="!bodyContent.content.text"
                                    class="q-mt-sm"
                                  >
                                    BODY TEXT IS REQUIRED!
                                  </p>

                                  <MarkdownTranslator
                                    v-else
                                    :storage="storage"
                                    :data="bodyContent.content.text"
                                  />
                                </q-tab-panel>
                              </q-tab-panels>
                            </q-card>
                          </div>

                          <!-- -------- Custom Type URL_LIST --------- -->
                          <div
                            v-else-if="
                              bodyContent.content.type === 'ORDERED_LIST' ||
                              bodyContent.content.type === 'UNORDERED_LIST'
                            "
                            class="col q-mb-xs q-pa-sm"
                          >
                            <q-card class="q-pa-md">
                              <div class="row" align="left">
                                <strong>URL List</strong>
                                <hr class="col q-ml-sm">
                              </div>

                              <q-input
                                filled
                                class="q-mt-sm"
                                label="Label" placeholder="Title"
                                v-model="bodyContent.content.label"
                                :autofocus="addedContent"
                                :rules="[val => !!val || 'Field is required']"
                                @focus="addedContent = false; updated = true"
                              />

                              <div class="row inline full-width q-pa-md">
                                <strong>List</strong>
                                <hr class="col q-ml-sm q-mr-sm">
                                <div>
                                  <q-btn
                                    dense round
                                    color="accent" icon="add"
                                    @click="bodyContent.content.list.push({index: bodyContent.content.list.length + 1}); updated = true"
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
                                      class="col-1" type="number"
                                      label="Index"
                                      v-model="link.index"
                                      :rules="[val => !!val]"
                                      @blur="link.index = link.index > 0 ? parseInt(link.index) : 1"
                                      @focus="updated = true"
                                    />

                                    <q-input
                                      dense filled
                                      class="col" label="URL Name"
                                      placeholder="Please enter the alias for the URL."
                                      v-model="link.item"
                                      :rules="[val => !!val || 'Field is required']"
                                      @focus="updated = true"
                                    />

                                    <q-input
                                      dense filled
                                      class="col" label="URL"
                                      placeholder="https://www.google.com"
                                      v-model="link.url"
                                      :rules="[val => true]"
                                      @focus="updated = true"
                                    />

                                    <div>
                                      <q-btn
                                        :disable="bodyContent.content.list.length === 1"
                                        dense flat round
                                        icon="delete"
                                        @click="bodyContent.content.list.splice(olIndex, 1); updated = true"
                                      />
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </q-card>
                          </div>

                          <!-- -------- Custom Type EVENT_LIST ---------- -->
                          <div
                            v-else
                            class="col q-mb-xs q-pa-sm"
                          >
                            <q-card class="q-pa-md">
                              <div class="row" align="left">
                                <strong>Event List</strong>
                                <hr class="col q-ml-sm">
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
                                <hr class="col q-ml-sm q-mr-sm">
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

                          <!-- ------- Custom Field Index & Delete ------- -->
                          <div
                            class="col-1" align="center"
                            style="margin: auto;"
                          >
                            <q-checkbox
                              dense
                              class="q-pa-sm q-mb-sm" label='Hide'
                              v-model="curData.webpage.body[ind].hidden"
                              @input="updated = true"
                            />

                            <q-input
                              dense filled
                              class="q-pa-xs q-mb-md"
                              label="Index" type="number"
                              v-model="curData.webpage.body[ind].index"
                              @blur="curData.webpage.body[ind].index = curData.webpage.body[ind].index < 1 ?  1 : parseInt(curData.webpage.body[ind].index)"
                              @focus="updated = true"
                            />

                            <q-btn
                              dense round
                              class="bottom" color="accent" icon="delete"
                              @click="curData.webpage.body.splice(ind, 1); updated = true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <br><br>

                  </div>

                  <!-- ------------------- Popup Dialog -------------------- -->
                  <div class="q-pa-md q-gutter-sm">
                    <q-dialog v-model="fixedDialog">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6">{{ dialogJSON.title }}</div>
                        </q-card-section>

                        <q-separator />

                        <q-card-section
                          v-if="dialogJSON.message" style="width: 50vh;"
                        >
                          <ul>
                            <li
                              v-for="(val, ind) in dialogJSON.message"
                              :key="ind"
                            >
                              {{ val }}
                            </li>
                          </ul>
                        </q-card-section>

                        <q-card-section v-else style="width: 50vh;">
                          <p>N/A</p>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions align="right" >
                          <q-btn flat label="Close" color="primary" v-close-popup />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>
                </div>

                <q-inner-loading :showing="!Boolean(mainImage.cur)">
                  <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
              </q-tab-panel>

              <!-- -------------------- Logs -------------------- -->
              <!-- This panel is hidden since the tab to select it is commented out. -->
              <q-tab-panel name="logs">
                <div
                  v-if="curData"
                  align="center"
                  class="tab-content shadow-2"
                >
                  <!-- -------------------- Preview Log -------------------- -->
                  <div v-if="childMode === 'preview'">
                    <div class="q-pa-sm">
                      Preview Log
                    </div>

                    <div
                      v-if="curData.logs"
                      class="q-pa-md q-gutter-sm"
                    >
                      <div
                        v-for="(val, ind) in curData.logs"
                        :key="ind"
                      >
                        <div
                          v-if="!val.hidden"
                          align="left"
                          class="shadow-2 q-pa-sm"
                          style="border-radius: 3px;"
                        >
                          <div class="cursor-pointer">
                            {{ val.title }}
                          </div>

                          <div
                            v-if="val.description"
                            class="cursor-pointer"
                          >
                            <pre>{{ val.description }}</pre>
                          </div>

                          <div
                            v-for="(childVal, childInd) in val.data"
                            :key="childInd"
                          >
                            <dir v-if="!childVal.hidden">
                              <div>
                                Title: {{ childVal.title }}
                              </div>
                              <div>
                                Date: {{ childVal.date }}
                              </div>
                              <div>
                                Description:
                                <hr>
                                <pre>{{ childVal.description }}</pre>
                                <hr>

                                <div align="right">
                                  <q-btn
                                    dense round flat
                                    color="accent" icon="reply"
                                    @click="replyLog(ind, childVal)"
                                  />
                                </div>
                              </div>
                            </dir>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <!-- -------------------- Edit Log -------------------- -->
                  <div v-else-if="childMode === 'edit'">

                    <!-- ----------------- Main Add Button ----------------- -->
                    <div class="q-pa-sm">
                      <q-btn
                        round
                        icon="add" color="accent"
                        @click="createLogThread"
                      />
                    </div>

                    <!-- -------------------- Log Family ------------------- -->
                    <div
                      v-if="curData.logs"
                      class="q-pa-md q-gutter-sm"
                    >
                      <div
                        v-for="(val, ind) in curData.logs"
                        :key="ind"
                        align="left"
                        class="shadow-2 q-pa-sm"
                        style="border-radius: 3px;"
                      >
                        <div class="row">
                          <div class="col">
                            <div class="cursor-pointer q-pa-xs">
                              Title: {{ val.title }}
                              <q-popup-edit
                                buttons
                                v-model="val.title"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense filled autofocus
                                  v-model="val.title"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs">
                              Description:
                              <pre>{{ val.description }}</pre>
                              <q-popup-edit
                                buttons
                                v-model="val.description"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense filled autofocus
                                  v-model="val.description"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs q-mt-xs">
                              Index: {{ val.index }}
                              <q-popup-edit
                                buttons
                                v-model="val.index"
                                @hide="updateAtHide(['index', ind, val.index])"
                              >
                                <q-input
                                  dense filled autofocus
                                  type="number"
                                  v-model="val.index"
                                />
                              </q-popup-edit>
                            </div>

                            <div>
                              <q-checkbox
                                left-label
                                label="Hidden:"
                                v-model="val.hidden"
                                @input="updateAtHide"
                              />
                            </div>
                          </div>

                          <div align="right" class="col">
                            <q-btn
                              round flat
                              icon="delete"
                              @click="deleteLogThread(ind)"
                            />
                          </div>
                        </div>

                        <div class="q-mb-md">
                          <q-btn
                            round
                            color="accent" icon="add"
                            @click="addLog(ind)"
                          />
                        </div>

                        <!-- ------------------ Log Data ------------------ -->
                        <div v-if="val.data">
                          <div
                            v-for="(dataVal, dataInd) in val.data"
                            :key="dataInd"
                            class="shadow-2 q-pa-sm q-mb-sm"
                            style="border-radius: 3px;"
                          >
                            <div class="cursor-pointer q-pa-xs">
                              Title: {{ dataVal.title }}
                              <q-popup-edit
                                buttons
                                v-model="dataVal.title"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense filled autofocus
                                  v-model="dataVal.title"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs q-mt-xs">
                              Date: {{ dataVal.date }}
                              <q-popup-edit
                                buttons
                                v-model="dataVal.date"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense filled autofocus
                                  v-model="dataVal.date"
                                />
                              </q-popup-edit>
                            </div>

                            <div class="cursor-pointer q-pa-xs q-mt-xs">
                              Description: <br>
                              <pre>{{ dataVal.description }}</pre>

                              <q-popup-edit
                                buttons
                                v-model="dataVal.description"
                                @hide="updateAtHide"
                              >
                                <q-input
                                  dense
                                  filled
                                  autofocus
                                  autogrow
                                  v-model="dataVal.description"
                                />
                              </q-popup-edit>
                            </div>

                            <div>
                              <q-checkbox
                                label="Hidden:"
                                left-label
                                v-model="dataVal.hidden"
                                @input="updateAtHide"
                              />
                            </div>

                            <div align="right" class="q-gutter-sm" >
                              <q-btn
                                dense round flat
                                color="accent" icon="delete"
                                @click="deleteLog(dataInd, ind)"
                              />
                              <q-btn
                                dense round flat
                                color="accent" icon="reply"
                                @click="replyLog(ind, dataVal)"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

              </q-tab-panel>

              <!-- -------------------- Attachments -------------------- -->
              <q-tab-panel name="attachments">
                <div class="tab-content shadow-2 q-pa-md">
                  <div
                    v-if="childMode === 'preview'"
                    class="text-h5 q-mb-md"
                  >
                    Preview Attachments...
                    <q-separator color="secondary" />
                  </div>

                  <div
                    v-else-if="childMode === 'edit'"
                    class="text-h5 q-mb-md"
                  >
                    Edit Attachments...
                    <q-separator color="secondary" />
                  </div>

                  <li
                    v-for="(val, key, ind) in curData.files"
                    :key="ind"
                    class="row q-ma-sm"
                  >
                    <div class="col">
                      {{ key }}
                    </div>

                    <q-space></q-space>

                    <div class="col q-gutter-sm" align="right">
                      <q-btn
                        v-if="
                          val.toLowerCase().includes('.jpg') ||
                          val.toLowerCase().includes('.jpeg') ||
                          val.toLowerCase().includes('.png') ||
                          val.toLowerCase().includes('.pdf')
                        "
                        round dense flat
                        icon="image_search"
                        @click="fetchAttachmentURLAndOpen(val, 'projects')"
                      />

                      <q-btn
                        round dense flat
                        icon="get_app"
                        @click="downloadAttachment(key, val, 'projects')"
                      />

                      <q-btn
                        v-if="childMode === 'edit'"
                        round dense flat
                        icon="delete"
                        @click="deleteAttachment(key, val, 'projects')"
                      />
                    </div>
                  </li>
                </div>
              </q-tab-panel>

              <!-- -------------------- Form Response -------------------- -->
              <q-tab-panel name="formResponse">
                <div class="tab-content shadow-2 q-py-lg column items-center">
                  <project-review-form
                    id="project-review-form"
                    class="col"
                    :projectName="curData.project"
                    :projectDescription="curData.description"
                    :projectMembers="curData.members"
                    :keywordOptions="keywordOptions"
                    :projectKeywords="curData.keywords"
                    :customFormResponse="curData.customFormResponse"
                    :customFormEnabled="true"
                  />
                  <!-- Export custom form as markdown -->
                  <div
                    v-if="hasCustomFormResponse"
                    class="col"
                  >
                    <q-btn no-caps
                      class="q-ma-sm"
                      label="Copy additional questions"
                      color="accent"
                      @click="exportCustomFormResponse"
                    />
                    <!-- Delete custom form response if present. -->
                    <q-btn no-caps
                      class="q-my-sm"
                      label="Delete additional questions"
                      color="secondary"
                      @click="deleteCustomFormResponse"
                    />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>

        <!-- -------------------- Buttons -------------------- -->
        <q-page-sticky
          position="top-right"
          :offset="[30, 18]"
        >
          <q-btn
            round
            size="sm" class="q-mr-xs" color="accent" icon="attach_file"
            @click="fileAttachmentDialog.visible = true"
          >
            <q-tooltip
              content-class="bg-indigo" :offset="[10, 10]"
            >
              Attach Files
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            size="sm" class="q-mr-xs" color="accent"
            icon="settings"
            @click="popupAdvancedSettingsDialog"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]" >
              Settings
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            size="sm" color="accent" type="submit"
            :icon="(childMode === 'edit') ? 'search' : 'edit'"
            @click="submitMode = 'view'"
          >
            <q-tooltip
              v-if="childMode === 'edit'"
              content-class="bg-indigo"
            >
              Preview Mode
            </q-tooltip>

            <q-tooltip
              v-else
              content-class="bg-indigo"
            >
              Edit Mode
            </q-tooltip>
          </q-btn>

          <q-btn
            :disabled="!updated"
            round
            size="sm" class="q-ml-xs" icon="done" type="submit"
            :color="updated ? 'secondary' : 'accent'"
            @click="submitMode = 'database'"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Submit
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            size="sm" class="q-ml-xs" color="accent" icon="clear"
            @click="emitClose"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Close
            </q-tooltip>
          </q-btn>
        </q-page-sticky>
      </q-form>

      <!-- -------------------- Advanced Settings -------------------- -->
      <q-dialog
        persistent
        v-model="advancedDialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 55%; min-width: 300px;">
          <!-- -------------- Advanced Settings Title ----------------- -->
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">Advanced Settings</div>
          </q-card-section>

          <q-card-section class="q-mt-md q-pa-md">
            <!-- ----------- Advanced Settings Hide Project ---------------- -->
            <div>
              <div class="row q-pa-sm q-mb-sm">
                <strong>Hide Project:</strong>
                <q-space />
                <q-checkbox
                  dense
                  style="padding-right: 2px;"
                  v-model="curData.hidden"
                />
              </div>
            </div>
            <q-separator color="secondary" />

            <!-- ------------ Advanced Settings URL Alias ---------------- -->
            <div>
              <strong
                class="q-mt-sm"
                style="font-size: 18px;"
              >
                URL:
              </strong>

              <div class="q-pa-sm q-mb-sm">
                <div class="row">
                  <strong>UID:</strong>
                  <q-space />
                  <div class="q-mr-sm">
                    {{ curData.uuid }}
                  </div>
                </div>

                <div class="row">
                  <strong class="col">Alias:</strong>
                  <div
                    class="col-9 cursor-pointer"
                    align="right"
                    style="
                      border: solid 1px;
                      border-radius: 10px;
                      overflow: hidden;
                    "
                  >
                    <div
                      v-if="aliasVals.includes(curData.uuid)"
                      class="q-mr-sm"
                      style="height: 100%;"
                    >
                      {{ aliasKeys[aliasVals.indexOf(curData.uuid)] }}
                      <q-popup-edit
                        buttons
                        v-model="aliasKeys[aliasVals.indexOf(curData.uuid)]"
                        :validate="aliasValidation"
                        @hide="aliasEditObj.error = false"
                      >
                        <q-input
                          dense autofocus hide-bottom-space
                          v-model="aliasKeys[aliasVals.indexOf(curData.uuid)]"
                          :error="aliasEditObj.error"
                          :error-message="aliasEditObj.message"
                        />
                      </q-popup-edit>
                    </div>
                    <div
                      v-else
                      class="q-mr-sm"
                      @click="addToAliasKeys"
                    >
                      {{ curData.uuid }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <q-separator color="secondary" />
          </q-card-section>

          <q-card-actions
            align="right"
            class="text-teal"
          >
            <q-btn
              v-close-popup
              flat no-caps
              label="Cancel"
              @click="advancedSettingsCancel"
            />

            <q-btn
              v-close-popup
              flat
              label="Set"
              no-caps
              @click="advancedSettingSet"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- -------------------- File Attachments -------------------- -->
      <q-dialog
        persistent
        v-model="fileAttachmentDialog.visible"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 55%; min-width: 300px;">
          <!-- Advanced Settings Title -->
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">File Uploader</div>
          </q-card-section>

          <q-card-section class="q-mt-md q-pa-md">
            <div>
              <UploadGUI
                :uid="curData.uuid"
                :type="'projects'"
                @close="updateAttachments"
                @leave="leaveAttachments"
              />
            </div>
          </q-card-section>

          <!-- <q-card-actions class="text-teal" align="right" >
            <q-btn
              v-close-popup flat no-caps
              label="Exit"
            />
          </q-card-actions> -->
        </q-card>
      </q-dialog>

      <!-- -------------------- AddMembers -------------------- -->
      <q-dialog
        persistent
        v-model="addMemberDialog.visible"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 55%; min-width: 300px;">
          <!-- Advanced Settings Title -->
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">Add Member</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-btn
              round
              icon="add" color="accent"
              class="q-mb-sm"
              @click="
                addMemberDialog.edited = true;
                createUserDialog.visible = true;
              "
            />

            <div
              v-if="addMemberDialog.options"
              style="min-height: 30vh;"
            >
              <q-select
                filled use-input hide-selected
                multiple options-selected-class="text-red"
                label="Add Menu for Members"
                input-debounce="0"
                :options="addMemberDialog.filter"
                v-model="addMemberDialog.use"
                @filter="filterFn"
                @input="addMemberDialog.edited = true"
              />

              <!-- ---------- Member Display ---------- -->
              <div>
                <div class="q-mt-sm">
                  <b>Current Members</b>
                  <q-separator color="secondary" />
                </div>

                <div v-if="addMemberDialog.use.length">
                  <!-- {{ addMemberDialog.use }} -->
                  <ul>
                    <li
                      v-for="(v, k, useI) in addMemberDialog.use"
                      :key="useI"
                    >
                      {{ v.name || v.value.name }}:
                      {{ v.email || v.value.email }}
                    </li>
                  </ul>
                </div>

                <div v-else>
                  Please add new members...
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" >
            <q-btn
              :disabled="!addMemberDialog.edited"
              v-close-popup no-caps
              :color="
                addMemberDialog.edited ? 'secondary' : 'accent'
              "
              label="Submit"
              @click="submitAddMembers"
            />

            <q-btn
              v-close-popup no-caps outline
              label="Exit" color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- -------------------- Create Users -------------------- -->
      <q-dialog
        persistent maximized
        transition-show="slide-up" transition-hide="slide-down"
        v-model="createUserDialog.visible"
      >
        <q-card>
          <q-card-section >
            <AddUser
              @added="updateUsers"
              @close="createUserDialog.visible = false"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-layout>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { cloneDeep, isEmpty } from 'lodash'
import Vue from 'vue'

import productionDb, { productionStorage } from '../../firebase/init_production'
import testingDb, { testingStorage } from '../../firebase/init_testing'

import UploadGUI from '../../components/Upload.vue'
import ProgressBar from '../../components/ProgressBar.vue'
import AddUser from '../../components/SubmitUserAdminConsole.vue'
import PopupInputLimitLen from '../../components/Popups/PopupInputLimitLen.vue'
import MarkdownTranslator from '../../components/MarkdownTranslator.vue'
import ProjectReviewForm from '../../components/Forms/Project/ProjectReviewForm.vue'
import EditCustomChips from './Shared/EditCustomChips.vue'

export default {
  components: {
    UploadGUI,
    ProgressBar,
    AddUser,
    MarkdownTranslator,
    PopupInputLimitLen,
    ProjectReviewForm,
    EditCustomChips
  },
  props: {
    uuid: String,
    mode: {
      type: String,
      default: 'edit'
    }
  },
  async created () {
    try {
      // fetch data from database
      await this.loadFireRefs()
      await this.loadInformation()
      await this.loadConfig()

      this.loadProgressBarConf()
    } catch (error) {
      throw error
    }
  },
  beforeUpdate () {
    this.loadProgressBarConf()
  },
  computed: {
    /**
     * Whether or not the export custom form button should be disabled.
     * Note: isEmpty also returns true for 'undefined'.
     * @returns <BooleanThe>: BooleanThe flag for disabling.
     */
    isExportCustomFormBtnDisabled () {
      return isEmpty(this.curData) || isEmpty(this.curData.customFormResponse)
    },
    /** Whether this project has custom form questions. */
    hasCustomFormResponse () {
      return this.curData.customFormResponse && this.curData.customFormResponse.length > 0
    }
  },
  data () {
    return {
      db: null, // <Object>: firebase object referencing the database
      storage: null, // <Object>: firebase object referencing the storage
      userEmailToObjMap: {}, // <Map>: dictionary of email to user's data
      aliasMap: {}, // <Map>: dictionary of alias to uid
      aliasKeys: [], // <Array<String>>: list of alias
      aliasVals: [], // <Array<String>>: list of uid
      aliasEditObj: { // <Object>: error object for edit for alias
        error: false, // <Boolean>: error flag
        message: '' // <String>: error message
      },
      advancedDialog: false, // <Boolean>: flag to pop-up advanced dialog
      oldAdvancedSettings: {}, // <Object>: old settings to reasign on cancel
      fileAttachmentDialog: {
        visible: false // <Boolean>: flag to pop-up file upload
      },
      addMemberDialog: { // <Object>: add member dialog information
        visible: false, // <Boolean>: hide or show dialog
        edited: false, // <Boolean>: flag for update inside member dialog
        options: [], // <Array<Object>>: list of members from ToC
        filter: [], // <Array<Object>>: list of members after filter
        use: [] // <Array<Object>>: list of members who are chosen
      },
      createUserDialog: { // <Object>: dialog record for create user
        visible: false // <Boolean>: hide or show dialog
      },
      configData: {}, // <Object>: object storing configs of the application
      chipType: '', // <String>: type of the chip that the admin is inserting
      bodyType: '', // <String>: type of the body that the admin is inserting
      // keywordOptions <Array<Object>>: { value,label } object to
      //                                  fit q-option
      keywordOptions: [],
      addedChip: false, // <Boolean>: flag for added chip
      addedContent: false, // <Boolean>: flag for added content
      childMode: '', // <String>: keep tracks of view mode ['Edit', 'Preview']
      // submitMode <String>: keep track of submit mode
      //                      ['Edit', 'Preview', 'DB']
      submitMode: '',
      mainImage: { // <Object>: record of main image
        color: 'black', // <String>: background color of main image
        prev: '', // <String>: url of the previous image
        cur: '', // <String>: blob url of the current file
        file: '' // <File>: file data of the current file
      },
      updated: false, // <Boolean>: flag for updated
      fixedDialog: false, // <Boolean>: flag for dialog
      dialogJSON: { // <Object>: information for dialog
        title: '', // <String>: title of the dialog message
        message: '' // <String>: message of the dialog message
      },
      loading: false, // <Boolean>: flag for loading
      data: {}, // <Object>: static data of the component from db
      curData: {}, // <Object>: mutable copy of data
      pageTab: 'main', // <String>: tab value
      splitterModel: 15, // <Integer>: % of width the splitter will occupy
      progressBar: { // <Object>: default object of the progress bar
        // tags <Array<String>>: list of default values for the progress bar
        tags: ['Idea', 'PoC', 'Value'],
        half: true // <Boolean>: flag for half step
      }
    }
  },

  methods: {
    /**
     * Prompt a confirmation dialog on delete.
     * @param {String} key: alias of the file.
     * @param {String} pathToFile: path of file inside storage.
     * @param {String} type: name of the collection
     */
    deleteAttachment: async function (key, pathToFile, type) {
      this.$q.dialog({
        title: 'Confirmation to Delete',
        message: `Delete ${key}?`,
        ok: true,
        cancel: true
      }).onOk(async () => {
        this.loading = true

        await this.storage.ref().child(
          `${type}/${pathToFile}`
        ).delete()

        delete this.curData.files[key]

        await this.submitToDatabase()

        this.loading = false

        this.$forceUpdate()
      })
    },
    /**
     * fetches the download url then download the file for the client
     * params:
     * @param {String} alias: shown filename on the web
     * @param {String} pathToFile: file path on the cloud storage
     * @param {String} type: type of the collection inside storage
     * @return {Promise<Boolean>}
     */
    downloadAttachment: async function (alias, pathToFile, type) {
      try {
        let url = await this.storage.ref().child(
          `${type}/${pathToFile}`
        ).getDownloadURL()

        let res = await fetch(url)
        let blob = await res.blob()

        let extension = pathToFile.split('.').pop()

        let a = document.createElement('a')
        a.style = 'display: none'

        let bUrl = URL.createObjectURL(blob)
        a.href = bUrl
        a.download = `${alias}.${extension}`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(bUrl)
        document.body.appendChild(a)
      } catch (error) {
        this.$q.notify({
          message: 'File is either broken or missing!',
          timeout: 2000,
          color: 'negative',
          textColor: 'white',
          icon: 'warning',
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })

        throw error
      }
    },
    /**
     * fetches the attachment url and open the url on a new tab
     * @param {String} pathToFile: path to file
     * @param {String} type: collection type
     */
    fetchAttachmentURLAndOpen: async function (pathToFile, type) {
      try {
        let url = await this.storage.ref().child(
          `${type}/${pathToFile}`
        ).getDownloadURL()

        window.open(url, '_blank', 'noopener')
      } catch (error) {
        this.$q.notify({
          message: 'File is either broken or missing!',
          timeout: 2000,
          color: 'negative',
          textColor: 'white',
          icon: 'warning',
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        throw error
      }
    },
    /**
     * helper function to update users in add user dialog
     * @param {Object} newUser: user record to be added to the project
     */
    updateUsers: function (newUser) {
      this.userEmailToObjMap[newUser.email] = newUser
      newUser.role = 'member'
      this.addMemberDialog.use.push(newUser)
    },
    /**
     * Sets the project name to the input value.
     * @param {String} editedName The inputted name.
     */
    saveEditedName (editedName) {
      this.updated = true
      this.curData.project = editedName
    },
    /**
     * helper function to add members to the project
     */
    submitAddMembers: function () {
      let members = []
      this.addMemberDialog.use.forEach(member => {
        members.push(member.value || member)
      })

      this.curData.members = members
      this.updated = true
    },
    /**
     * modified version of source code from quasr.dev
     * helper function for filtering q-select
     * @param {String} val: value to filter for
     * @param {Function} update: callback function to be modified
     */
    filterFn: function (val, update) {
      update(() => {
        if (val === '') {
          this.addMemberDialog.filter = this.addMemberDialog.options
        } else {
          const needle = val.toLowerCase()

          this.addMemberDialog.filter = this.addMemberDialog.options.filter(
            v => v.label.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    /**
     * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
     * fallback url copy to clipboard if not hosted on https
     * @param {String} entry: url to be copied back to clipboard
     */
    fallbackCopyTextToClipboard: function (entry) {
      let textArea = document.createElement('textarea')
      textArea.value = entry
      document.body.prepend(textArea)
      // textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (error) {
      }

      document.body.removeChild(textArea)
    },
    /**
     * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
     * logic handler to call either fallback or built-in
     * @param {String} entry: current url
     */
    copyTextToClipboard: function (entry) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(entry)
      } else {
        navigator.clipboard.writeText(entry)
      }
    },
    /**
     * fetches the attachment url and copy the url to nav.clipboard
     * @param  {String} pathToFile: path to file
     * @param {String} type: collection type
     */
    fetchAttachmentURL: function (pathToFile, type) {
      let url = `local://${type}/${pathToFile}`

      this.copyTextToClipboard(url)

      this.$q.notify({
        message: 'The file path has been copied to the clipboard.',
        timeout: 2000,
        type: 'positive',
        actions: [
          {
            icon: 'close',
            color: 'white',
            round: true
          }
        ]
      })
    },
    /**
     * loading the progress bar configuration from the session storage
     */
    loadProgressBarConf: function () {
      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

        if (cachedConfig.projectsConfig.progressBar) {
          this.progressBar = cachedConfig.projectsConfig.progressBar
        }
      }
    },
    /**
     * helper function to handle file attachment and its alias
     * @param {Object} data: record containing files
     */
    updateAttachments: function (data) {
      let aliasName = ''

      for (let file in data) {
        aliasName = data[file].key

        if (!(aliasName in this.curData.files)) {
          this.curData.files[aliasName] = data[file].val
        } else {
          this.curData.files[file] = data[file].val
        }
      }

      this.fileAttachmentDialog.visible = false
      this.$forceUpdate()
    },
    /**
     * helper function leave attachments dialog
     */
    leaveAttachments: function () {
      this.fileAttachmentDialog.visible = false
    },
    /**
     * helper function to close attachment dialog
     */
    updateAtHide: function (entry) {
      if (entry) {
        if (entry[0] === 'index') {
          this.curData.logs[entry[1]].index = parseInt(entry[2])
        }
      }

      this.updated = true

      this.$forceUpdate()
    },
    /**
     * helper function to click on the hidden file picker
     */
    invokeFilePicker: function () {
      this.$refs.imageInput.click()
    },
    /**
     * changes file references on file change
     * @param {Event} e: event handler of the event
     */
    filePickerOnChange: function (e) {
      const file = e.target.files[0]

      if (file) {
        this.mainImage.cur = URL.createObjectURL(file)
        this.mainImage.file = file
        this.updated = true
      } else {
        this.mainImage.cur = this.mainImage.prev
        this.mainImage.file = ''
        // this.updated = false // removed for persistance
      }
    },
    /**
     * submit handler of the component; put images and files into storage;
     * update project's data to ToC as well as webpage; emit 'added' event
     */
    onSubmit: function () {
      // edit, preview, and submit handler
      if (this.submitMode === 'view') {
        this.childMode = (this.childMode === 'preview') ? 'edit' : 'preview'
        this.curSortBody()
        this.curSortChip()
      } else if (this.submitMode === 'database') {
        this.loading = true

        // pushing data to database
        return this.submitToDatabase()
      }
    },
    /**
     * submit handler for data submit to database
     * @return {Promise<Boolean>}
     */
    submitToDatabase: async function () {
      if (this.curData.keywords.length > 1) {
        let tbdIndex = this.curData.keywords.indexOf('tbd')

        if (tbdIndex > -1) {
          this.curData.keywords.splice(tbdIndex, 1)
        }
      } else {
        if (this.curData.keywords.length === 0) {
          this.curData.keywords.push('tbd')
        }
      }

      let timeOfUpdate = new Date(Date.now()).toISOString()

      let tmpMembers = []
      this.curData.members.forEach(member => {
        tmpMembers.push({
          uuid: member.uuid || member.email,
          role: member.role
        })
      })

      let tocContent = {
        project: this.curData.project,
        description: this.curData.description,
        members: tmpMembers,
        keywords: this.curData.keywords,
        progress: this.curData.progress,
        created: this.curData.created || this.curData.timestamp,
        timestamp: timeOfUpdate
      }

      await this.db.collection('projects').doc('ToC').set({
        [this.curData.uuid]: tocContent
      }, { merge: true })

      if (this.mainImage.file) {
        this.curData.webpage.imgURL = `projects/${this.curData.uuid}`
        this.curData.webpage.imgURL += `/main/${this.mainImage.file.name}`

        // update the file to storage
        await this.storage.ref().child(
          this.curData.webpage.imgURL
        ).put(this.mainImage.file)
      }
      // adding color for main image
      this.curData.webpage.imgBgColor = this.mainImage.color

      await this.db.collection('projects').doc(this.curData.uuid).set({
        customFormResponse: this.curData.customFormResponse,
        webpage: this.curData.webpage,
        logs: this.curData.logs,
        files: this.curData.files
      })

      if (this.submitMode === 'database') {
        this.emitClose()
      }

      this.$q.notify({
        type: 'positive',
        message: 'Successful!',
        timeout: 2000
      })
    },
    /**
     * load firebase database reference
     * load firebase storage reference (if applicable)
     * load firebase cloud functions reference (if applicable)
     */
    loadFireRefs: async function () {
      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')

        if (sessionDb === 'testing') {
          this.db = testingDb
          this.storage = testingStorage
        } else {
          this.db = productionDb
          this.storage = productionStorage
        }
      } else {
        try {
          let doc = await productionDb.collection('config').doc('project').get()

          if (doc.exists) {
            if (doc.data().db === 'testing') {
              this.db = testingDb
              this.$q.localStorage.set('boundless_db', 'testing')
            } else {
              this.db = productionDb
              this.$q.localStorage.set('boundless_db', 'production')
            }
          } else {
            let msg = '"/config/project" path does not exists!'

            throw new Error(msg)
          }
        } catch (error) {
          this.db = productionDb
          this.$q.localStorage.set('boundless_db', 'production')

          throw error
        }
      }
    },
    /**
     * TODO: load from cache
     * load config for the component
     * @return {Promise<Boolean>}
     */
    loadConfig: async function () {
      let doc = await this.db.collection('config').doc('project').get()

      if (doc.exists) {
        let data = doc.data()

        for (let key in data['keywords']) {
          this.keywordOptions.push({
            label: key,
            value: data['keywords'][key]
          })
        }

        this.configData = cloneDeep(data)

        this.configData.customChips = this.configData.customChips || []

        // TODO: write this to the db
        if (
          !JSON.stringify(
            this.configData.bodyContentType
          ).includes('MARKDOWN')
        ) {
          this.configData.bodyContentType.unshift({
            label: 'Markdown/HTML', value: 'MARKDOWN'
          })
        }

        // TODO: update on the db to avoid this
        let tmpBodyContentType = []
        this.configData.bodyContentType.forEach(type => {
          if (
            type.value !== 'UNORDERED_LIST' &&
            type.value !== 'EVENT_LIST' &&
            type.value !== 'TEXT_BOX'
          ) {
            if (type.value !== 'ORDERED_LIST') {
              tmpBodyContentType.push(type)
            } else {
              tmpBodyContentType.push({
                label: 'URL List',
                value: 'ORDERED_LIST'
              })
            }
          }
        })
        this.configData.bodyContentType = tmpBodyContentType

        // 'None' to be highlighted as chip gets created
        this.configData.customChips.push({
          label: 'None',
          value: null
        })
        // this.allowedDomain = data['allowedDomain'] // TODO
      }
    },
    /**
     * load required information from the database
     */
    loadInformation: async function () {
      this.loading = true

      let promises = []
      promises.push(this.db.collection('projects').doc(this.uuid).get())
      promises.push(this.db.collection('projects').doc('ToC').get())
      promises.push(this.db.collection('users').doc('ToC').get())

      let res = await Promise.all(promises)

      for (let objField in res[0].data()) {
        this.data[objField] = res[0].data()[objField]
      }

      for (let objField in res[1].data()[this.uuid]) {
        this.data[objField] = res[1].data()[this.uuid][objField]
      }

      for (let objField in res[2].data()) {
        let tmpRef = res[2].data()[objField]

        this.userEmailToObjMap[tmpRef.email] = tmpRef
      }

      this.sortBody()
      this.sortChip()
      this.curData = cloneDeep(this.data)
      this.curData.customFormResponse = this.curData.customFormResponse || []
      this.curData.logs = this.curData.logs || []
      this.curData.files = this.curData.files || {}
      this.childMode = this.mode
      this.data = {} // to save memory

      // seamless fix to from old members data to new member data
      let tmpMembers = []

      if (this.curData.members[0].email) {
        let newMembersDataType = []
        this.curData.members.forEach(member => {
          newMembersDataType.push({
            uuid: member.email,
            role: member.role
          })
          tmpMembers.push({
            ...res[2].data()[member.email],
            role: member.role
          })
        })

        // this.db.collection('projects').doc('ToC').set({
        //   [this.curData.uuid]: {
        //     members: newMembersDataType
        //   }
        // }, { merge: true })
      } else {
        this.curData.members.forEach(member => {
          tmpMembers.push({
            ...res[2].data()[member.uuid],
            role: member.role
          })
        })
      }
      this.curData.members = tmpMembers

      // loading imgURL
      if (!this.curData.webpage.imgURL) {
        this.mainImage.cur = this.getMainPhoto()
        this.mainImage.prev = this.mainImage.cur
      } else {
        try {
          // get photo from storage
          let url = await this.storage.ref().child(
            this.curData.webpage.imgURL
          ).getDownloadURL()

          this.mainImage.cur = url
          this.mainImage.prev = url
        } catch (error) {
          this.mainImage.cur = this.getMainPhoto()
          this.mainImage.prev = this.mainImage.cur
        }
      }

      if (this.curData.webpage.imgBgColor) {
        this.mainImage.color = this.curData.webpage.imgBgColor
      }

      this.aliasMap = res[1].data().alias || {}
      this.aliasKeys = Object.keys(this.aliasMap)
      this.aliasVals = Object.values(this.aliasMap)

      setTimeout(() => {
        this.loading = false
      }, 100)
    },
    /**
     * helper function to popup advanced settings dialog
     */
    popupAdvancedSettingsDialog: function () {
      this.advancedDialog = true
      this.oldAdvancedSettings.hidden = this.curData.hidden
    },
    /**
     * helper function for advanced setting canceler
     */
    advancedSettingsCancel: function () {
      this.aliasKeys = Object.keys(this.aliasMap)
      this.aliasVals = Object.values(this.aliasMap)
      this.curData.hidden = this.oldAdvancedSettings.hidden
      this.oldAdvancedSettings = {}
    },
    /**
     * helper function for advance setting setter
     */
    advancedSettingSet: async function () {
      let alias = ''
      let oldAlias = this.curData.alias

      if (this.aliasVals.includes(this.curData.uuid)) {
        alias = this.aliasKeys[this.aliasVals.indexOf(this.curData.uuid)]
        this.curData.alias = alias
      }

      let tmpAliasMap = {}
      if (this.aliasKeys.length > 0) {
        tmpAliasMap = Object.assign(...this.aliasKeys.map((k, i) => ({ [k]: this.aliasVals[i] })))
      }

      if (typeof oldAlias !== 'undefined') {
        if (oldAlias !== '') {
          tmpAliasMap[oldAlias] = firebase.firestore.FieldValue.delete()
        }
      }

      let tmpTocContent = {
        hidden: this.curData.hidden || false,
        alias: alias
      }

      this.loading = true

      await this.db.collection('projects').doc('ToC').set({
        [this.curData.uuid]: tmpTocContent,
        alias: tmpAliasMap
      }, { merge: true })

      this.$q.notify({
        type: 'positive',
        message: 'Submitted successfully!',
        timeout: 2000
      })

      this.emitAdded()

      this.loading = false
    },
    /**
     * covert title as default alias
     */
    addToAliasKeys: function () {
      let initName = this.curData.project.split(' ').join('_').toLowerCase()
      this.aliasKeys.push(initName)
      this.aliasVals.push(this.curData.uuid)
    },
    /**
     * helper function to validate if alias can be added
     */
    aliasValidation: function (val) {
      if (val === '') {
        this.aliasEditObj.error = true
        this.aliasEditObj.message = 'Cannot be empty!'
        return false
      } else if (val.includes('.')) {
        this.aliasEditObj.error = true
        this.aliasEditObj.message = 'Please replace "." with either "-" or "_"!'
        return false
      } else if (this.aliasKeys.includes(val)) {
        let count = -1
        for (let i = 0; i < this.aliasKeys.length; i++) {
          if (this.aliasKeys[i] === val) {
            count = count + 1
            if (count > 0) {
              this.aliasEditObj.error = true
              this.aliasEditObj.message = 'Alias already exist!'
              return false
            }
          }
        }
      } else if (this.aliasVals.includes(val)) {
        this.aliasEditObj.error = true
        this.aliasEditObj.message = 'Alias cannot be UID!'
        return false
      }
      this.aliasEditObj.error = false
      this.aliasEditObj.message = ''
      return true
    },
    /**
     * TODO:
     * delete the log thread
     */
    deleteLogThread: function (index) {
      this.curData.logs.splice(index, 1)

      this.updated = true

      this.$forceUpdate()
    },
    /**
     * TODO:
     * create the log thread
     */
    createLogThread: function () {
      this.$q.dialog({
        dark: true,
        title: 'Description...',
        message: 'Please enter description for the thread.',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let newLogThread = {
            title: 'New Log Family 0!',
            description: data,
            data: [],
            index: 0,
            hidden: false
          }

          if (this.curData.logs) {
            let size = this.curData.logs.length
            newLogThread['title'] = `New Log Family ${size}!`

            this.curData.logs.push(newLogThread)
          } else {
            this.curData.logs = [newLogThread]
          }

          this.updated = true

          this.$forceUpdate()
        } else {
          this.$q.notify({
            message: 'Not a valid input!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      })
    },
    /**
     * helper function to add log inside a thread
     */
    addLog: function (index) {
      this.$q.dialog({
        dark: true,
        title: 'Description...',
        message: 'Please enter description for the log.',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let tmpLog = {
            title: '',
            date: Date(),
            description: data,
            hidden: false
          }

          if (this.curData.logs[index].data) {
            tmpLog.title = `Child Thread ${this.curData.logs[index].data.length}!`
            this.curData.logs[index].data.push(tmpLog)
          } else {
            tmpLog.title = 'Child Thread 0!'
            this.curData.logs[index].data = [tmpLog]
          }

          this.updated = true
          // can be removed when the datamodel from database is updated
          this.$forceUpdate()
        } else {
          this.$q.notify({
            message: 'Not a valid input!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      })
    },
    /**
     * helper function to delete log from the thread
     * @param {Number} index: index of the log to be remove
     * @param {String} parent: name of the thread
     */
    deleteLog: function (index, parent) {
      this.curData.logs[parent].data.splice(index, 1)

      this.updated = true

      this.$forceUpdate()
    },
    /**
     * helper function to reply to a log
     * @param {Integer} familyIndex: index of the log to be replied to
     * @param {Object} responseObj: record of the response
     */
    replyLog: function (familyIndex, responseObj) {
      this.$q.dialog({
        dark: true,
        title: 'Response...',
        message: '<strong>Please enter your response.</strong><br><br><p class="text-red">Note: Your response cannot be empty!</p>',
        html: true,
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let tmpLog = {
            title: `In response to: "${responseObj.title}"!`,
            date: Date(),
            description: `>>>>>>>>>>\n${responseObj.description}\n>>>>>>>>>>\n${data}`,
            hidden: false
          }

          // let size = this.curData.logs[familyIndex].data.length

          this.curData.logs[familyIndex].data.push(tmpLog)
          // let size = this.curData.logs[index].data.length
          this.updated = true

          this.$forceUpdate()
        } else {
          this.$q.notify({
            message: 'Not a valid response!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      })
    },
    /**
     * helper function to validate the name of the project
     * @return {Boolean}
     */
    projectNameValidation: function () {
      if (this.$v.curData.project.maxLength && this.$v.curData.project.required) {
        return true
      }
      return false
    },
    /**
     * allow the user to add custom content on the body section
     * which will be displayed on their individual webpage
     */
    addCustomField: function () {
      let tmpBody = {}

      if (this.bodyType.value === 'TEXT_BOX') {
        tmpBody = {
          index: this.curData.webpage.body.length + 1,
          content: {
            type: this.bodyType.value
          }
        }
      } else if (this.bodyType.value === 'MARKDOWN') {
        tmpBody = {
          index: this.curData.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            view: 'edit'
          }
        }
      } else if (this.bodyType.value === 'ORDERED_LIST') {
        tmpBody = {
          index: this.curData.webpage.body.length + 1,
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
          index: this.curData.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {}
            ]
          }
        }
      }
      tmpBody['hidden'] = false
      this.curData.webpage.body.push(tmpBody)
      this.updated = true
    },
    /**
     * allow the user to add custom chip for the chips section
     * which will be displayed on their individual webpage
     */
    addChip: function () {
      let tmpChip = {}

      if (this.chipType.value === 'SOURCE') {
        tmpChip = {
          index: this.curData.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'code',
            url: ''
          }
        }
      } else if (this.chipType.value === 'VIDEO') {
        tmpChip = {
          index: this.curData.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'movie',
            url: ''
          }
        }
      } else {
        tmpChip = {
          index: this.curData.webpage.chips.length + 1,
          content: {
            label: '',
            type: this.chipType.value,
            icon: null,
            url: ''
          }
        }
      }
      tmpChip['hidden'] = false
      this.curData.webpage.chips.push(tmpChip)
      this.updated = true
    },
    /**
     * create a list of members who are in charge of of the challenge
     * @param {Array<Object>} entry: list of member objects
     * @return {String}
     */
    displayMembers: function (entry) {
      let retMembers = ''

      entry.forEach(member => {
        retMembers += ', ' + member.name
      })

      return retMembers.substring(1, retMembers.length)
    },
    /**
     * trigger the description pop-up dialog
     * @param {String} entry: description of the challenge
     */
    popDialog: function (entry) {
      if (entry === 'awards') {
        this.dialogJSON['title'] = 'Impact Awards'
      } else {
        this.dialogJSON['title'] = entry.charAt(0).toUpperCase() + entry.slice(1)
      }

      if (entry === 'keywords' && this.curData[entry].length > 1) {
        let tmpArr = []
        this.curData[entry].forEach(key => {
          if (key !== 'tbd') {
            tmpArr.push(key)
          }
        })
        this.dialogJSON['message'] = tmpArr
      } else {
        this.dialogJSON['message'] = this.curData[entry]
      }

      this.fixedDialog = true
    },
    /**
     * get the path of the main photo of the project
     * @return {String}
     */
    getMainPhoto: function () {
      let val = `statics/images/computer-keyboard.jpg`

      if (this.$q.sessionStorage.has('boundless_config')) {
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        if (
          storedConfig && storedConfig.projectsConfig &&
          storedConfig.projectsConfig.webpage &&
          storedConfig.projectsConfig.webpage.mainImg.url &&
          storedConfig.projectsConfig.webpage.mainImg.active
        ) {
          val = storedConfig.projectsConfig.webpage.mainImg.url
        }
      }

      return val
    },
    /**
     * helper function to count up this.curData.progress
     */
    progressCountUp: function () {
      if (this.curData.progress === 2 * this.progressBar.tags.length - 1) {
        this.curData.progress = 0
      } else {
        this.curData.progress += 1
      }

      this.updated = true
    },
    /**
     * helper function to count down this.curData.progress
     */
    progressCountDown: function () {
      if (this.curData.progress === 0) {
        this.curData.progress = 2 * this.progressBar.tags.length - 1
      } else {
        this.curData.progress -= 1
      }
      this.updated = true
    },
    /**
     * helper function to handle adding new project member
     */
    addProjectMember: function () {
      let itemOptions = []

      for (let email in this.userEmailToObjMap) {
        let foundIn = false

        this.curData.members.forEach(member => {
          if (member.email === email) {
            foundIn = true
          }
        })

        if (!foundIn) {
          itemOptions.push({
            label: `${this.userEmailToObjMap[email].name} (${email})`,
            value: {
              ...this.userEmailToObjMap[email],
              role: 'member'
            }
          })
        }
        // itemOptions.push({
        //   label: `${this.userEmailToObjMap[email].name} (${email})`,
        //   value: {
        //     ...this.userEmailToObjMap[email],
        //     role: 'member'
        //   }
        // })
      }

      itemOptions.sort((a, b) => {
        return a.value.name.trim().localeCompare(b.value.name.trim())
      })

      this.addMemberDialog.visible = true
      this.addMemberDialog.edited = false
      this.addMemberDialog.options = itemOptions
      this.addMemberDialog.filter = itemOptions

      // let inUseMembers = []
      // this.curData.members.forEach(member => {
      //   inUseMembers.push({
      //     label: `${member.name} (${member.email})`,
      //     value: member
      //   })
      // })

      // this.addMemberDialog.use = inUseMembers

      this.addMemberDialog.use = this.curData.members
    },
    /**
     * 'close' event emitter
     */
    emitClose: function () {
      this.$emit('close')
    },
    /**
     * 'added' event emitter
     */
    emitAdded: function () {
      this.$emit('added')
    },
    /**
     * sort the content of this.data.webpage.body in order by index field
     */
    sortBody: function () {
      this.data.webpage.body.sort((a, b) => {
        return a.index - b.index
      })

      this.data.webpage.body.forEach(webContent => {
        if (webContent.content.type === 'ORDERED_LIST') {
          webContent.content.list.sort((a, b) => {
            return a.index - b.index
          })
        }
      })
    },
    /**
     * sort the content of this.data.webpage.chips in order by index field
     */
    sortChip: function () {
      this.data.webpage.chips.sort((a, b) => {
        return a.index - b.index
      })
    },
    /**
     * sort the content of this.curData.webpage.body in order by index field
     */
    curSortBody: function () {
      this.curData.webpage.body.sort((a, b) => {
        return a.index - b.index
      })

      this.curData.webpage.body.forEach(webContent => {
        if (webContent.content.type === 'ORDERED_LIST') {
          webContent.content.list.sort((a, b) => {
            return a.index - b.index
          })
        }
      })
    },
    /**
     * sort the content of this.curData.webpage.chips in order by index field
     */
    curSortChip: function () {
      this.curData.webpage.chips.sort((a, b) => {
        return a.index - b.index
      })
    },
    /**
     * open new tab given a link
     * @param {String} url: url of the link
     */
    openNewTab: function (url) {
      window.open(url, '_blank', 'noopener')
    },
    /**
     * helper function to display notify
     * @return {String}
     */
    notifyError: function () {
      this.$q.notify({
        color: 'negative',
        message: 'Field is required!',
        icon: 'warning'
      })
      return ''
    },
    /** Exports custom form questions and responses as markdown and saves the the user's clipboard. */
    exportCustomFormResponse () {
      const customFormResponse = this.curData.customFormResponse || []
      let markdownStr = '## Additional Q&A\n\n'
      customFormResponse.forEach((question) => {
        // Not using multiline string template since indenting messes with format.
        markdownStr += `**${question.label}**\n${question.response}\n\n`
      })
      this.copyTextToClipboard(markdownStr)
      this.$q.notify({
        message: 'Additional questions and responses have been copied.',
        type: 'positive',
        timeout: 2000
      })
    },
    /** Delte the custom form response field. */
    async deleteCustomFormResponse () {
      if (this.hasCustomFormResponse) {
        this.$q.dialog({
          title: 'Confirm',
          message: 'Delete custom form questions and responses?',
          cancel: true
        }).onOk(async () => {
          // Create a document reference
          const projectRef = this.db.collection('projects').doc(this.curData.uuid)

          await projectRef.update({
            customFormResponse: firebase.firestore.FieldValue.delete()
          })
          Vue.set(this.curData, 'customFormResponse', [])

          this.$q.notify({
            message: 'Additional questions and responses have been deleted.',
            type: 'positive',
            timeout: 2000
          })
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.q-tab-panel > div.tab-content
  margin auto
  max-width 1000px
  min-width 800px
  border-radius 3px
  text-align center

#project-review-form
  max-width: 80%

.project-img
  border 3px solid #ddd
  border-radius: 4px
  padding 5px

.overview
  max-height 240px
  overflow auto

.toggle-label
  margin-top 5px
  font-size 10.5px
</style>
