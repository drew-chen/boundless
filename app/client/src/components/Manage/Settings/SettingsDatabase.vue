<template>
  <div>
    <div class="text-h4">
      Database
      <q-separator color="secondary" />
    </div>
    <div class="q-mb-sm q-ml-md">
      ({{ dbId }})
    </div>
    <q-page>
      <manage-database
        @importingToDB="consoleLoading"
        @databaseId="loadDatabaseId"
      />
      <div
        class="q-px-sm q-mt-lg"
        :hidden="!layoutConfig.switchDatabase"
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
          v-model="db"
          @input="switchDatabase"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import ManageDatabase from '../components/GetDataFromFirestore'

export default {
  components: {
    ManageDatabase
  }
}
</script>

<style>

</style>
