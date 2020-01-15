<template>
  <v-app>
    <MainToolbar/>
    <v-content>
      <nuxt/>
    </v-content>
    <v-footer padless>
    <!--<v-layout justify-center row wrap>
      <v-flex primary lighten-1 py-3 text-center white--text xs12>
        &copy;2019 — <strong>Sample</strong>
      </v-flex>
    </v-layout>-->
    <v-row
      justify="center"
      no-gutters
    >
      <v-col
        class="primary lighten-1 py-4 text-center white--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} - <strong>Sample</strong>
      </v-col>
    </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import MainToolbar from '~/components/MainToolbar.vue'

export default {
  components: {
    MainToolbar
  }
}
</script>
