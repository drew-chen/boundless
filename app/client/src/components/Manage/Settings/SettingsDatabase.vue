<template>
  <div
    v-if="settingProps.name === 'database'"
  >
    <div class="text-h4">
      Database
      <q-separator color="secondary" />
    </div>
    <div class="q-mb-sm q-ml-md">
      ({{ settingProps.dbId }})
    </div>
    <q-page>
      <get-data-from-firestore
        @importingToDB="settingProps.consoleLoading"
        @databaseId="settingProps.setDatabaseId"
      />
      <div
        class="q-px-sm q-mt-lg"
        :hidden="settingProps.hideDatabaseSwitch"
      >
        <div class="q-pb-sm">
          <b class="text-h6">Switch Database</b>
          <q-separator color="secondary" />
        </div>
        <q-btn-toggle
          push no-caps
          toggle-color="positive"
          :options="[
            {label: 'Primary', value: 'production'},
            {label: 'Test', value: 'testing'}
          ]"
          :value="settingProps.db"
          @input="settingProps.switchDatabase"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import GetDataFromFirestore from '../../../components/GetDataFromFirestore.vue'

export default {
  props: {
    // Object containing all custom props. See structure in 'ManageSettings.vue'.
    settingProps: {
      type: Object,
      required: true
    }
  },
  components: {
    GetDataFromFirestore
  }
}
</script>

<style>

</style>
