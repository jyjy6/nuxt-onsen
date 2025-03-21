<template>
  <v-container>
    <v-row>
      <v-col cols="6" style="margin: 0 auto">
        <v-card>
          <v-card-text>
            <v-list class="d-flex">
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

    <!-- 하위 페이지 컨텐츠가 여기에 렌더링됩니다 -->
    <slot />
  </v-container>
</template>

<script setup lang="ts">
const menuItems = [
  {
    title: "콘텐츠 추가",
    path: "/admin/add/contents",
  },
  {
    title: "모든 방송 리스트",
    path: "/broadcast/list",
  },
  {
    title: "진행자 추가",
    path: "/admin/add/personality",
  },
  {
    title: "공지사항 추가",
    path: "/admin/add/notice",
  },
  {
    title: "IP정보확인",
    path: "/admin/ipList",
  },
  {
    title: "회원목록&관리",
    path: "/admin/memberlist",
  },
];
</script>

<style scoped>
.v-list {
  flex-direction: row;
  flex-wrap: wrap;
}

.v-list-item {
  width: auto;
}
</style>
