<script setup lang="ts">
function helloVuetify() {
  setTimeout(() => {
    alert("こんにちは、ビューティファイ");
  }, 280);
}
</script>

<template>
  <v-main>
    <v-container class="text-center">
      <v-row>
        <v-col>
          <h1>Welcome to Nuxt 3 with Vuetify</h1>
          <p>This is your home page. Customize it as you like!</p>
          <v-btn color="primary" class="ma-2" @click="helloVuetify()">
            Click Me
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #555;
}
</style>
