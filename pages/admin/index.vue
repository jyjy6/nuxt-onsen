<script setup lang="ts">
const menuItems = [
  {
    title: "콘텐츠 추가",
    path: "/admin/add/contents",
  },
  {
    title: "에피소드 추가",
    path: "/admin/add/episodes",
  },
];
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <p>어드민 페이지임</p>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                :to="item.path"
                link
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped></style>
