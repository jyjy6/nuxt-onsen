<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const logs = ref([]);

onMounted(async () => {
  try {
    const { data } = await axios.get("/api/log/get");
    logs.value = data;
  } catch (error) {
    console.error("Failed to fetch logs", error);
  }
});
</script>

<template>
  <v-container>
    <h2>📊 방문자 로그</h2>
    <v-table>
      <thead>
        <tr>
          <th>IP 주소</th>
          <th>User-Agent</th>
          <th>방문 시간</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log._id">
          <td>{{ log.ip }}</td>
          <td>{{ log.userAgent }}</td>
          <td>{{ new Date(log.timestamp).toLocaleString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
