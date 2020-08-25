<template>
  <q-page class="q-ma-sm flex items-center">
    <div
      v-if="ToC"
      class="q-gutter-sm q-pa-md"
    >
      ToC Content:
      <q-separator color="secondary"></q-separator>
      <q-card v-for="(v, k) in ToC" :key="k.id">
        {{ v.project }}: {{ v.uuid }}
        <q-separator color="secondary"></q-separator>

        <ul>
          <li v-for="(va, ke) in v" :key="ke.id">
            {{ ke }}: {{ va }}
          </li>
        </ul>

        Webpage:
        <q-separator color="secondary"></q-separator>

        <ul>
          <li v-for="(val, key) in data[k].webpage" :key="key.id">
            {{ key }}: {{ val }}
          </li>
        </ul>
      </q-card>
    </div>

    <div
      v-if="alias"
      class="q-gutter-sm q-pa-md"
      style="width: 100vw;"
    >
      Alias Content:
      <q-separator color="secondary"></q-separator>
      <q-card v-for="(v, k) in alias" :key="k.id">
        <ul>
          <li>{{ k }}: {{ v }}</li>
        </ul>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import productionDb, { productionStorage } from '../../firebase/init_production'
import testingDb, { testingStorage } from '../../firebase/init_testing'

export default {
  async created () {
    try {
      if (this.$q.localStorage.has('boundless_db')) {
        if (this.$q.localStorage.getItem('boundless_db') === 'testing') {
          this.db = testingDb
          this.storage = testingStorage
        } else {
          this.db = productionDb
          this.storage = productionStorage
        }
      }
  
      let snap = await this.db.collection('projects').get()

      snap.docs.forEach(doc => {
        if (doc.id !== 'ToC') {
          this.data[doc.id] = doc.data()
        } else {
          this.ToC = doc.data()
          this.alias = this.ToC.alias
          delete this.ToC.alias
        }
      })
    } catch (error) {
      throw error
    }
  },
  data () {
    return {
      db: null,
      storage: null,
      ToC: null,
      alias: null,
      data: {}
    }
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>

</style>
