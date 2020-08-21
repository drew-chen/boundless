<!-- //This layout is empty. In other wordss, it has no header, footer, left-side drawer, or right-side drawer. QHeader
// I want a QFooter
// I want a left-side QDrawer
// I want a right-side QDrawer
 -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
