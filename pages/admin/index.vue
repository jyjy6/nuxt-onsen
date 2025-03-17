<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6" style="margin: 0 auto"> 어드민 페이지 입니다. </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.v-list {
  flex-direction: row;
  flex-wrap: wrap;
}

.v-list-item {
  width: auto;
}
</style>
